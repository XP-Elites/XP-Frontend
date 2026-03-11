import styles from "./pageCSS/Results.module.css";
import TdiBar from "../results/scoreBar/score";
import CodeViewer from "../results/syntaxHighlighter/syntax";

function Results() {
  const resultSummary = {
    language: "Java",
    complexityAnalysis: "1 - easy to test",
    tdiScore: 30,
  };

  return (
    <div className={styles.container}>
      <div className={styles.layoutRow}>
        <div className={styles.box}>
          <h1>File</h1>
          <CodeViewer className={styles.codeViewer} />
        </div>
        <div className={styles.box}>
          <h1>Score</h1>
          <TdiBar tdi={resultSummary.tdiScore} />
          <div className={styles.resultFields}>
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>Language</p>
              <div className={styles.resultValue}>{resultSummary.language}</div>
            </div>
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>Complexity analysis</p>
              <div className={styles.resultValue}>
                {resultSummary.complexityAnalysis}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
