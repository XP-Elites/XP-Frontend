import { useState } from "react";
import styles from "./repoUpload.module.css";
import { postUploadJson } from "./uploadClient";

const githubPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;

export async function uploadRepo(link) {
  if (!githubPattern.test(link)) {
    throw new Error(
      "Invalid GitHub URL. Expected format: https://github.com/{username}/{repository}",
    );
  }

  await postUploadJson({ repoURL: link });
}

function RepoUploader({ onSuccess, onError }) {
  const [link, setLink] = useState("");

  function handleRepoChange(e) {
    setLink(e.target.value);
  }

  async function handleRepoUpload() {
    if (!link) return;

    try {
      await uploadRepo(link);
      if (onSuccess) onSuccess("Repository uploaded successfully!");
      setLink(""); // Clear after successful upload
    } catch (error) {
      if (onError) {
        onError(
          error.code === "ECONNABORTED"
            ? "Repository upload timed out before the endpoint responded"
            : error.message || "Repository upload failed",
        );
      }
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
