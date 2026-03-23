export interface Project {
  title: string;
  description: string;
  logo: string;
  link: string;
  slug: string;
}

export const projects: Project[] = [
  {
    title: 'EchoVerse',
    description:
      'EchoVerse, a dynamic chat and video call platform that connects you with friends, acquaintances, or strangers!',
    logo: '/logos/ca.svg',
    link: 'https://github.com/ermadhav/ChatApp',
    slug: 'EchoVerse',
  },
  {
    title: 'ISS Tracker',
    description:
      'Track the real-time location of the International Space Station (ISS) on a 3D globe, and receive email alerts when its passing near your location',
    logo: '/logos/iss.svg',
    link: 'https://github.com/ermadhav/ISS_Tracker',
    slug: 'ISS Tracker',
  },
  {
    title: 'AI Reel Generator',
    description:
      'A simple and elegant way to create your Reel using AI.',
    logo: '/logos/subtrackt.svg',
    link: 'https://github.com/ermadhav/Python/tree/master/project1',
    slug: 'subtrackt',
  },
  {
    title: 'Dev Streaks',
    description:
      'VSCode extension to track and deploy your Coolify applications.',
    logo: '/logos/coolify.svg',
    link: 'https://github.com/itsnitinr/coolify-vscode-extension',
    slug: 'coolify-vscode-extension',
  },
];
