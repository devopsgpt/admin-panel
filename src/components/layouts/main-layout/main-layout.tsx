import Navbar from '../../../components/navbar/navbar';
import { FC } from 'react';
import { Outlet } from 'react-router';

const MainLayout: FC = () => {
  return (
    <div className="container mx-auto h-dvh max-w-7xl">
      <div className="flex h-full flex-col">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
