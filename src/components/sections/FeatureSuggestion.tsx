import styles from './FeatureSuggestion.module.css';
import FeatureSuggestionForm from './FeatureSuggestionForm';

export default function FeatureSuggestion() {
    return (
        <section className={styles.featureSuggestion}>
            <div className={styles.container}>
                {/* Background Elements */}
                <div className={styles.bgElements}>
                    <div className={styles.orb1} />
                    <div className={styles.orb2} />
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.icon}>💡</div>
                    <h2 className={styles.title}>
                        Help us build the best{' '}
                        <span className={styles.highlight}>Instagram tool</span>
                        <br />
                        by suggesting features
                    </h2>
                    <p className={styles.description}>
                        We&apos;re constantly improving InstaPSV. Share your ideas and help us create
                        the features you need most.
                    </p>

                    {/* Form */}
                    <FeatureSuggestionForm />

                    {/* Popular Tags */}
                    <div className={styles.tags}>
                        <span className={styles.tagsLabel}>Popular requests:</span>
                        <div className={styles.tagList}>
                            <span className={styles.tag}>Dark Mode</span>
                            <span className={styles.tag}>Batch Download</span>
                            <span className={styles.tag}>Highlights Viewer</span>
                            <span className={styles.tag}>Browser Extension</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
