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

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function resolveAnalysisResponse(rawState) {
  const source = parseMaybeJson(rawState);

  if (!source) {
    return null;
  }

  if (source?.results) {
    return parseMaybeJson(source.results);
  }

  if (source?.analysisResponse?.results) {
    return parseMaybeJson(source.analysisResponse.results);
  }

  if (source?.analysisResponse) {
    return parseMaybeJson(source.analysisResponse);
  }

  if (source?.cyclomatic_complexity) {
    return source;
  }

  return null;
}

function getEntryComplexity(rawComplexity, density) {
  if (typeof rawComplexity === "number") {
    return rawComplexity;
  }

  return toNumber(
    rawComplexity?.cyclomatic_complexity ?? density?.cyclomatic_complexity,
  );
}

function buildSourcePrefix(entry, index) {
  const sourceLabel = entry?.sourceLabel?.trim();
  if (sourceLabel) {
    return sourceLabel;
  }

  const sourceType = entry?.sourceType?.trim();
  if (sourceType) {
    return sourceType;
  }

  return `Upload ${index + 1}`;
}

export function mergeUploadResponses(entries) {
  const normalizedEntries = entries.filter((entry) => entry?.response);

  if (normalizedEntries.length === 0) {
    return null;
  }

  if (normalizedEntries.length === 1) {
    return normalizedEntries[0].response;
  }

  const cyclomatic_complexity = {};
  const file_metrics = {};
  let total = 0;

  normalizedEntries.forEach((entry, index) => {
    const analysisResponse = resolveAnalysisResponse(entry.response);
    if (!analysisResponse) {
      return;
    }

    const sourceLabel = buildSourcePrefix(entry, index);
    const complexityMap = analysisResponse.cyclomatic_complexity || {};
    const metricMap =
      analysisResponse.vuln_density ||
      analysisResponse.file_metrics ||
      analysisResponse.metrics ||
      {};
    const fileNames = Array.from(
      new Set([
        ...Object.keys(complexityMap).filter((fileName) => fileName !== "total"),
        ...Object.keys(metricMap),
      ]),
    );

    if (fileNames.length === 0) {
      total += toNumber(complexityMap.total);
    }

    fileNames.forEach((fileName) => {
      const mergedFileName = `${sourceLabel} | ${fileName}`;
      const density = metricMap[fileName] || {};
      const complexity = getEntryComplexity(complexityMap[fileName], density);

      cyclomatic_complexity[mergedFileName] = complexity;
      file_metrics[mergedFileName] = {
        ...density,
        cyclomatic_complexity: complexity,
      };
      total += complexity;
    });
  });

  cyclomatic_complexity.total = total;

  return {
    results: {
      cyclomatic_complexity,
      file_metrics,
    },
  };
}
