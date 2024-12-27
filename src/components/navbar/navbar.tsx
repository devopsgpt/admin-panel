import { createRef, FC, RefObject, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { User } from './components/user';
import { cn } from '@/lib/utils';

const navbar = [
  {
    title: 'Chats',
    subMenu: [
      {
        title: 'Basic',
        link: '/',
      },
      {
        title: 'Bug Fix',
        link: '/bug-fix',
      },
    ],
  },
  {
    title: 'Template Generation',
    subMenu: [
      {
        title: 'Infrastructure as Code (IaC)',
        subMenu: [
          {
            title: 'Hashicorp Terraform',
            link: '/terraform-template',
          },
          {
            title: 'CloudFormation',
            link: '/cloudformation',
          },
          {
            title: 'Pulumi',
            link: '/pulumi',
          },
        ],
      },
      {
        title: 'Configuration Management',
        subMenu: [
          {
            title: 'Ansible',
            link: '/ansible-template',
          },
        ],
      },
      {
        title: 'Container Orchestration and Management',
        subMenu: [
          {
            title: 'Helm',
            link: '/helm-template',
          },
          {
            title: 'Docker Compose',
            link: '/docker-compose',
          },
        ],
      },
      {
        title: 'CI/CD Tools',
        subMenu: [
          {
            title: 'Jenkins',
            link: '/jenkins',
          },
          {
            title: 'GitHub Actions',
            link: '/github-actions',
          },
          {
            title: 'GitLab CI',
            link: '/gitlab-ci',
          },
          {
            title: 'Argo CD',
            link: '/argo-cd',
          },
        ],
      },
      {
        title: 'Workflow Orchestration',
        subMenu: [
          {
            title: 'Argo Workflows',
            link: '/argo-workflows',
          },
        ],
      },
      {
        title: 'Continuous Delivery and Progressive Delivery',
        subMenu: [
          {
            title: 'Argo-Rollouts',
            link: '/argo-rollouts',
          },
        ],
      },
      {
        title: 'Image Building',
        subMenu: [
          {
            title: 'Hashicorp Packer',
            link: '/hashicorp-packer',
          },
        ],
      },
      {
        title: 'Monitor',
        subMenu: [
          {
            title: 'Grafana',
            link: '/grafana',
          },
        ],
      },
      {
        title: 'Secret Management',
        subMenu: [
          {
            title: 'Cert Manager',
            link: '/cert-manager',
          },
        ],
      },
    ],
  },
  {
    title: 'Installation',
    subMenu: [
      {
        title: 'Docker',
        link: '/installation/docker',
      },
      {
        title: 'Jenkins',
        link: '/installation/jenkins',
      },
      {
        title: 'Gitlab',
        link: '/installation/gitlab',
      },
      {
        title: 'Terraform',
        link: '/installation/terraform',
      },
    ],
  },
];

const Navbar: FC = () => {
  const [menu, setMenu] = useState<'Chats' | 'Templates' | 'Installation'>();
  const [position, setPosition] = useState({ left: 0 });

  const location = useLocation();

  const menuKeys = Object.keys(navbar);
  const buttonRefs = useRef<RefObject<HTMLButtonElement>[]>(
    menuKeys.map(() => createRef<HTMLButtonElement>()),
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const [activeMenu, setActiveMenu] = useState({
    parentTitle: '',
    subTitle: '',
    subSubTitle: '',
  });

  useEffect(() => {
    if (menu && menuRef.current) {
      const buttonRef = buttonRefs.current.find(
        (ref) => ref.current?.textContent === menu,
      );
      if (buttonRef?.current) {
        const buttonLeft = buttonRef.current.offsetLeft;
        setPosition({ left: buttonLeft });
      }
    }
  }, [menu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenu(undefined);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const findActiveMenu = () => {
      let active = { parentTitle: '', subTitle: '', subSubTitle: '' };

      for (const parent of navbar) {
        for (const subMenu of parent.subMenu) {
          if (location.pathname === (subMenu as any).link) {
            return {
              parentTitle: parent.title,
              subTitle: subMenu.title,
              subSubTitle: '',
            };
          }

          if (location.pathname.startsWith((subMenu as any).link)) {
            active = {
              parentTitle: parent.title,
              subTitle: subMenu.title,
              subSubTitle: '',
            };
          }

          if ('subMenu' in subMenu) {
            for (const sub of subMenu.subMenu) {
              return {
                parentTitle: parent.title,
                subTitle: subMenu.title,
                subSubTitle: sub.title,
              };
            }
          }
        }
      }

      return active;
    };
    setActiveMenu(findActiveMenu());
  }, [location.pathname, navbar]);

  const handleButtonClick = (menuItem: string) => {
    if (menu === menuItem) {
      setMenu(undefined);
    } else {
      setMenu(menuItem as keyof typeof menu);
    }
  };

  const handleHoverMenuItem = (item: string) => {
    setActiveMenu((prev) => ({
      ...prev,
      subSubTitle: item,
    }));
  };

  return (
    <div className="relative mt-4 flex w-full justify-center">
      <nav
        ref={navRef}
        className="isolate z-10 flex w-full items-center justify-between rounded-lg border border-gray-800 bg-gray-500/10 bg-clip-padding pr-4 backdrop-blur backdrop-contrast-100 backdrop-saturate-100 backdrop-filter"
      >
        <div className="flex items-center">
          {navbar.map((item, index) => (
            <button
              ref={buttonRefs.current[index]}
              onClick={() => handleButtonClick(item.title)}
              key={item.title}
              className={cn(
                'w-full cursor-pointer whitespace-nowrap px-4 py-3 text-center',
                {
                  'text-orchid-medium': activeMenu.parentTitle === item.title,
                },
              )}
            >
              {item.title}
            </button>
          ))}
        </div>
        <User />
      </nav>
      {menu && (
        <div
          ref={menuRef}
          className="absolute top-14 z-[60] w-fit rounded-md transition-all"
          style={{
            left: position.left,
          }}
        >
          <div className="flex h-fit w-full flex-col gap-2 rounded-lg border border-gray-800 bg-gray-400/10 bg-clip-padding backdrop-blur-lg backdrop-contrast-100 backdrop-saturate-100 backdrop-filter">
            {navbar.map(
              (item) =>
                item.subMenu &&
                item.title === menu &&
                item.subMenu.map((subItem) =>
                  'subMenu' in subItem ? (
                    <button
                      onMouseEnter={() => handleHoverMenuItem(subItem.title)}
                      key={subItem.title}
                      className={cn(
                        'relative w-full px-4 py-3 text-center text-white',
                        {
                          'text-orchid-medium':
                            activeMenu.subTitle === subItem.title,
                        },
                      )}
                    >
                      {subItem.title}
                      <div
                        onMouseLeave={() => handleHoverMenuItem('')}
                        className={cn(
                          'absolute left-full top-0 ml-2 hidden h-fit w-full flex-col gap-2 overflow-y-hidden rounded-lg border border-gray-800 bg-slate-900',
                          {
                            flex: activeMenu.subSubTitle === subItem.title,
                          },
                        )}
                      >
                        {subItem.subMenu.map((subSubItem) => (
                          <NavLink
                            to={(subSubItem as any).link}
                            key={subSubItem.title}
                            className={({ isActive }) =>
                              cn('w-full px-8 py-3 text-center text-white', {
                                'text-orchid-medium': isActive,
                              })
                            }
                          >
                            {subSubItem.title}
                          </NavLink>
                        ))}
                      </div>
                    </button>
                  ) : (
                    <NavLink
                      to={(subItem as any).link}
                      key={subItem.title}
                      className={({ isActive }) =>
                        cn('w-full px-8 py-3 text-center text-white', {
                          'text-orchid-medium': isActive,
                        })
                      }
                    >
                      {subItem.title}
                    </NavLink>
                  ),
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
