import { FC } from 'react';

export const SignIn: FC = () => {
  return (
    <form className="flex w-full shrink-0 flex-col gap-4">
      <div className="flex w-full flex-col gap-1">
        <label>Email</label>
        <input className="rounded-md border border-gray-800 p-2 outline-none transition-all hover:border-gray-700 focus:border-gray-600" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <label>Password</label>
        <input
          type="password"
          className="rounded-md border border-gray-800 p-2 outline-none transition-all hover:border-gray-700 focus:border-gray-600"
        />
      </div>
      <button
        className="bg-orchid-medium hover:bg-orchid-medium/70 disabled:bg-orchid-medium/50 mt-4 w-full rounded-md py-3 text-sm font-semibold disabled:cursor-not-allowed"
        disabled={true}
      >
        Coming Soon
      </button>
    </form>
  );
};
