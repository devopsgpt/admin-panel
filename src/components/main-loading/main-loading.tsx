import { FC } from 'react';

const MainLoading: FC = () => {
  return (
    <div className="absolute left-0 top-0 z-50 h-dvh w-full bg-[#000]">
      <div className="flex h-full items-center justify-center text-white">
        <img src="/images/loading.gif" className="h-full w-full object-none" />
      </div>
    </div>
  );
};

export default MainLoading;
