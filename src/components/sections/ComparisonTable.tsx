import { getTranslations } from 'next-intl/server';
import styles from './ComparisonTable.module.css';

export default async function ComparisonTable() {
    const t = await getTranslations('comparison');
    const rows = t.raw('rows') as Array<{
        feature: string;
        app: string;
        others: string;
        instapsv: string;
        status: string[];
    }>;

    const renderStatus = (text: string, status: string) => {
        if (status === 'safe') {
            return (
                <div className={`${styles.cellContent} ${styles.safe}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{text}</span>
                </div>
            );
        }
        if (status === 'risk') {
            return (
                <div className={`${styles.cellContent} ${styles.risk}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>{text}</span>
                </div>
            );
        }
        if (text === "Full Proxy") {
            return (
                <div className={`${styles.cellContent} ${styles.safe}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>{text}</span>
                </div>
            );
        }
        return <span className={styles.neutralText}>{text}</span>;
    };

    return (
        <section className={styles.comparison} id="comparison">
            <div className={styles.container}>
                <h2 className={styles.title}>{t('title')}</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('headers.feature')}</th>
                                <th>{t('headers.app')}</th>
                                <th>{t('headers.others')}</th>
                                <th className={styles.highlightHeader}>{t('headers.instapsv')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td className={styles.featureCell}>{row.feature}</td>
                                    <td>{renderStatus(row.app, row.status[0])}</td>
                                    <td>{renderStatus(row.others, row.status[1])}</td>
                                    <td className={styles.highlightCell}>{renderStatus(row.instapsv, row.status[2])}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
