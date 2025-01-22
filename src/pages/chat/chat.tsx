import { FC, useEffect, useRef, useState } from 'react';
import { CornerRightUp, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { Chats, ChatResponse } from './chat.types';
import { BeatLoader } from 'react-spinners';
import { isAxiosError } from 'axios';
import { chatInstance } from '../../lib/axios';
import { CHAT_API } from '../../config/global';
import { cn } from '../../lib/utils';

export const Chat: FC = () => {
  const [chats, setChats] = useState<Chats[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLParagraphElement>(null);
  const silenceTimer = useRef<number | null>(null);

  const SILENCE_TIMEOUT = 1000;

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = true;
      recognitionInstance.continuous = true;

      setRecognition(recognitionInstance);
    } else {
      alert('Your browser does not support speech recognition.');
    }
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chats]);

  useEffect(() => {
    if (recognition) {
      recognition.onresult = handleResult;
      recognition.onerror = handleError;
      recognition.onend = () => {
        console.log('Speech recognition stopped.');
        setIsListening(false);
        clearSilenceTimer();
      };
    }
  }, [recognition]);

  useEffect(() => {
    const handleBlur = () => {
      if (inputRef.current && !inputRef.current.textContent?.trim()) {
        inputRef.current.setAttribute('data-placeholder', 'Message HobsAi');
        inputRef.current.innerHTML = '';
      }
    };

    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.setAttribute('data-placeholder', '');
      }
    };

    const handleInput = () => {
      if (inputRef.current) {
        const text = inputRef.current.textContent?.trim() || '';
        if (text === '' && inputRef.current.innerHTML.includes('<br>')) {
          inputRef.current.innerHTML = '';
        }
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus);
      inputRef.current.addEventListener('blur', handleBlur);
      inputRef.current.addEventListener('input', handleInput);

      if (!inputRef.current.textContent?.trim()) {
        inputRef.current.setAttribute('data-placeholder', 'Message HobsAi');
        inputRef.current.innerHTML = '';
      }
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleFocus);
        inputRef.current.removeEventListener('blur', handleBlur);
        inputRef.current.removeEventListener('input', handleInput);
      }
    };
  }, [content]);

  const clearSilenceTimer = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimer.current = window.setTimeout(() => {
      handleListening();
    }, SILENCE_TIMEOUT);
  };

  const handleError = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === 'no-speech') {
      resetSilenceTimer();
      recognition?.start();
    } else {
      handleListening();
    }
  };

  const handleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  };

  const handleResult = (event: SpeechRecognitionEvent) => {
    const transcriptArray = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(' ');
    inputRef.current!.innerText = transcriptArray;

    resetSilenceTimer();
  };

  const handleSendMessage = async () => {
    if (!inputRef.current) return;
    const msg = inputRef.current.innerText;
    try {
      setLoading(true);
      setChats((prev) => [
        ...prev,
        { role: 'user', content: msg },
        { role: 'assistant', content: '', loading: true },
      ]);

      const {
        data: { response },
      } = await chatInstance.post<ChatResponse>(`${CHAT_API}?prompt=${msg}`);
      inputRef.current.innerText = '';
      setContent('');
      setChats((prev) =>
        prev.map((message, index) =>
          index === prev.length - 1
            ? { ...message, content: response, loading: false }
            : message,
        ),
      );
    } catch (error) {
      console.log(error);
      setChats((prev) => prev.slice(0, -1));
      if (isAxiosError(error)) {
        if (error.response?.data.detail) {
          toast.error(error.response.data.detail);
        } else {
          toast.error('Something went wrong');
        }
        setChats((prev) =>
          prev.filter((_, index) => index !== prev.length - 1),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center text-white">
      <div className="relative flex h-full max-h-[85%] w-full max-w-full">
        <div
          ref={messagesRef}
          className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto rounded-md bg-gray-600/20 bg-clip-padding p-3 backdrop-blur-md backdrop-contrast-100 backdrop-saturate-100 backdrop-filter scrollbar-thin scrollbar-track-transparent scrollbar-corner-transparent"
        >
          <div className="flex-1">
            {chats.map((chat, index) =>
              chat.role === 'user' ? (
                <div key={index} className="chat chat-end max-w-full">
                  <div className="chat-bubble w-fit max-w-[50%] bg-orchid-medium/80 text-white">
                    {chat.content}
                  </div>
                </div>
              ) : (
                <div key={index} className="chat chat-start max-w-full">
                  <div className="chat-bubble w-fit max-w-[50%] bg-orchid-medium/50 text-white">
                    {chat.loading ? (
                      <BeatLoader color="#e3e3e3" size={10} />
                    ) : (
                      chat.content
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="relative flex flex-col gap-2 rounded-md border border-gray-800 p-3">
            <p
              ref={inputRef}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(e) => setContent(e.currentTarget.innerText)}
              data-placeholder="Message_HobsAi"
              className="relative min-h-[32px] w-full rounded-md before:left-0 before:top-0 before:text-gray-400 before:content-[attr(data-placeholder)] placeholder:before:absolute placeholder:before:text-gray-400 focus:outline-none"
            ></p>
            <div className="flex items-center justify-between">
              <button
                onClick={handleListening}
                disabled={loading}
                className={cn(
                  'flex size-9 items-center justify-center rounded-full bg-white transition-all disabled:opacity-50',
                  {
                    'bg-red-500': isListening,
                  },
                )}
              >
                <Mic
                  className={cn('size-5 stroke-black', {
                    'stroke-white': isListening,
                  })}
                />
              </button>
              <button
                disabled={content.length === 0 || loading}
                className="flex size-8 items-center justify-center rounded-full bg-white transition-all disabled:opacity-50"
                onClick={handleSendMessage}
              >
                <CornerRightUp className="size-6 stroke-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
