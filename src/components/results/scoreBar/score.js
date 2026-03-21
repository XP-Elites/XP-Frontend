import styles from "./score.module.css";

function clampScore(score) {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(score, 100));
}

export default function TdiBar({ tdi = 0 }) {
  const safeTdi = clampScore(tdi);

  return (
    <div className={styles.tdiWrapper}>
      <div className={styles.tdiBar}>
        <div className={`${styles.segment} ${styles.segmentLow}`}>Good</div>
        <div className={`${styles.segment} ${styles.segmentMedium}`}>
          Average
        </div>
        <div className={`${styles.segment} ${styles.segmentHigh}`}>Poor</div>

        <div
          className={styles.tdiArrow}
          style={{ left: `${safeTdi}%` }}
          aria-label={`TDI score ${safeTdi}`}
        />
      </div>

      <p className={styles.tdiLabel}>TDI: {safeTdi}</p>
    </div>
  );
}
