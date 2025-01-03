import {
  createRef,
  FC,
  MouseEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { NavLink, useLocation } from 'react-router';
import { User } from './components/user';
import { cn } from '../../lib/utils';

const navbar = [
  {
    title: 'Chats',
    subMenu: [
      {
        title: 'Basic',
        link: '/chats/basic',
      },
      {
        title: 'Bug Fix',
        link: '/chats/bug-fix',
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
            link: '/template-generation/infrastructure-as-code/hashicorp-terraform',
          },
          {
            title: 'CloudFormation',
            link: '/template-generation/infrastructure-as-code/cloudformation',
          },
          {
            title: 'Pulumi',
            link: '/template-generation/infrastructure-as-code/pulumi',
          },
        ],
      },
      {
        title: 'Configuration Management',
        subMenu: [
          {
            title: 'Ansible',
            link: '/template-generation/configuration-management/ansible',
          },
        ],
      },
      {
        title: 'Container Orchestration and Management',
        subMenu: [
          {
            title: 'Helm',
            link: '/template-generation/container-orchestration-and-management/helm',
          },
          {
            title: 'Docker Compose',
            link: '/template-generation/container-orchestration-and-management/docker-compose',
          },
        ],
      },
      {
        title: 'CI/CD Tools',
        subMenu: [
          {
            title: 'Jenkins',
            link: '/template-generation/cicd-tools/jenkins',
          },
          {
            title: 'GitHub Actions',
            link: '/template-generation/cicd-tools/github-actions',
          },
          {
            title: 'GitLab CI',
            link: '/template-generation/cicd-tools/gitlab-ci',
          },
          {
            title: 'Argo CD',
            link: '/template-generation/cicd-tools/argocd',
          },
        ],
      },
      {
        title: 'Workflow Orchestration',
        subMenu: [
          {
            title: 'Argo Workflows',
            link: '/template-generation/workflow-orchestration/argo-workflows',
          },
        ],
      },
      {
        title: 'Continuous Delivery and Progressive Delivery',
        subMenu: [
          {
            title: 'Argo Rollouts',
            link: '/template-generation/continuous-delivery-and-progressive-delivery/argo-rollouts',
          },
        ],
      },
      {
        title: 'Image Building',
        subMenu: [
          {
            title: 'Hashicorp Packer',
            link: '/template-generation/image-building/hashicorp-packer',
          },
        ],
      },
      {
        title: 'Monitor',
        subMenu: [
          {
            title: 'Grafana',
            link: '/template-generation/monitor/grafana',
          },
        ],
      },
      {
        title: 'Secret Management',
        subMenu: [
          {
            title: 'Cert Manager',
            link: '/template-generation/secret-management/cert-manager',
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
  const [activeSubSubMenu, setActiveSubSubMenu] = useState();
  const [subSubMenuPosition, setSubSubMenuPosition] = useState({
    top: 0,
    left: 0,
  });

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
    const handleClickOutside = (event: any) => {
      setActiveSubSubMenu(undefined);
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
    setActiveSubSubMenu(undefined);
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

          if ('subMenu' in subMenu && subMenu.subMenu) {
            for (const subSubMenu of subMenu.subMenu) {
              if (location.pathname === subSubMenu.link) {
                return {
                  parentTitle: parent.title,
                  subTitle: subMenu.title,
                  subSubTitle: subSubMenu.title,
                };
              }
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

  const handleHoverMenuItem = (subItem: any, e?: MouseEvent) => {
    setActiveSubSubMenu(subItem);
    if (e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setSubSubMenuPosition({
        top: rect.top,
        left: rect.left + rect.width + 10,
      });
    }
  };

  return (
    <>
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
            className="absolute top-14 z-[60] w-fit rounded-md border border-gray-800 bg-gray-400/10 bg-clip-padding backdrop-blur-lg backdrop-contrast-100 backdrop-saturate-100 backdrop-filter transition-all"
            style={{
              left: position.left,
            }}
          >
            <div className="flex h-fit w-full flex-col gap-2 rounded-lg">
              {navbar.map(
                (item) =>
                  item.subMenu &&
                  item.title === menu &&
                  item.subMenu.map((subItem) =>
                    'subMenu' in subItem ? (
                      <button
                        onMouseEnter={(e) => handleHoverMenuItem(subItem, e)}
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
      <div
        onMouseLeave={() => handleHoverMenuItem(undefined)}
        style={{
          left: subSubMenuPosition.left,
          top: subSubMenuPosition.top,
        }}
        className={cn(
          'absolute left-full top-0 z-50 ml-2 hidden h-fit w-96 flex-col gap-2 overflow-y-hidden rounded-lg border border-gray-800 bg-gray-400/10 bg-clip-padding backdrop-blur-lg backdrop-contrast-100 backdrop-saturate-100 backdrop-filter',
          {
            flex: activeSubSubMenu,
          },
        )}
      >
        {(activeSubSubMenu as any)?.subMenu.map((subSubItem: any) => (
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
    </>
  );
};

export default Navbar;
