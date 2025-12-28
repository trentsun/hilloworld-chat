# ChatGPT Clone

一个类似 ChatGPT 的聊天界面，使用 Next.js 构建，集成 AI Builder API 和 Grok-4-fast 模型。

## 功能特性

- 🎨 两列布局：左侧对话列表，右侧聊天界面
- 💬 多对话管理：创建、切换、删除对话
- 🤖 集成 Grok-4-fast 模型
- 💾 本地存储：对话历史保存在浏览器 localStorage
- 📱 响应式设计：现代化的 UI 界面

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件，添加以下内容：

```
AI_BUILDER_TOKEN=your_token_here
NEXT_PUBLIC_API_BASE_URL=https://space.ai-builders.com/backend
```

**重要提示**：请确保 `.env.local` 文件已添加到 `.gitignore` 中，不要将 API token 提交到版本控制系统。

### 3. 运行开发服务器

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
.
├── app/
│   ├── api/
│   │   └── chat/          # API 路由处理聊天请求
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/
│   ├── Sidebar.tsx        # 左侧对话列表组件
│   └── ChatWindow.tsx    # 右侧聊天窗口组件
├── lib/
│   └── api.ts            # API 客户端配置
└── package.json
```

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **OpenAI SDK** - AI Builder API 客户端
- **localStorage** - 本地数据存储

## API 配置

本项目使用 AI Builder API，支持以下模型：
- `grok-4-fast` (默认)
- `deepseek`
- `supermind-agent-v1`
- `gemini-2.5-pro`
- `gpt-5`

API 基础 URL: `https://space.ai-builders.com/backend`

## 使用说明

1. **创建新对话**：点击左侧边栏的"新建对话"按钮
2. **发送消息**：在右侧输入框输入消息，按 Enter 发送（Shift+Enter 换行）
3. **切换对话**：点击左侧边栏中的任意对话
4. **删除对话**：将鼠标悬停在对话上，点击删除图标

## 注意事项

- API token 需要从 AI Builder 平台获取
- 对话历史保存在浏览器本地存储中，清除浏览器数据会丢失历史记录
- 确保网络连接正常以访问 AI Builder API

