import styles from '@/styles/ContactCode.module.css';

const contactItems = [
  {
    social: 'website',
    link: 'nitinranganath.com',
    href: 'https://madhavtiwari.vercel.app',
  },
  {
    social: 'email',
    link: 'contact.madhavtiwari@gmail.com',
    href: 'mailto:nitinranganath@gmail.com',
  },
  {
    social: 'github',
    link: 'itsnitinr',
    href: 'https://github.com/ermadhav',
  },
  {
    social: 'linkedin',
    link: 'nitinranganath',
    href: 'https://www.linkedin.com/in/emadhav/',
  },
  {
    social: 'twitter',
    link: 'iamnitinr',
    href: 'https://www.twitter.com/madhavtiwari24',
  },
  // {
  //   social: 'peerlist',
  //   link: 'nitinranganath',
  //   href: 'https://peerlist.io/nitinranganath',
  // },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {contactItems.map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;{item.social}:{' '}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
          ;
        </p>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
