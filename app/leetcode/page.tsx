import { Metadata } from 'next';
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
              userAvatar
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

  if (!res.ok) {
    throw new Error('Failed to fetch LeetCode data');
  }

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

export default async function LeetCodePage() {
  const stats = await getLeetCodeData();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.profile}>
            <h1 className={styles.name}>{stats.username}</h1>
            <span className={styles.handle}>LeetCode Profile</span>
          </div>

          <a
            href={`https://leetcode.com/${stats.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            View Profile ↗
          </a>
        </header>

        {/* Stats */}
        <div className={styles.statsGrid}>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.totalSolved}</span>
            <span className={styles.statLabel}>Total Solved</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.easySolved}</span>
            <span className={styles.statLabel}>Easy</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.mediumSolved}</span>
            <span className={styles.statLabel}>Medium</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.hardSolved}</span>
            <span className={styles.statLabel}>Hard</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.ranking}</span>
            <span className={styles.statLabel}>Global Ranking</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.contributionPoints}</span>
            <span className={styles.statLabel}>Contribution Points</span>
          </div>

        </div>

        {/* Optional Heatmap */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Activity</h2>

          <img
            src={`https://leetcard.jacoblin.cool/${stats.username}?theme=dark&font=baloo&ext=heatmap`}
            alt="LeetCode Stats"
            className={styles.leetcodeCard}
          />
        </section>

      </div>
    </div>
  );
}