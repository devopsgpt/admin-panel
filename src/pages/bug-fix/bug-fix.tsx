import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { CornerRightUp, Settings } from 'lucide-react';
import { API } from '@/enums/api.enums';
import { BugFixBody, BugFixMessage, BugFixResponse } from './bug-fix.types';
import { usePost } from '@/core/react-query';
import { toast } from 'sonner';
import { BeatLoader } from 'react-spinners';
import { isAxiosError } from 'axios';
import { cn } from '@/lib/utils';

const BugFix: FC = () => {
  const { mutateAsync } = usePost<BugFixResponse, BugFixBody>(
    API.BugFix,
    'bug-fix',
  );

  const [minToken, setMinToken] = useState('100');
  const [maxToken, setMaxToken] = useState('500');
  const [service, setService] = useState('terraform');
  const [version, setVersion] = useState('latest');
  const [bugDescription, setBugDescription] = useState('');
  const [messages, setMessages] = useState<BugFixMessage[]>([]);
  const [configMenu, setConfigMenu] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleBugDescription = (e: FormEvent<HTMLTextAreaElement>) => {
    setBugDescription(e.currentTarget.value);
  };

  const handleSendMessage = async () => {
    try {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: bugDescription },
        { role: 'assistant', content: '', loading: true },
      ]);

      const body: BugFixBody = {
        max_tokens: parseInt(maxToken),
        min_tokens: parseInt(minToken),
        service,
        bug_description: bugDescription,
        version,
      };
      const {
        data: { output },
      } = await mutateAsync(body);
      setBugDescription('');
      setMessages((prev) =>
        prev.map((message, index) =>
          index === prev.length - 1
            ? { ...message, content: output, loading: false }
            : message,
        ),
      );
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1));
      if (isAxiosError(error)) {
        if (error.response?.data.detail) {
          toast.error(error.response.data.detail);
        } else {
          toast.error('Something went wrong');
        }
      }
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center text-white">
      <div className="w-full max-w-[1024px]">
        <div className="w-full rounded-md">
          <div
            ref={messagesRef}
            className="h-[600px] w-full overflow-y-auto rounded-md bg-gray-600/20 bg-clip-padding p-3 backdrop-blur-md backdrop-contrast-100 backdrop-saturate-100 backdrop-filter scrollbar-thin scrollbar-track-transparent scrollbar-corner-transparent"
          >
            {messages.map((message) =>
              message.role === 'user' ? (
                <div className="chat chat-end max-w-full">
                  <div className="chat-bubble bg-orchid-medium/80 text-white">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="chat chat-start max-w-full">
                  <div className="chat-bubble bg-orchid-medium/50 text-white">
                    {message.loading ? (
                      <BeatLoader color="#e3e3e3" size={10} />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="relative mt-4 gap-2 rounded-md border border-gray-800 bg-black-1 p-3">
          <textarea
            value={bugDescription}
            rows={3}
            onChange={handleBugDescription}
            placeholder={'Ask me anything...'}
            className={
              'relative max-h-24 min-h-6 w-full resize-none overflow-auto text-wrap break-words outline-none scrollbar-thin'
            }
          />
          <div className="flex items-center justify-between">
            <button
              onClick={() => setConfigMenu(!configMenu)}
              className={cn('rounded-full bg-white p-1 transition-all', {
                'rotate-180': configMenu,
              })}
            >
              <Settings className="size-6 stroke-black" />
            </button>
            <button
              disabled={bugDescription.length === 0}
              className="rounded-full bg-white p-1 transition-all disabled:opacity-50"
              onClick={handleSendMessage}
            >
              <CornerRightUp className="size-6 stroke-black" />
            </button>
          </div>
          {configMenu && (
            <div className="absolute bottom-14 left-2.5 flex w-full max-w-64 flex-col gap-3 rounded-md border border-gray-800 bg-black-1 p-3">
              <div className="flex w-full flex-col">
                <label htmlFor="min_token" className="mb-1 text-sm">
                  Min Token
                </label>
                <input
                  id="min_token"
                  type="number"
                  value={minToken}
                  onChange={(e) => setMinToken(e.target.value)}
                  className="w-full rounded-md border border-gray-800 bg-black-1 p-2 outline-none"
                />
              </div>
              <div className="flex w-full flex-col">
                <label htmlFor="max_token" className="mb-1 text-sm">
                  Max Token
                </label>
                <input
                  id="max_token"
                  type="number"
                  value={maxToken}
                  onChange={(e) => setMaxToken(e.target.value)}
                  className="w-full rounded-md border border-gray-800 bg-black-1 p-2 outline-none"
                />
              </div>
              <div className="flex w-full flex-col">
                <label htmlFor="service" className="mb-1 text-sm">
                  Service
                </label>
                <input
                  id="service"
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-md border border-gray-800 bg-black-1 p-2 outline-none"
                />
              </div>
              <div className="flex w-full flex-col">
                <label htmlFor="version" className="mb-1 text-sm">
                  Version
                </label>
                <input
                  id="version"
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full rounded-md border border-gray-800 bg-black-1 p-2 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BugFix;
