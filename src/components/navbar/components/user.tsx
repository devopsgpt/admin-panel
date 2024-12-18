import { supabaseClient } from '@/lib/supabase';
import { useUserStore } from '@/store';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router';

export const User: FC = () => {
  const { user } = useUserStore();
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="relative flex w-full max-w-44 items-center justify-end gap-2">
      <p className="text-sm font-semibold text-white/80">
        {user?.user_metadata.preferred_username}
      </p>
      <button
        className="rounded-full border bg-white"
        onClick={() => setMenu(!menu)}
      >
        <img
          src={user?.user_metadata.avatar_url || '/images/user-placeholder.png'}
          width={28}
          className="rounded-full object-contain p-[1px]"
        />
      </button>
      {menu && (
        <div className="absolute -bottom-14 right-0 z-50 w-full">
          <div className="w-full overflow-hidden rounded-md border border-gray-800 bg-gray-900">
            <button
              onClick={handleSignOut}
              className="bg-red-70 flex w-full items-center justify-center gap-2 bg-red-700 p-2 text-white"
            >
              {user?.app_metadata.provider === 'github' && (
                <img src="/images/github.svg" width={24} />
              )}
              {user?.app_metadata.provider === 'google' && (
                <img src="/images/google.svg" width={24} />
              )}
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
