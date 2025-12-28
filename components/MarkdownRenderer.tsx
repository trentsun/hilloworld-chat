'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // 自定义代码块渲染
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            
            return !inline && match ? (
              <div className="relative my-4">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-xs rounded-t-lg">
                  <span className="uppercase">{match[1]}</span>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(codeString);
                        // 可以添加一个提示
                      } catch (err) {
                        console.error('Failed to copy code:', err);
                      }
                    }}
                    className="hover:text-white transition-colors flex items-center gap-1"
                    title="复制代码"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">复制</span>
                  </button>
                </div>
                <pre className={`${className} rounded-b-lg rounded-t-none overflow-x-auto m-0`} {...props}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="px-1.5 py-0.5 bg-gray-200 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          // 自定义表格渲染
          table({ children }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }: any) {
            return <thead className="bg-gray-100">{children}</thead>;
          },
          th({ children }: any) {
            return (
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }: any) {
            return (
              <td className="border border-gray-300 px-4 py-2">
                {children}
              </td>
            );
          },
          // 自定义链接渲染
          a({ href, children }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {children}
              </a>
            );
          },
          // 自定义引用块渲染
          blockquote({ children }: any) {
            return (
              <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 bg-gray-50 italic text-gray-700">
                {children}
              </blockquote>
            );
          },
          // 自定义列表渲染
          ul({ children }: any) {
            return <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>;
          },
          ol({ children }: any) {
            return <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol>;
          },
          li({ children }: any) {
            return <li className="my-1">{children}</li>;
          },
          // 自定义段落渲染
          p({ children }: any) {
            return <p className="my-3 leading-relaxed">{children}</p>;
          },
          // 自定义标题渲染
          h1({ children }: any) {
            return <h1 className="text-2xl font-bold mt-6 mb-3 pb-2 border-b border-gray-200">{children}</h1>;
          },
          h2({ children }: any) {
            return <h2 className="text-xl font-bold mt-5 mb-2 pb-2 border-b border-gray-200">{children}</h2>;
          },
          h3({ children }: any) {
            return <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>;
          },
          h4({ children }: any) {
            return <h4 className="text-base font-semibold mt-3 mb-1">{children}</h4>;
          },
          h5({ children }: any) {
            return <h5 className="text-sm font-semibold mt-2 mb-1">{children}</h5>;
          },
          h6({ children }: any) {
            return <h6 className="text-xs font-semibold mt-2 mb-1 text-gray-600">{children}</h6>;
          },
          // 自定义水平线渲染
          hr() {
            return <hr className="my-6 border-t border-gray-300" />;
          },
          // 自定义图片渲染
          img({ src, alt }: any) {
            return (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg my-4 shadow-md"
                loading="lazy"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

