'use client';

import { VscGithub, VscMail, VscLinkExternal } from 'react-icons/vsc';
import Link from 'next/link';

import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.name}>Madhav Tiwari</h1>
              <div className={styles.location}>
                <span className={styles.dot} />
                Jaipur/Indore, India
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <a
              href="https://github.com/itsnitinr"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconButton}
            >
              <VscGithub size={20} />
            </a>
            <Link href="/contact" className={styles.iconButton}>
              <VscMail size={20} />
            </Link>
          </div>
        </header>

        <div className={styles.content}>
          {/* Bio Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>01</span>
              <h2 className={styles.sectionTitle}>About</h2>
            </div>

            <div className={styles.sectionBody}>
              <p className={styles.paragraph}>
                I&apos;m a software engineer passionate about crafting beautiful, performant
                web experiences. I primarily work with the JavaScript/TypeScript ecosystem
                and React, building products that people love to use.
              </p>

              <p className={styles.paragraph}>
                While I specialize in frontend development, I enjoy working across the
                stack with Node.js, MongoDB, and Express to bring full-stack applications
                to life.
              </p>
            </div>
          </section>

          {/* Skills Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>02</span>
              <h2 className={styles.sectionTitle}>Skills</h2>
            </div>

            <div className={styles.sectionBody}>
              <div className={styles.skillsGrid}>

                {/* Languages */}
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Languages</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>JavaScript</span>
                    <span className={styles.skillTag}>TypeScript</span>
                    <span className={styles.skillTag}>HTML</span>
                    <span className={styles.skillTag}>CSS</span>
                    <span className={styles.skillTag}>C++</span>
                    <span className={styles.skillTag}>Python</span>
                  </div>
                </div>

                {/* Frontend */}
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Frontend</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>React</span>
                    <span className={styles.skillTag}>Next.js</span>
                    <span className={styles.skillTag}>Redux</span>
                    <span className={styles.skillTag}>Tailwind CSS</span>
                    <span className={styles.skillTag}>Bootstrap</span>
                    <span className={styles.skillTag}>Framer Motion</span>
                  </div>
                </div>

                {/* Backend */}
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Backend</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>Node.js</span>
                    <span className={styles.skillTag}>Express.js</span>
                    <span className={styles.skillTag}>REST APIs</span>
                    <span className={styles.skillTag}>JWT Auth</span>
                    <span className={styles.skillTag}>Firebase</span>
                  </div>
                </div>

                {/* Database */}
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Database</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>MongoDB</span>
                    <span className={styles.skillTag}>MySQL</span>
                    <span className={styles.skillTag}>PostgreSQL</span>
                  </div>
                </div>

                {/* Tools */}
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Tools</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>Git</span>
                    <span className={styles.skillTag}>GitHub</span>
                    <span className={styles.skillTag}>VS Code</span>
                    <span className={styles.skillTag}>Postman</span>
                  </div>
                </div>

                {/* Others */}
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Others</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>Data Structures</span>
                    <span className={styles.skillTag}>Algorithms</span>
                    <span className={styles.skillTag}>OOP</span>
                    <span className={styles.skillTag}>Problem Solving</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Beyond Code Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>05</span>
              <h2 className={styles.sectionTitle}>Beyond Code</h2>
            </div>

            <div className={styles.sectionBody}>
              <p className={styles.paragraph}>
                When I'm not immersed in lines of code or exploring the endless cosmos of technology,
                you'll find me diving into dystopian worlds through novels, unwinding with calm
                piano melodies, or simply recharging for the next coding adventure.
              </p>
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <Link href="/projects" className={styles.footerLink}>
            View my projects →
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
