import { useState } from "react";
import styles from "./repoUpload.module.css";
import { postGitLink } from "./uploadClient";
import { resolveUploadResponse } from "./uploadAnalysis";

const githubPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;

export async function uploadRepo(link, options = {}) {
  if (!githubPattern.test(link)) {
    throw new Error(
      "Invalid GitHub URL. Expected format: https://github.com/{username}/{repository}",
    );
  }

  const rawData = await postGitLink({ git_link: link });
  return resolveUploadResponse(rawData, "Repository upload", options);
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
