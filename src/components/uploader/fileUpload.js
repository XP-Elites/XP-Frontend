import { useState } from "react";
import axios from "axios";
import "../UI/Upload.css";

function FileUploader({ onSuccess, onError }) {
  const [file, setFile] = useState(null);

  function handleFileChange(e) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (file.size > 5000000) {
    }

    try {
      await axios.post("https://httpbin.org/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (onSuccess) onSuccess("File uploaded successfully!");
      setFile(null); // Clear after successful upload
    } catch (error) {
      if (onError) onError(error.message || "File upload failed");
    }
  }

  return (
    <div className="repo-container">
      <input type="file" onChange={handleFileChange} />
      {file && (
        <>
          <p>Selected: {file.name}</p>
          <p>Size: {file.size}</p>
          <p>Type: {file.type}</p>
        </>
      )}
      {file && <button onClick={handleFileUpload}>Upload File</button>}
    </div>
  );
}

export default FileUploader;
