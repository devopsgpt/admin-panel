import { FC } from 'react';
import { NavLink, Outlet } from 'react-router';

const menu = [
  {
    url: 'docker',
    title: 'Docker Service',
  },
  {
    url: 'argocd',
    title: 'ArgoCD Service',
  },
  {
    url: 'grafana-alerting-as-code',
    title: 'Grafana Alerting As Code',
  },
  {
    url: 'aws',
    title: 'AWS',
  },
];

export const HashicorpTerraformLayout: FC = () => {
  return (
    <div className="flex h-full items-center gap-6">
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
      <div className="flex h-full w-2/3 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};
