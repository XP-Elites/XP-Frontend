import { useState } from "react";
import styles from "./repoUpload.module.css";
import { pollAnalysisByUuid, postGitLink } from "./uploadClient";

const githubPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;

function parseUploadData(rawData) {
  if (!rawData) {
    return {};
  }

  if (typeof rawData === "string") {
    const trimmed = rawData.trim();

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return { uuid: trimmed };
      }
    }

    return { uuid: trimmed };
  }

  return rawData;
}

function extractUuid(data) {
  return (
    data?.uuid ||
    data?.UUID ||
    data?.uid ||
    data?.jobId ||
    data?.job_id ||
    data?.data?.uuid ||
    data?.result?.uuid ||
    data?.results?.uuid
  );
}

export async function uploadRepo(link, options = {}) {
  if (!githubPattern.test(link)) {
    throw new Error(
      "Invalid GitHub URL. Expected format: https://github.com/{username}/{repository}",
    );
  }

  const rawData = await postGitLink({ git_link: link });
  const data = parseUploadData(rawData);
  const uuid = extractUuid(data);

  if (!uuid) {
    console.error("Repository upload payload missing UUID:", data);
    throw new Error(
      "Repository upload succeeded but uuid is missing from response",
    );
  }

  options.onStatusChange?.({
    uuid,
    status: data?.status || "IN_QUEUE",
  });

  if (data?.results || data?.cyclomatic_complexity) {
    return {
      ...data,
      uuid,
    };
  }

  try {
    const polledResult = await pollAnalysisByUuid(uuid, {
      onStatusChange: options.onStatusChange,
    });
    const polledData = parseUploadData(polledResult);

    return {
      ...data,
      ...polledData,
      uuid,
    };
  } catch (error) {
    console.error("Failed to fetch repository result by UUID:", error.message);
    return {
      ...data,
      uuid,
      status: data?.status || "PENDING",
    };
  }
}

function RepoUploader({ onSuccess, onError }) {
  const [link, setLink] = useState("");

  function handleRepoChange(e) {
    setLink(e.target.value);
  }

  async function handleRepoUpload() {
    if (!link) return;

    try {
      const result = await uploadRepo(link);
      onSuccess?.(
        `Repository uploaded successfully. Job ID: ${result.uuid} (Status: ${result.status || "UNKNOWN"})`,
      );
      setLink(""); // Clear after successful upload
    } catch (error) {
      onError?.(
        error.code === "ECONNABORTED"
          ? "Repository upload timed out before the endpoint responded"
          : error.message === "Network Error"
            ? "Network error: request sent but no response was received"
            : error.message || "Repository upload failed",
      );
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input
        className={styles.repo}
        type="text"
        placeholder="https://github.com/{username}/{repository}"
        value={link}
        onChange={handleRepoChange}
      />
      {link && <button onClick={handleRepoUpload}>Upload Repository</button>}
    </div>
  );
}

export default RepoUploader;
