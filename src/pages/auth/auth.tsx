import { cn } from '@/lib/utils';
import { FC, useState } from 'react';
import { SignIn } from './components/sign-in';
import { SignUp } from './components/sign-up';

const Auth: FC = () => {
  const [authType, setAuthType] = useState('sign in');

  const handleAuthType = (type: 'sign in' | 'sign up') => {
    if (type !== authType) {
      setAuthType(type);
    }
  };

  return (
    <section className="h-dvh w-full">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center justify-center">
          <div className="mb-10 flex w-full items-center justify-around">
            <button
              onClick={() => handleAuthType('sign in')}
              className={cn('text-lg font-bold transition-all', {
                'text-orange-base': authType === 'sign in',
              })}
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuthType('sign up')}
              className={cn('text-lg font-bold transition-all', {
                'text-orange-base': authType === 'sign up',
              })}
            >
              Sign Up
            </button>
          </div>
          {authType === 'sign in' && <SignIn />}
          {authType === 'sign up' && <SignUp />}
          <div className="my-7 flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-gray-500" />
            <p className="text-sm font-semibold">OR</p>
            <div className="h-px flex-1 bg-gray-500" />
          </div>
          <button className="flex w-full items-center justify-center gap-4 rounded-md border border-gray-500 py-4 text-sm">
            <img src="/images/google.svg" width={24} />
            Continue with google
          </button>
        </div>
      </div>
    </section>
  );
};

export default Auth;
