import { cn } from '@/lib/utils';
import { FC, useState } from 'react';
import { SignIn } from './components/sign-in';
import { SignUp } from './components/sign-up';
import { supabaseClient } from '@/lib/supabase';

const Auth: FC = () => {
  const [authType, setAuthType] = useState('sign in');

  const handleAuthType = (type: 'sign in' | 'sign up') => {
    if (type !== authType) {
      setAuthType(type);
    }
  };

  const handleLoginWithGoogle = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: '/' },
    });
  };

  const handleLoginWithGithub = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: '/' },
    });
  };

  return (
    <section className="h-dvh w-full bg-vignette-radial">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center justify-center">
          <div className="mb-10 flex w-full items-center justify-around">
            <button
              onClick={() => handleAuthType('sign in')}
              className={cn('text-lg font-bold text-white transition-all', {
                'text-orchid-light': authType === 'sign in',
              })}
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuthType('sign up')}
              className={cn('text-lg font-bold transition-all', {
                'text-orchid-light': authType === 'sign up',
              })}
            >
              Sign Up
            </button>
          </div>
          {authType === 'sign in' && <SignIn />}
          {authType === 'sign up' && <SignUp />}
          <div className="my-7 flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-gray-800" />
            <p className="text-sm font-semibold">OR</p>
            <div className="h-px flex-1 bg-gray-800" />
          </div>
          <div className="w-full space-y-2">
            <button
              onClick={handleLoginWithGoogle}
              className="hover:bg-orchid-medium/50 flex w-full items-center justify-center gap-4 rounded-md border border-gray-800 py-4 text-sm font-semibold text-white transition-all"
            >
              <img src="/images/google.svg" width={24} />
              Continue with google
            </button>
            <button
              onClick={handleLoginWithGithub}
              className="hover:bg-orchid-medium/50 flex w-full items-center justify-center gap-4 rounded-md border border-gray-800 py-4 text-sm font-semibold text-white transition-all"
            >
              <img src="/images/github.svg" width={24} />
              Continue with github
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
