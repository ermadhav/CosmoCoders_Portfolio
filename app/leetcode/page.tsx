import { Metadata } from 'next';
// import { VscLinkExternal, VscGraph, VscSymbolNumber } from 'react-icons/vsc';

import styles from '@/styles/LeetcodePage.module.css';

export const metadata: Metadata = {
  title: 'LeetCode',
};

export const revalidate = 600;

type LeetCodeStats = {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  contributionPoints: number;
};

async function getLeetCodeData(): Promise<LeetCodeStats> {
  const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME;

  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
    },
    body: JSON.stringify({
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
            }
            contributions {
              points
            }
          }
        }
      `,
      variables: { username },
    }),
  });

  const json = await res.json();
  const data = json.data.matchedUser;

  const stats = data.submitStats.acSubmissionNum;

  return {
    username: data.username,
    totalSolved: stats.find((s: any) => s.difficulty === 'All').count,
    easySolved: stats.find((s: any) => s.difficulty === 'Easy').count,
    mediumSolved: stats.find((s: any) => s.difficulty === 'Medium').count,
    hardSolved: stats.find((s: any) => s.difficulty === 'Hard').count,
    ranking: data.profile.ranking,
    contributionPoints: data.contributions.points,
  };
}

export default async function LeetcodePage() {
  const stats = await getLeetCodeData();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.profile}>
            <div className={styles.profileInfo}>
              <h1 className={styles.name}>{stats.username}</h1>
              <span className={styles.handle}>LeetCode Profile</span>
            </div>
          </div>

          <a
            href={`https://leetcode.com/${stats.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <span>View Profile</span>
            <VscLinkExternal size={14} />
          </a>
        </header>

        {/* Stats */}
        <div className={styles.statsGrid}>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><VscSymbolNumber size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.totalSolved}</span>
              <span className={styles.statLabel}>Solved</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><VscGraph size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.easySolved}</span>
              <span className={styles.statLabel}>Easy</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><VscGraph size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.mediumSolved}</span>
              <span className={styles.statLabel}>Medium</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><VscGraph size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.hardSolved}</span>
              <span className={styles.statLabel}>Hard</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><VscSymbolNumber size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.ranking}</span>
              <span className={styles.statLabel}>Ranking</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}><VscSymbolNumber size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.contributionPoints}</span>
              <span className={styles.statLabel}>Points</span>
            </div>
          </div>

        </div>

        {/* Activity */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Activity</h2>

          <div className={styles.contributions}>
            <img
              src={`https://leetcard.jacoblin.cool/${stats.username}?theme=dark&ext=heatmap`}
              alt="LeetCode Heatmap"
              style={{ width: '100%' }}
            />
          </div>
        </section>

      </div>
    </div>
  );
}