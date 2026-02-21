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
    { headers }
  );
  const user: User = await userRes.json();

  // 📦 ALL REPOS
  const repoRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    { headers }
  );
  const repos: Repo[] = await repoRes.json();

  // ⭐ TOTAL STARS
  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0
  );

  // 🚀 REAL TOTAL COMMITS (MATCHES GRAPH)
  let totalCommits = 0;

  await Promise.all(
    repos.map(async (repo) => {
      if (repo.fork) return;

      try {
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=1`,
          { headers }
        );

        const link = res.headers.get("link");

        if (link) {
          const match = link.match(/&page=(\d+)>; rel="last"/);
          if (match) {
            totalCommits += parseInt(match[1]);
          }
        } else {
          const data = await res.json();
          if (Array.isArray(data)) {
            totalCommits += data.length;
          }
        }
      } catch {}
    })
  );

  // 🔥 Latest 6 repos
  const latestRepos = repos
    .filter((r) => !r.fork)
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
              <span className={styles.handle}>@{user.login}</span>
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

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscRepo size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{user.public_repos}</span>
              <span className={styles.statLabel}>Repositories</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscPerson size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{user.followers}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscStarEmpty size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalStars}</span>
              <span className={styles.statLabel}>Total Stars</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscGitCommit size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalCommits}</span>
              <span className={styles.statLabel}>Total Commits</span>
            </div>
          </div>

        </div>

        {/* Contribution Graph */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contribution Activity</h2>

          <div className={styles.calendarOuter}>
            <div className={styles.calendarInner}>
              <GitHubCalendar
                username={process.env.NEXT_PUBLIC_GITHUB_USERNAME!}
                hideColorLegend
                hideMonthLabels
                colorScheme="dark"
              />
            </div>
          </div>
        </section>

        {/* Repositories */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Repositories</h2>

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
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}