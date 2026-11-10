import Link from 'next/link';
import styles from '../app/blog/page.module.css';

export default function NewsletterForm() {
    return <Link href="/contact" className={styles.newsletterBtn}>Contact the team</Link>;
}
