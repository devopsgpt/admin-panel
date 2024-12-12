import Navbar from '@/components/navbar/navbar';
import { FC } from 'react';
import { Outlet } from 'react-router';

const MainLayout: FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto h-dvh max-w-7xl border-l border-r border-gray-700">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
