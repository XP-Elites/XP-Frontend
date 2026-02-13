import { useState } from "react";
import "../UI/Home.css";
import FileUploader from "../uploader/fileUpload";
import FolderUploader from "../uploader/folderUpload";
import RepoUploader from "../uploader/repoUpload";

function Home() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [uploadType, setUploadType] = useState("file"); // "file", "folder", or "repo"

  function handleSuccess(msg) {
    setStatus("success");
    setMessage(msg);
  }

  function handleError(msg) {
    setStatus("error");
    setMessage(msg);
  }

  return (
    <div className="wrapper">
      <div className="container">
        <p className="header-wrapper">Upload a file, folder, or repository</p>

        <div>
          <button onClick={() => setUploadType("file")}>File Upload</button>
          <button onClick={() => setUploadType("folder")}>Folder Upload</button>
          <button onClick={() => setUploadType("repo")}>
            Repository Upload
          </button>
        </div>

        {uploadType === "file" && (
          <FileUploader onSuccess={handleSuccess} onError={handleError} />
        )}

        {uploadType === "folder" && (
          <FolderUploader onSuccess={handleSuccess} onError={handleError} />
        )}

        {uploadType === "repo" && (
          <RepoUploader onSuccess={handleSuccess} onError={handleError} />
        )}

        {status === "success" && <p className="success">{message}</p>}

        {status === "error" && <p className="error">{message}</p>}
      </div>
    </div>
  );
}

export default Home;
