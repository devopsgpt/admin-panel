import { FC } from 'react';
import { NavLink, Outlet } from 'react-router';

const menu = [
  {
    url: 'alert-rules',
    title: 'Alert Rules',
  },
  {
    url: 'loki-logql',
    title: 'Loki LogQL',
  },
  {
    url: 'alertmanager-datasource',
    title: 'Alertmanager Datasource',
  },
  {
    url: 'elasticsearch-datasource',
    title: 'Elasticsearch Datasource',
  },
  {
    url: 'loki-datasource',
    title: 'Loki Datasource',
  },
  {
    url: 'mimir-datasource',
    title: 'Mimir Datasource',
  },
  {
    url: 'mysql-datasource',
    title: 'MySQL Datasource',
  },
  {
    url: 'postgres-datasource',
    title: 'Postgres Datasource',
  },
  {
    url: 'prometheus-datasource',
    title: 'Prometheus Datasource',
  },
];

export const GrafanaLayout: FC = () => {
  return (
    <div className="flex items-center h-full">
      <div className="flex flex-col items-center justify-center w-full h-full max-w-96">
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
      <div className="flex items-center justify-center w-2/3 h-full">
        <Outlet />
      </div>
    </div>
  );
};
