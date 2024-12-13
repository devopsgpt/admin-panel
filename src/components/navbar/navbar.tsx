import { FC } from 'react';
import { NavLink } from 'react-router';
import { User } from './components/user';
import { cn } from '@/lib/utils';

const navbar = [
  {
    url: '/',
    title: 'Basic',
  },
  {
    url: '/bug-fix',
    title: 'Bug Fix',
  },
  {
    url: '/installation',
    title: 'Installation',
  },
  {
    url: '/terraform-template',
    title: 'Terraform Template',
  },
  {
    url: '/helm-template',
    title: 'Helm Template',
  },
  {
    url: '/docker-compose',
    title: 'Docker Compose',
  },
  {
    url: '/ansible-template',
    title: 'Ansible Template',
  },
];

const Navbar: FC = () => {
  return (
    <nav className="flex h-20 items-center">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          {navbar.map((link) => (
            <NavLink
              key={link.url}
              to={link.url}
              className={({ isActive }) =>
                cn('text-gray-400 transition-all', {
                  'text-orchid-light': isActive,
                })
              }
            >
              {link.title}
            </NavLink>
          ))}
        </div>
        <User />
      </div>
    </nav>
  );
};

export default Navbar;
