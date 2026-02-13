import { useState } from "react";
import axios from "axios";
import "../UI/Upload.css";

function FolderUploader({ onSuccess, onError }) {
  const [files, setFiles] = useState(null);

  function handleFolderChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  }

  async function handleFolderUpload() {
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file, file.webkitRelativePath || file.name);
    });

    try {
      await axios.post("https://httpbin.org/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (onSuccess) onSuccess("Folder uploaded successfully!");
      setFiles(null);
    } catch (error) {
      if (onError) onError(error.message || "Folder upload failed");
    }
  }

  return (
    <div className="repo-container">
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
