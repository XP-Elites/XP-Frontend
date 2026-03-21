import { useState } from "react";
import styles from "../pages/pageCSS/Upload.module.css";
import { uploadFilesForAnalysis } from "./uploadAnalysis";
import { validateUploadSize } from "./uploadValidation";

export async function uploadFile(input, options) {
  return uploadFilesForAnalysis(input, "Upload", options);
}

function FileUploader({ onSuccess, onError }) {
  const [file, setFile] = useState(null);

  function handleFileChange(e) {
    if (e.target.files) {
      const nextFile = e.target.files[0];
      if (!nextFile) return;

      try {
        validateUploadSize([nextFile]);
      } catch (error) {
        onError?.(error.message || "File upload failed");
        return;
      }

      setFile(nextFile);
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    try {
      const result = await uploadFile(file);
      onSuccess?.(
        `File uploaded successfully. Job ID: ${result.uuid} (Status: ${result.status || "UNKNOWN"})`,
      );
      setFile(null);
    } catch (error) {
      onError?.(
        error.code === "ECONNABORTED"
          ? "File upload timed out before the endpoint responded"
          : error.message === "Network Error"
            ? "Network error: request sent but no response was received"
            : error.message || "File upload failed",
      );
    }
  }

  function handleFileClear() {
    setFile(null);
  }

  function onInputChange(e) {
    handleFileChange(e);
    if (e.target) {
      e.target.value = "";
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input type="file" onChange={onInputChange} />
      {file && (
        <>
          <p>Selected: {file.name}</p>
          <p>Size: {file.size}</p>
          <p>Type: {file.type}</p>
        </>
      )}
      {file && <button onClick={handleFileUpload}>Upload File</button>}
      {file && <button onClick={handleFileClear}>Clear</button>}
    </div>
  );
}

export default FileUploader;
