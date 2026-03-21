import axios from "axios";

const API_BASE = "https://api.xp.cattoindustries.com";
const UPLOAD_TIMEOUT_MS = 30000;
const STATUS_TIMEOUT_MS = 8000;
const POLL_INTERVAL_MS = 1500;

export async function postUploadFormData(formData) {
  try {
    const response = await axios.post(`${API_BASE}/upload/files`, formData, {
      timeout: UPLOAD_TIMEOUT_MS,
    });

    return response.data;
  } catch (error) {
    console.error("Upload error message:", error.message);
    console.error("Upload has response:", !!error.response);
    console.error("Upload has request:", !!error.request);
    throw error;
  }
}

export async function postUploadJson(payload) {
  try {
    const response = await axios.post(`${API_BASE}/upload/files`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: UPLOAD_TIMEOUT_MS,
    });

    return response.data;
  } catch (error) {
    console.error("Upload JSON error message:", error.message);
    console.error("Upload JSON has response:", !!error.response);
    console.error("Upload JSON has request:", !!error.request);
    throw error;
  }
}

export async function postGitLink(payload) {
  try {
    const response = await axios.post(
      `${API_BASE}/upload/file_link/git`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: UPLOAD_TIMEOUT_MS,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Git link upload error message:", error.message);
    console.error("Git link upload has response:", !!error.response);
    console.error("Git link upload has request:", !!error.request);
    throw error;
  }
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

export function getJobStatusMessage(statusPayload) {
  const jobStatus = (statusPayload?.status || "").toString().toUpperCase();
  const uuidSuffix = statusPayload?.uuid ? ` (${statusPayload.uuid})` : "";

  if (jobStatus === "COMPLETE") {
    return `Analysis complete. Finalizing results...`;
  }

  if (jobStatus === "PROCESSING") {
    return `Analysis in progress...`;
  }

  if (jobStatus === "IN_QUEUE") {
    return `Upload accepted, processing...`;
  }

  if (jobStatus === "ERROR" || jobStatus === "FAILED") {
    return `Analysis failed${uuidSuffix}.`;
  }

  if (jobStatus) {
    return `Job status: ${jobStatus}${uuidSuffix}`;
  }

  return "";
}

export function getUploadErrorMessage(
  error,
  fallbackMessage = "Upload failed",
) {
  if (error?.code === "ECONNABORTED") {
    return "Upload timed out before the endpoint responded";
  }

  if (error?.message === "Network Error") {
    return "Network error: request sent but no response was received";
  }

  return error?.message || fallbackMessage;
}

function hasAnalysisData(payload) {
  const parsed = parseMaybeJson(payload);
  if (!parsed || typeof parsed !== "object") {
    return false;
  }

  if (parsed.results && typeof parsed.results === "object") {
    return true;
  }

  return !!parsed.cyclomatic_complexity;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getJobStatus(uuid) {
  const response = await axios.get(
    `${API_BASE}/status/${encodeURIComponent(uuid)}`,
    {
      timeout: STATUS_TIMEOUT_MS,
    },
  );

  return parseMaybeJson(response.data);
}

export async function waitForJobResult(
  uuid,
  { pollMs = POLL_INTERVAL_MS, timeoutMs, onStatusChange } = {},
) {
  const hasTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0;
  const started = Date.now();

  while (!hasTimeout || Date.now() - started < timeoutMs) {
    const statusPayload = await getJobStatus(uuid);
    const status = (statusPayload?.status || "").toString().toUpperCase();
    onStatusChange?.(statusPayload);

    if (status === "COMPLETE") {
      return statusPayload.results;
    }

    if (status === "ERROR" || status === "FAILED") {
      throw new Error("Worker processing failed");
    }

    if (hasAnalysisData(statusPayload)) {
      return statusPayload.results || statusPayload;
    }

    await delay(pollMs);
  }

  throw new Error("Timed out waiting for processing result");
}

export async function pollAnalysisByUuid(uuid, options) {
  try {
    const results = await waitForJobResult(uuid, options);
    return {
      uuid,
      status: "COMPLETE",
      results,
    };
  } catch (error) {
    if (error.message === "Timed out waiting for processing result") {
      return {
        uuid,
        status: "PENDING",
      };
    }

    throw error;
  }
}
