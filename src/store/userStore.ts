import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface UserSlice {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserSlice>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
}));
