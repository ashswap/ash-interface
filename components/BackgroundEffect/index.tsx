import styles from "./BackgroundEffect.module.css";

const BackgroundEffect = () => {
    return (
        <>
            <div className="relative min-h-screen w-full overflow-hidden">
                <div className={styles.container} />
                <div className={styles.dot1} />
                <div className={styles.dot2} />
                <div className={styles.dot3} />
                <div className={styles.dot4} />
                <div className={styles.dot5} />
                <div className={styles.dot6} />
            </div>
        </>
    );
};

export default BackgroundEffect;
