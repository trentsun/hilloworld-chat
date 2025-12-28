'use client';

import { useState, useEffect } from 'react';
import Sidebar, { Conversation } from '@/components/Sidebar';
import ChatWindow, { Message } from '@/components/ChatWindow';
import ModelSelector from '@/components/ModelSelector';

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('grok-4-fast');

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations).map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        model: conv.model || 'grok-4-fast', // 默认模型
      }));
      setConversations(parsed);
      
      // Load the most recent conversation if available
      if (parsed.length > 0) {
        const mostRecent = parsed[0];
        setCurrentConversationId(mostRecent.id);
        setSelectedModel(mostRecent.model || 'grok-4-fast');
        loadMessages(mostRecent.id);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      localStorage.setItem(`messages_${currentConversationId}`, JSON.stringify(messages));
    }
  }, [messages, currentConversationId]);

  const loadMessages = (conversationId: string) => {
    const savedMessages = localStorage.getItem(`messages_${conversationId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([]);
    }
  };

  const createNewConversation = () => {
    const newId = `conv_${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: '新对话',
      createdAt: new Date(),
      model: selectedModel,
    };
    
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newId);
    setMessages([]);
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
    const conversation = conversations.find((conv) => conv.id === id);
    if (conversation) {
      setSelectedModel(conversation.model || 'grok-4-fast');
    }
    loadMessages(id);
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter((conv) => conv.id !== id);
    setConversations(updated);
    localStorage.removeItem(`messages_${id}`);
    
    if (currentConversationId === id) {
      if (updated.length > 0) {
        setCurrentConversationId(updated[0].id);
        loadMessages(updated[0].id);
      } else {
        setCurrentConversationId(null);
        setMessages([]);
      }
    }
  };

  const updateConversationTitle = (id: string, firstMessage: string) => {
    // 使用第一句话作为标题，去除换行和多余空格
    const cleanMessage = firstMessage.replace(/\n/g, ' ').trim();
    const title = cleanMessage.slice(0, 30) || '新对话';
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, title, model: selectedModel } : conv
      )
    );
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    // 更新当前对话的模型
    if (currentConversationId) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId ? { ...conv, model } : conv
        )
      );
    }
  };

  const sendMessage = async (content: string) => {
    let conversationId = currentConversationId;
    
    if (!conversationId) {
      const newId = `conv_${Date.now()}`;
      const newConversation: Conversation = {
        id: newId,
        title: '新对话',
        createdAt: new Date(),
        model: selectedModel,
      };
      setConversations([newConversation, ...conversations]);
      setCurrentConversationId(newId);
      setMessages([]);
      conversationId = newId;
    }

    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Update title if this is the first message - use first sentence
    if (messages.length === 0 && conversationId) {
      updateConversationTitle(conversationId, content);
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
        };
        setMessages([...newMessages, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `错误: ${error.message || '无法连接到 AI 服务，请检查网络连接和 API 配置。'}`,
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const editMessage = async (index: number, newContent: string) => {
    if (index < 0 || index >= messages.length) return;
    
    const messageToEdit = messages[index];
    if (messageToEdit.role !== 'user') return; // 只能编辑用户消息

    // 更新消息内容
    const updatedMessages = [...messages];
    updatedMessages[index] = { ...messageToEdit, content: newContent };

    // 删除该消息之后的所有消息（因为编辑后需要重新生成回复）
    const messagesToKeep = updatedMessages.slice(0, index + 1);
    setMessages(messagesToKeep);

    // 如果这是第一条消息，更新标题
    if (index === 0 && currentConversationId) {
      updateConversationTitle(currentConversationId, newContent);
    }

    // 如果有后续消息（即之前有AI回复），重新发送请求
    if (messages.length > index + 1) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messagesToKeep,
            model: selectedModel,
          }),
        });

        const data = await response.json();

        if (data.success) {
          const assistantMessage: Message = {
            role: 'assistant',
            content: data.message,
          };
          setMessages([...messagesToKeep, assistantMessage]);
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      } catch (error: any) {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          role: 'assistant',
          content: `错误: ${error.message || '无法连接到 AI 服务，请检查网络连接和 API 配置。'}`,
        };
        setMessages([...messagesToKeep, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
      />
      <div className="flex-1 flex flex-col">
        {currentConversationId ? (
          <>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
            />
            <ChatWindow
              messages={messages}
              onSendMessage={sendMessage}
              onEditMessage={editMessage}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center text-gray-400">
              <div className="text-2xl font-semibold mb-2">选择一个对话</div>
              <div className="text-sm">或创建一个新对话开始聊天</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

