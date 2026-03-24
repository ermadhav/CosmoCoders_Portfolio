'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  VscSymbolColor,
  VscTerminal,
  VscGoToFile,
  VscGear,
  VscColorMode,
  VscHome,
  VscAccount,
  VscCode,
  VscMail,
  VscGithubAlt,
} from 'react-icons/vsc';
import { SiLeetcode } from 'react-icons/si';
import { MdNavigateNext } from 'react-icons/md';

import { THEMES } from '@/lib/themes';
import styles from '@/styles/CommandPalette.module.css';

interface Command {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
}

const CommandPalette = ({
  isOpen,
  onClose,
  onToggleTerminal,
  isTerminalOpen,
}: CommandPaletteProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ✅ NEW: key sequence support (G → L etc.)
  const keySequence = useRef<string[]>([]);
  const sequenceTimeout = useRef<NodeJS.Timeout | null>(null);

  const getCommands = useCallback((): Command[] => {
    return [
      {
        id: 'go-home',
        label: 'Go to Home',
        category: 'Navigation',
        shortcut: 'G H',
        icon: <VscHome size={16} />,
        action: () => router.push('/'),
      },
      {
        id: 'go-about',
        label: 'Go to About',
        category: 'Navigation',
        shortcut: 'G A',
        icon: <VscAccount size={16} />,
        action: () => router.push('/about'),
      },
      {
        id: 'go-projects',
        label: 'Go to Projects',
        category: 'Navigation',
        shortcut: 'G P',
        icon: <VscCode size={16} />,
        action: () => router.push('/projects'),
      },

      // ✅ LEETCODE (fixed)
      {
        id: 'go-leetcode',
        label: 'Open LeetCode',
        category: 'Navigation',
        shortcut: 'G L',
        icon: <SiLeetcode size={16} />, // no color → matches theme
        action: () =>
          window.open('https://leetcode.com/your-username', '_blank'),
      },

      {
        id: 'go-github',
        label: 'Go to GitHub',
        category: 'Navigation',
        shortcut: 'G G',
        icon: <VscGithubAlt size={16} />,
        action: () => router.push('/github'),
      },
      {
        id: 'go-contact',
        label: 'Go to Contact',
        category: 'Navigation',
        shortcut: 'G C',
        icon: <VscMail size={16} />,
        action: () => router.push('/contact'),
      },
      {
        id: 'go-settings',
        label: 'Go to Settings',
        category: 'Navigation',
        shortcut: 'G S',
        icon: <VscGear size={16} />,
        action: () => router.push('/settings'),
      },
      {
        id: 'toggle-terminal',
        label: isTerminalOpen ? 'Close Terminal' : 'Open Terminal',
        category: 'Terminal',
        shortcut: 'Ctrl+`',
        icon: <VscTerminal size={16} />,
        action: onToggleTerminal,
      },
      {
        id: 'change-theme',
        label: 'Change Color Theme',
        category: 'Preferences',
        shortcut: 'K T',
        icon: <VscSymbolColor size={16} />,
        action: () => setShowThemePicker(true),
      },
    ];
  }, [router, onToggleTerminal, isTerminalOpen]);

  const commands = getCommands();

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredThemes = THEMES.filter((theme) =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = useCallback(
    (index: number) => {
      if (showThemePicker) {
        if (index < filteredThemes.length) {
          const theme = filteredThemes[index];
          document.documentElement.setAttribute('data-theme', theme.theme);
          localStorage.setItem('theme', theme.theme);
          onClose();
        }
      } else {
        if (index < filteredCommands.length) {
          filteredCommands[index].action();
          if (filteredCommands[index].id !== 'change-theme') {
            onClose();
          }
        }
      }
    },
    [filteredCommands, filteredThemes, onClose, showThemePicker]
  );

  // ✅ UPDATED KEY HANDLER (sequence support)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (sequenceTimeout.current) {
        clearTimeout(sequenceTimeout.current);
      }

      sequenceTimeout.current = setTimeout(() => {
        keySequence.current = [];
      }, 800);

      // Capture letters for sequences
      if (/^[a-zA-Z]$/.test(e.key)) {
        keySequence.current.push(e.key.toUpperCase());

        const sequence = keySequence.current.join(' ');
        const match = filteredCommands.find(
          (cmd) => cmd.shortcut === sequence
        );

        if (match) {
          e.preventDefault();
          match.action();
          onClose();
          keySequence.current = [];
          return;
        }
      }

      if (e.key === 'Escape') {
        if (showThemePicker) {
          setShowThemePicker(false);
          setSearchQuery('');
          setSelectedIndex(0);
        } else {
          onClose();
        }
        return;
      }

      const items = showThemePicker ? filteredThemes : filteredCommands;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(selectedIndex);
      }
    },
    [
      isOpen,
      onClose,
      filteredCommands,
      filteredThemes,
      selectedIndex,
      handleSelect,
      showThemePicker,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchQuery('');
      setSelectedIndex(0);
      setShowThemePicker(false);
      keySequence.current = [];
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, showThemePicker]);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.inputWrapper}>
          <VscGoToFile size={20} className={styles.inputIcon} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              showThemePicker
                ? 'Select color theme'
                : 'Type a command or search...'
            }
            className={styles.input}
          />
        </div>

        <div className={styles.results} ref={listRef}>
          {filteredCommands.map((cmd, index) => (
            <div
              key={cmd.id}
              className={`${styles.item} ${
                selectedIndex === index ? styles.selected : ''
              }`}
              onClick={() => handleSelect(index)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className={styles.itemIcon}>{cmd.icon}</div>
              <div className={styles.itemContent}>
                <span className={styles.itemLabel}>{cmd.label}</span>
              </div>
              {cmd.shortcut && (
                <div className={styles.shortcut}>
                  {cmd.shortcut.split(' ').map((key, i) => (
                    <span key={i} className={styles.key}>
                      {key}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;