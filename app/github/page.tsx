// import { Metadata } from 'next';
// import Image from 'next/image';
// import GitHubCalendar from 'react-github-calendar';
// import { VscRepo, VscPerson, VscStarEmpty, VscRepoForked, VscLinkExternal, VscGithub } from 'react-icons/vsc';

// import RepoCard from '@/components/RepoCard';
// import { Repo, User } from '@/types';

// import styles from '@/styles/GithubPage.module.css';

// export const metadata: Metadata = {
//   title: 'GitHub',
// };

// export const revalidate = 600;

// async function getGithubData() {
//   const userRes = await fetch(
//     `https://api.github.com/users/${process.env.GITHUB_USERNAME}`
//   );
//   if (!userRes.ok) {
//     throw new Error(`Failed to fetch user: ${userRes.status}`);
//   }
//   const user: User = await userRes.json();

//   const repoRes = await fetch(
//     `https://api.github.com/users/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}/repos?sort=pushed&per_page=6`
//   );
//   if (!repoRes.ok) {
//     throw new Error(`Failed to fetch repos: ${repoRes.status}`);
//   }
//   const repos: Repo[] = await repoRes.json();

//   return { user, repos };
// }

// export default async function GithubPage() {
//   const { user, repos } = await getGithubData();

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         {/* Header */}
//         <header className={styles.header}>
//           <div className={styles.profile}>
//             <Image
//               src={user.avatar_url}
//               className={styles.avatar}
//               alt={user.login}
//               width={80}
//               height={80}
//               priority
//             />
//             <div className={styles.profileInfo}>
//               <h1 className={styles.name}>{user.login}</h1>
//               <span className={styles.handle}>@{user.login}</span>
//             </div>
//           </div>

//           <a 
//             href={`https://github.com/${user.login}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.profileLink}
//           >
//             <VscGithub size={18} />
//             <span>View Profile</span>
//             <VscLinkExternal size={14} />
//           </a>
//         </header>

//         {/* Stats */}
//         <div className={styles.statsGrid}>
//           <div className={styles.statCard}>
//             <div className={styles.statIcon}>
//               <VscRepo size={20} />
//             </div>
//             <div className={styles.statInfo}>
//               <span className={styles.statValue}>{user.public_repos}</span>
//               <span className={styles.statLabel}>Repositories</span>
//             </div>
//           </div>

//           <div className={styles.statCard}>
//             <div className={styles.statIcon}>
//               <VscPerson size={20} />
//             </div>
//             <div className={styles.statInfo}>
//               <span className={styles.statValue}>{user.followers}</span>
//               <span className={styles.statLabel}>Followers</span>
//             </div>
//           </div>

//           <div className={styles.statCard}>
//             <div className={styles.statIcon}>
//               <VscStarEmpty size={20} />
//             </div>
//             <div className={styles.statInfo}>
//               <span className={styles.statValue}>
//                 {repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
//               </span>
//               <span className={styles.statLabel}>Total Stars</span>
//             </div>
//           </div>
//         </div>

//         {/* Contribution Graph */}
//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>Contribution Activity</h2>
//           <div className={styles.contributions}>
//             <GitHubCalendar
//               username={process.env.NEXT_PUBLIC_GITHUB_USERNAME!}
//               hideColorLegend
//               hideMonthLabels
//               colorScheme="dark"
//               theme={{
//                 dark: ['#161B22', '#0e4429', '#006d32', '#26a641', '#39d353'],
//                 light: ['#161B22', '#0e4429', '#006d32', '#26a641', '#39d353'],
//               }}
//               style={{
//                 width: '100%',
//               }}
//             />
//           </div>
//         </section>

//         {/* Repositories */}
//         <section className={styles.section}>
//           <div className={styles.sectionHeader}>
//             <h2 className={styles.sectionTitle}>Popular Repositories</h2>
//             <a 
//               href={`https://github.com/${user.login}?tab=repositories`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className={styles.viewAll}
//             >
//               View All
//               <VscLinkExternal size={14} />
//             </a>
//           </div>
          
//           <div className={styles.reposGrid}>
//             {repos.map((repo) => (
//               <RepoCard key={repo.id} repo={repo} />
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

import { Metadata } from "next";
import Image from "next/image";
import GitHubCalendar from "react-github-calendar";
import {
  VscRepo,
  VscPerson,
  VscStarEmpty,
  VscGitCommit,
  VscLinkExternal,
  VscGithub,
} from "react-icons/vsc";

import RepoCard from "@/components/RepoCard";
import { Repo, User } from "@/types";
import styles from "@/styles/GithubPage.module.css";

export const metadata: Metadata = {
  title: "GitHub",
};

export const revalidate = 600;

async function getGithubData() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };

  // 👤 USER
  const userRes = await fetch(
    `https://api.github.com/users/${username}`,
    { headers, next: { revalidate: 600 } }
  );
  const user: User = await userRes.json();

  // 📦 ALL REPOS (for stars)
  const repoRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    { headers, next: { revalidate: 600 } }
  );
  const repos: Repo[] = await repoRes.json();

  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0
  );

  // 🚀 TOTAL COMMITS
  const commitRes = await fetch(
    `https://api.github.com/search/commits?q=author:${username}`,
    {
      headers: {
        ...headers,
        Accept: "application/vnd.github.cloak-preview",
      },
      next: { revalidate: 600 },
    }
  );

  const commitData = await commitRes.json();
  const totalCommits = commitData.total_count;

  // 🔥 Top 6 latest pushed repos for UI
  const latestRepos = repos
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() -
        new Date(a.pushed_at).getTime()
    )
    .slice(0, 6);

  return { user, latestRepos, totalStars, totalCommits };
}

export default async function GithubPage() {
  const { user, latestRepos, totalStars, totalCommits } =
    await getGithubData();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.profile}>
            <Image
              src={user.avatar_url}
              className={styles.avatar}
              alt={user.login}
              width={80}
              height={80}
              priority
            />
            <div className={styles.profileInfo}>
              <h1 className={styles.name}>{user.login}</h1>
              <span className={styles.handle}>
                @{user.login}
              </span>
            </div>
          </div>

          <a
            href={`https://github.com/${user.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <VscGithub size={18} />
            <span>View Profile</span>
            <VscLinkExternal size={14} />
          </a>
        </header>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {/* Repositories */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscRepo size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {user.public_repos}
              </span>
              <span className={styles.statLabel}>
                Repositories
              </span>
            </div>
          </div>

          {/* Followers */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscPerson size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {user.followers}
              </span>
              <span className={styles.statLabel}>
                Followers
              </span>
            </div>
          </div>

          {/* Stars */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscStarEmpty size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {totalStars}
              </span>
              <span className={styles.statLabel}>
                Total Stars
              </span>
            </div>
          </div>

          {/* Commits */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscGitCommit size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {totalCommits}
              </span>
              <span className={styles.statLabel}>
                Total Commits
              </span>
            </div>
          </div>
        </div>

        {/* Contribution Graph */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Contribution Activity
          </h2>

          <div className={styles.contributionsWrapper}>
            <GitHubCalendar
              username={
                process.env
                  .NEXT_PUBLIC_GITHUB_USERNAME!
              }
              hideColorLegend
              hideMonthLabels
              blockSize={12}
              blockMargin={4}
              fontSize={12}
              colorScheme="dark"
            />
          </div>
        </section>

        {/* Repositories */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Popular Repositories
            </h2>

            <a
              href={`https://github.com/${user.login}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewAll}
            >
              View All
              <VscLinkExternal size={14} />
            </a>
          </div>

          <div className={styles.reposGrid}>
            {latestRepos.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}