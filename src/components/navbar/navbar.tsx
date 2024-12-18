import { createRef, FC, RefObject, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { User } from './components/user';

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
        title: 'Terraform',
        link: '/terraform-template',
      },
      {
        title: 'Helm',
        link: '/helm-template',
      },
      {
        title: 'Ansible',
        link: '/ansible-template',
      },
      {
        title: 'Docker Compose',
        link: '/docker-compose',
      },
      {
        title: 'AWS CloudFormation',
        link: '/aws-cloudformation',
      },
      {
        title: 'Pulumi',
        link: '/pulumi',
      },
      {
        title: 'GitHub Actions',
        link: '/github-actions',
      },
      {
        title: 'Grafana',
        link: '/grafana',
      },
      {
        title: 'Hashicorp Packer',
        link: '/hashicorp-packer',
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

  const menuKeys = Object.keys(navbar);
  const buttonRefs = useRef<RefObject<HTMLButtonElement>[]>(
    menuKeys.map(() => createRef<HTMLButtonElement>()),
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

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

  const handleButtonClick = (menuItem: string) => {
    if (menu === menuItem) {
      setMenu(undefined);
    } else {
      setMenu(menuItem as keyof typeof menu);
    }
  };

  return (
    <div className="relative mt-4 flex w-full justify-center">
      <nav
        ref={navRef}
        className="isolate flex w-full items-center justify-between rounded-lg border border-gray-800 bg-gray-500/10 bg-clip-padding pr-4 backdrop-blur backdrop-contrast-100 backdrop-saturate-100 backdrop-filter"
      >
        <div className="flex items-center">
          {navbar.map((item, index) => (
            <button
              ref={buttonRefs.current[index]}
              onClick={() => handleButtonClick(item.title)}
              key={item.title}
              className="w-full cursor-pointer whitespace-nowrap px-4 py-3 text-center"
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
            {menu &&
              navbar
                .find((item) => item.title === menu)
                ?.subMenu?.map((subItem) => (
                  <Link
                    key={subItem.title}
                    to={subItem.link}
                    className="w-full px-8 py-3 text-center text-white"
                  >
                    {subItem.title}
                  </Link>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
