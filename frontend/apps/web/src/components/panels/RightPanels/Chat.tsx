import { useState } from 'react';

interface ChatProps {
  isOpen: boolean;
}

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: number;
}

export function Chat({ isOpen }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        '好出发了！看起来你想要创建一个数组来储存数字，但在C++中，你不能在数组大小不确定时使用 vector 来动态地分配存储空间，还有，在第9行，你的循环没有意义，因为...',
      type: 'assistant',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-900 p-4 flex flex-col h-full">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded p-3 ${
              message.type === 'user' ? 'bg-blue-600 ml-8' : 'bg-gray-800 mr-8'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 rounded bg-gray-800 px-3 py-2 text-white"
          placeholder="输入消息..."
        />
        <button
          onClick={handleSend}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
        >
          发送
        </button>
      </div>
    </div>
  );
}
