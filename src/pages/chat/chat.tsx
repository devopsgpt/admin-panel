import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { CornerRightUp, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { Chats, ChatResponse } from './chat.types';
import { BeatLoader } from 'react-spinners';
import { isAxiosError } from 'axios';
import { chatInstance } from '../../lib/axios';
import { CHAT_API } from '../../config/global';
import { cn } from '../../lib/utils';
import { ReactTyped } from 'react-typed';

export const Chat: FC = () => {
  const [chats, setChats] = useState<Chats[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );
  const [isSupportSpeech, setIsSupportSpeech] = useState<boolean>(false);

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
      setIsSupportSpeech(true);
      setRecognition(recognitionInstance);
    } else {
      setIsSupportSpeech(false);
    }
  }, []);

  useEffect(() => {
    scrollToEnd();
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
      } else {
        inputRef.current.setAttribute('data-placeholder', '');
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

  const scrollToEnd = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

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
    setContent(transcriptArray);
    resetSilenceTimer();
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      return;
    } else if (
      e.key === 'Enter' &&
      inputRef.current?.textContent?.length !== 0 &&
      !loading
    ) {
      handleSendMessage();
    }
  };

  const handleInput = (e: FormEvent<HTMLParagraphElement>) => {
    if (inputRef.current) {
      setContent(e.currentTarget.innerText);
    }
  };

  const handleSendMessage = async () => {
    if (!inputRef.current) return;
    const msg = inputRef.current.innerHTML;
    const input = inputRef.current.innerText;
    inputRef.current.innerText = '';
    setContent('');
    setLoading(true);
    try {
      setChats((prev) => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: '', loading: true },
      ]);

      const {
        data: { response },
      } = await chatInstance.post<ChatResponse>(`${CHAT_API}?prompt=${msg}`);
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
      <div className="relative flex h-full max-h-[800px] w-full max-w-full">
        <div className="flex h-full w-full flex-col justify-between gap-2 rounded-md bg-gray-600/20 bg-clip-padding p-3 backdrop-blur-md backdrop-contrast-100 backdrop-saturate-100 backdrop-filter">
          <div
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-corner-transparent"
            ref={messagesRef}
          >
            {chats.map((chat, index) =>
              chat.role === 'user' ? (
                <div key={index} className="chat chat-end max-w-full">
                  <div className="chat-bubble w-fit max-w-[50%] whitespace-pre-wrap break-words bg-orchid-medium/80 text-white">
                    {chat.content}
                  </div>
                </div>
              ) : (
                <div key={index} className="chat chat-start max-w-full">
                  <div className="chat-bubble w-fit max-w-[50%] whitespace-pre-wrap bg-orchid-medium/50 text-white">
                    {chat.loading ? (
                      <BeatLoader color="#e3e3e3" size={10} />
                    ) : (
                      <ReactTyped
                        onComplete={scrollToEnd}
                        typeSpeed={10}
                        strings={[chat.content.replaceAll(/<br>/g, '\n')]}
                        showCursor={false}
                        className="break-words"
                      />
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
              onInput={handleInput}
              onKeyDown={handleEnter}
              data-placeholder="Message_HobsAi"
              className="relative max-h-36 min-h-[32px] w-full overflow-y-auto rounded-md scrollbar-thin before:left-0 before:top-0 before:text-gray-400 before:content-[attr(data-placeholder)] placeholder:before:absolute placeholder:before:text-gray-400 focus:outline-none"
            ></p>
            <div className="flex items-center justify-between">
              <button
                onClick={handleListening}
                disabled={loading || !isSupportSpeech}
                className={cn(
                  'flex size-9 items-center justify-center rounded-full bg-white transition-all disabled:opacity-50',
                  {
                    'bg-red-500': isListening,
                  },
                )}
                {...(!isSupportSpeech && {
                  title: 'Your browser does not support speech recognition.',
                })}
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
