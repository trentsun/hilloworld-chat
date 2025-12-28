'use client';

export interface Model {
  id: string;
  name: string;
  description?: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  models?: Model[];
}

const defaultModels: Model[] = [
  { id: 'grok-4-fast', name: 'Grok-4-fast', description: '快速且高效的模型' },
  { id: 'deepseek', name: 'DeepSeek', description: '快速且经济实惠的模型' },
  { id: 'supermind-agent-v1', name: 'Supermind Agent', description: '多工具代理，支持网络搜索' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Google Gemini 模型' },
  { id: 'gpt-5', name: 'GPT-5', description: 'OpenAI GPT-5 模型' },
];

export default function ModelSelector({
  selectedModel,
  onModelChange,
  models = defaultModels,
}: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        模型:
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} {model.description ? `- ${model.description}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}

