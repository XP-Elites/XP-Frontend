import { useState } from "react";
import axios from "axios";
import styles from "../UI/Upload.module.css";

function RepoUploader({ onSuccess, onError }) {
  const [link, setLink] = useState("");

  function handleRepoChange(e) {
    setLink(e.target.value);
  }

  async function handleRepoUpload() {
    if (!link) return;

    // Validate GitHub URL format
    const githubPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
    if (!githubPattern.test(link)) {
      if (onError)
        onError(
          "Invalid GitHub URL. Expected format: https://github.com/{username}/{repository}",
        );
      return;
    }

    try {
      await axios.post(
        "https://httpbin.org/post",
        { repoURL: link },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (onSuccess) onSuccess("Repository uploaded successfully!");
      setLink(""); // Clear after successful upload
    } catch (error) {
      if (onError) onError(error.message || "Repository upload failed");
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
