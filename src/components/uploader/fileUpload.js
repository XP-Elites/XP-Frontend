import { useState } from "react";
import styles from "../pages/pageCSS/Upload.module.css";
import { postUploadFormData } from "./uploadClient";
import { validateUploadSize } from "./uploadValidation";

export async function uploadFile(input) {
  const files = validateUploadSize(input);

  if (files.length === 0) {
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file, file.webkitRelativePath || file.name);
  });

  await postUploadFormData(formData);
}

function FileUploader({ onSuccess, onError }) {
  const [file, setFile] = useState(null);

  function handleFileChange(e) {
    if (e.target.files) {
      const nextFile = e.target.files[0];
      if (!nextFile) {
        return;
      }

      try {
        validateUploadSize(nextFile);
      } catch (error) {
        if (onError) {
          onError(error.message || "File upload failed");
        }
        return;
      }

      setFile(nextFile);
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    try {
      await uploadFile(file);
      if (onSuccess) onSuccess("File uploaded successfully!");
      setFile(null); // Clear after successful upload
    } catch (error) {
      if (onError) {
        onError(
          error.code === "ECONNABORTED"
            ? "File upload timed out before the endpoint responded"
            : error.message || "File upload failed",
        );
      }
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
