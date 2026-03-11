import { useState } from "react";
import styles from "../pages/pageCSS/Upload.module.css";
import { postUploadFormData } from "./uploadClient";
import { validateUploadSize } from "./uploadValidation";

export async function uploadFolder(input) {
  const files = validateUploadSize(input);

  if (files.length === 0) {
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("folderFiles", file, file.webkitRelativePath || file.name);
  });

  await postUploadFormData(formData);
}

function FolderUploader({ onSuccess, onError }) {
  const [files, setFiles] = useState(null);

  function handleFolderChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      try {
        validateUploadSize(e.target.files);
        setFiles(e.target.files);
      } catch (error) {
        if (onError) {
          onError(error.message || "Folder upload failed");
        }
      }
    }
  }

  async function handleFolderUpload() {
    if (!files) return;

    try {
      await uploadFolder(files);
      if (onSuccess) onSuccess("Folder uploaded successfully!");
      setFiles(null);
    } catch (error) {
      if (onError) {
        onError(
          error.code === "ECONNABORTED"
            ? "Folder upload timed out before the endpoint responded"
            : error.message || "Folder upload failed",
        );
      }
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        onChange={handleFolderChange}
        webkitdirectory=""
        directory=""
      />
      {files && (
        <>
          <p>Selected folder with {files.length} files</p>
        </>
      )}
      {files && <button onClick={handleFolderUpload}>Upload Folder</button>}
    </div>
  );
}

export default FolderUploader;
