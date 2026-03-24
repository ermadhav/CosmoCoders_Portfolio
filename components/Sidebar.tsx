'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  VscAccount,
  VscSettings,
  VscMail,
  VscGithubAlt,
  VscCode,
  VscFiles,
} from 'react-icons/vsc';
import { SiLeetcode } from 'react-icons/si';

import styles from '@/styles/Sidebar.module.css';

const sidebarTopItems = [
  { Icon: VscFiles, path: '/' },
  { Icon: VscGithubAlt, path: '/github' },
  { Icon: VscCode, path: '/projects' },
  { Icon: SiLeetcode, path: '/leetcode' }, 
  { Icon: VscMail, path: '/contact' },
];

const sidebarBottomItems = [
  { Icon: VscAccount, path: '/about' },
  { Icon: VscSettings, path: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        {sidebarTopItems.map(({ Icon, path }) => {
          const isExternal = path.startsWith('http');

          return isExternal ? (
            <a
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              key={path}
            >
              <div className={styles.iconContainer}>
                <Icon size={16} className={styles.icon} />
              </div>
            </a>
          ) : (
            <Link href={path} key={path}>
              <div
                className={`${styles.iconContainer} ${
                  pathname === path ? styles.active : ''
                }`}
              >
                <Icon
                  size={16}
                  fill={
                    pathname === path
                      ? 'rgb(225, 228, 232)'
                      : 'rgb(106, 115, 125)'
                  }
                  className={styles.icon}
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className={styles.sidebarBottom}>
        {sidebarBottomItems.map(({ Icon, path }) => (
          <div className={styles.iconContainer} key={path}>
            <Link href={path}>
              <Icon
                size={16}
                fill={
                  pathname === path
                    ? 'rgb(225, 228, 232)'
                    : 'rgb(106, 115, 125)'
                }
                className={styles.icon}
              />
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;