import { FC } from 'react';
import { NavLink, Outlet } from 'react-router';

const menu = [
  {
    url: 'argocd',
    title: 'ArgoCD',
  },
  {
    url: 'jenkins',
    title: 'Jenkins',
  },
  {
    url: 'gitlab-ci',
    title: 'Gitlab CI',
  },
];

export const ArgoStackLayout: FC = () => {
  return (
    <div className="flex h-full items-center">
      <div className="flex h-full w-full max-w-96 flex-col items-center justify-center">
        {menu.map((link) => (
          <NavLink
            key={link.url}
            to={link.url}
            className={({ isActive }) =>
              `block w-full rounded-md p-4 text-center text-white outline-none transition-all ${isActive ? 'bg-orchid-medium text-white' : ''}`
            }
          >
            {link.title}
          </NavLink>
        ))}
      </div>
      <div className="flex h-[calc(100vh-100px)] w-2/3 justify-center overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
