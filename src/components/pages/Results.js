import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./pageCSS/Results.module.css";
import TdiBar from "../results/scoreBar/score";
import { getLatestUploadResult } from "../uploader/uploadResultStore";

const fallbackAnalysisResponse = {};

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function parseMaybeJson(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
}

function resolveAnalysisResponse(rawState) {
  const source = parseMaybeJson(rawState || getLatestUploadResult());

  if (!source) {
    return fallbackAnalysisResponse;
  }

  if (source?.results) {
    return parseMaybeJson(source.results);
  }

  if (source?.analysisResponse?.results) {
    return source.analysisResponse.results;
  }

  if (source?.analysisResponse) {
    return source.analysisResponse;
  }

  if (source?.cyclomatic_complexity) {
    return source;
  }

  return fallbackAnalysisResponse;
}

function sortEntries(entries, sortBy) {
  const nextEntries = [...entries];

  if (sortBy === "complexity") {
    nextEntries.sort(
      (a, b) => b.complexity - a.complexity || a.name.localeCompare(b.name),
    );
    return nextEntries;
  }

  if (sortBy === "lines") {
    nextEntries.sort(
      (a, b) => b.linesOfCode - a.linesOfCode || a.name.localeCompare(b.name),
    );
    return nextEntries;
  }

  nextEntries.sort((a, b) => a.name.localeCompare(b.name));
  return nextEntries;
}

function Results() {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("total");
  const [sortBy, setSortBy] = useState("complexity");

  const analysisResponse = useMemo(
    () => resolveAnalysisResponse(location.state),
    [location.state],
  );

  const complexityMap = analysisResponse.cyclomatic_complexity || {};
  const densityMap =
    analysisResponse.vuln_density ||
    analysisResponse.file_metrics ||
    analysisResponse.metrics ||
    {};

  const inlineMetricMap = Object.fromEntries(
    Object.entries(complexityMap).filter(
      ([fileName, value]) =>
        fileName !== "total" && value && typeof value === "object",
    ),
  );

  const resolvedDensityMap =
    Object.keys(densityMap).length > 0 ? densityMap : inlineMetricMap;

  const fileNames = Array.from(
    new Set([
      ...Object.keys(complexityMap).filter((fileName) => fileName !== "total"),
      ...Object.keys(resolvedDensityMap),
    ]),
  );

  const fileEntries = fileNames.map((fileName) => {
    const rawComplexity = complexityMap[fileName];
    const density = resolvedDensityMap[fileName] || {};
    const complexity =
      typeof rawComplexity === "number"
        ? rawComplexity
        : toNumber(
            rawComplexity?.cyclomatic_complexity ??
              density.cyclomatic_complexity,
          );

    return {
      key: fileName,
      name: fileName,
      complexity,
      linesOfCode: toNumber(density.lines_of_code),
      importStatements: toNumber(density.import_statements),
      functionParameters: toNumber(density.function_parameters),
      functionLines: toNumber(density.function_lines),
    };
  });

  const sortedEntries = sortEntries(fileEntries, sortBy);
  const totalEntry = {
    key: "total",
    name: "Total",
    complexity:
      toNumber(complexityMap.total) ||
      fileEntries.reduce((sum, entry) => sum + entry.complexity, 0),
    linesOfCode: fileEntries.reduce((sum, entry) => sum + entry.linesOfCode, 0),
    importStatements: fileEntries.reduce(
      (sum, entry) => sum + entry.importStatements,
      0,
    ),
    functionParameters: fileEntries.reduce(
      (sum, entry) => sum + entry.functionParameters,
      0,
    ),
    functionLines: fileEntries.reduce(
      (sum, entry) => sum + entry.functionLines,
      0,
    ),
    fileCount: fileEntries.length,
  };

  const selectedEntry =
    selectedKey === "total"
      ? totalEntry
      : fileEntries.find((entry) => entry.key === selectedKey) || totalEntry;

  const rawResultPayload = useMemo(
    () => location.state || getLatestUploadResult(),
    [location.state],
  );

  const hasMetrics =
    fileEntries.length > 0 ||
    totalEntry.complexity > 0 ||
    totalEntry.linesOfCode > 0 ||
    totalEntry.importStatements > 0 ||
    totalEntry.functionParameters > 0 ||
    totalEntry.functionLines > 0;

  return (
    <div className={styles.container}>
      <div className={styles.layoutRow}>
        <div className={styles.box}>
          <div className={styles.panelHeader}>
            <h1>Files</h1>
            <div className={styles.sortRow}>
              <label className={styles.sortLabel} htmlFor="results-sort">
                Sort by
              </label>
              <select
                id="results-sort"
                className={styles.sortSelect}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="complexity">Complexity</option>
                <option value="lines">Lines of code</option>
                <option value="name">File name</option>
              </select>
            </div>
          </div>

          <div className={styles.fileListPanel}>
            <button
              type="button"
              className={`${styles.fileRow} ${selectedKey === "total" ? styles.fileRowActive : ""}`}
              onClick={() => setSelectedKey("total")}
            >
              <span className={styles.fileRowName}>Total</span>
              <span className={styles.fileRowMetric}>
                {totalEntry.complexity}
              </span>
            </button>

            {sortedEntries.map((entry) => (
              <button
                key={entry.key}
                type="button"
                className={`${styles.fileRow} ${selectedKey === entry.key ? styles.fileRowActive : ""}`}
                onClick={() => setSelectedKey(entry.key)}
              >
                <span className={styles.fileRowName}>{entry.name}</span>
                <span className={styles.fileRowMetric}>{entry.complexity}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`${styles.box} ${styles.scoreBox}`}>
          <h1>Score</h1>
          <TdiBar tdi={selectedEntry.complexity} />
          {!hasMetrics && rawResultPayload && (
            <p className={styles.resultHint}>
              Upload payload exists, but no metric fields were found in it.
            </p>
          )}
          <div className={styles.resultFields}>
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>
                {selectedKey === "total" ? "Selection" : "File"}
              </p>
              <div className={styles.resultValue}>{selectedEntry.name}</div>
            </div>
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>Cyclomatic complexity</p>
              <div className={styles.resultValue}>
                {selectedEntry.complexity}
              </div>
            </div>
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>Lines of code</p>
              <div className={styles.resultValue}>
                {selectedEntry.linesOfCode}
              </div>
            </div>
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>Import statements</p>
              <div className={styles.resultValue}>
                {selectedEntry.importStatements}
              </div>
            </div>
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>Function parameters</p>
              <div className={styles.resultValue}>
                {selectedEntry.functionParameters}
              </div>
            </div>
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>Function lines</p>
              <div className={styles.resultValue}>
                {selectedEntry.functionLines}
              </div>
            </div>
            {selectedKey === "total" && (
              <div className={styles.resultField}>
                <p className={styles.resultLabel}>Files analyzed</p>
                <div className={styles.resultValue}>{totalEntry.fileCount}</div>
              </div>
            )}
            <div className={styles.resultField}>
              <p className={styles.resultLabel}>Raw API response</p>
              <pre className={styles.resultJson}>
                {rawResultPayload
                  ? JSON.stringify(rawResultPayload, null, 2)
                  : "No uploaded result found yet."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
