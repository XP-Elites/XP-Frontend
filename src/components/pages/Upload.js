import { useState } from "react";
import styles from "../UI/Upload.module.css";
import DropFileInput from "../uploader/dragAndDropUploader.js";
import CopyPaste, { uploadCopyPaste } from "../uploader/copyPaste.js";
import { uploadFile } from "../uploader/fileUpload.js";
import { uploadFolder } from "../uploader/folderUpload.js";
import { uploadRepo } from "../uploader/repoUpload.js";
import { validateUploadSize } from "../uploader/uploadValidation.js";

function Upload() {
  const [files, setFiles] = useState([]);
  const [code, setCode] = useState("");
  const [folderFiles, setFolderFiles] = useState([]);
  const [uploadMode, setUploadMode] = useState("files");
  const [repoLink, setRepoLink] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (files) => {
    try {
      validateUploadSize([...files, ...folderFiles]);
    } catch (error) {
      handleError(error.message || "Upload failed");
      setFiles([]);
      return;
    }

    setStatus("idle");
    setMessage("");
    setFiles(files);
  };

  const onCodeChange = (code) => {
    setCode(code);
  };

  const onRepoChange = (event) => {
    setRepoLink(event.target.value);
  };

  const updateFolderFiles = (nextFolderFiles) => {
    try {
      validateUploadSize([...files, ...nextFolderFiles]);
    } catch (error) {
      handleError(error.message || "Upload failed");
      return;
    }

    setStatus("idle");
    setMessage("");
    setFolderFiles(nextFolderFiles);
  };

  const removeFile = (indexToRemove) => {
    setFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const removeFolderFile = (indexToRemove) => {
    setFolderFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const clearCode = () => {
    setCode("");
  };

  const clearRepoLink = () => {
    setRepoLink("");
  };

  const handleUploadModeChange = (nextMode) => {
    if (nextMode === uploadMode) {
      return;
    }

    setStatus("idle");
    setMessage("");
    setUploadMode(nextMode);
  };

  const handleSuccess = (nextMessage) => {
    setStatus("success");
    setMessage(nextMessage);
  };

  const handleError = (nextMessage) => {
    setStatus("error");
    setMessage(nextMessage);
  };

  const handleUpload = async () => {
    if (isUploading) return;

    setStatus("idle");
    setMessage("");
    setIsUploading(true);

    try {
      if (code.trim()) {
        await uploadCopyPaste(code);
      }

      if (repoLink.trim()) {
        await uploadRepo(repoLink.trim());
      }

      if (files.length > 0) {
        await uploadFile(files);
      }

      if (folderFiles.length > 0) {
        await uploadFolder(folderFiles);
      }

      handleSuccess("Upload completed successfully!");
    } catch (error) {
      handleError(
        error.code === "ECONNABORTED"
          ? "Upload timed out before the endpoint responded"
          : error.message || "Upload failed",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalFolderSize = folderFiles.reduce((sum, file) => sum + file.size, 0);
  const codeLines = code ? code.split(/\r?\n/).length : 0;
  const codePreview = code.length > 500 ? `${code.slice(0, 500)}...` : code;
  const hasUploadContent = Boolean(
    code || repoLink || files.length > 0 || folderFiles.length > 0,
  );

  return (
    <div className={styles.container}>
      <div className={styles.layoutRow}>
        <div className={styles.box}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Upload source code</h2>
          </div>

          <div className={styles.repoSection}>
            <p className={styles.repoHeader}>GitHub repository</p>
            <div className={styles.repoSectionBody}>
              <input
                type="url"
                className={styles.repoInput}
                placeholder="https://github.com/username/repository"
                value={repoLink}
                onChange={onRepoChange}
              />
            </div>
          </div>

          <div className={styles.options}>
            <div className={styles.optionCard}>
              <div className={styles.optionBody}>
                <CopyPaste
                  onCodeChange={(nextCode) => onCodeChange(nextCode)}
                  showPreview={false}
                />
              </div>
            </div>
            <div className={styles.optionCard}>
              <div className={styles.optionBody}>
                <div className={styles.uploadSwitchRow}>
                  <span className={styles.uploadModeLabel}></span>
                  <div
                    className={styles.uploadSwitch}
                    role="radiogroup"
                    aria-label="Choose upload type"
                  >
                    <button
                      type="button"
                      className={`${styles.switchOption} ${uploadMode === "files" ? styles.switchOptionActive : ""}`}
                      onClick={() => handleUploadModeChange("files")}
                      aria-pressed={uploadMode === "files"}
                    >
                      File
                    </button>
                    <button
                      type="button"
                      className={`${styles.switchOption} ${uploadMode === "folder" ? styles.switchOptionActive : ""}`}
                      onClick={() => handleUploadModeChange("folder")}
                      aria-pressed={uploadMode === "folder"}
                    >
                      Folder
                    </button>
                  </div>
                </div>
                {uploadMode === "files" ? (
                  <DropFileInput
                    onFileChange={(nextFiles) => onFileChange(nextFiles)}
                    selectedFiles={files}
                    selectionMode="file"
                    showPreview={false}
                  />
                ) : (
                  <DropFileInput
                    onFileChange={(nextFiles) => updateFolderFiles(nextFiles)}
                    selectedFiles={folderFiles}
                    selectionMode="folder"
                    showPreview={false}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles.uploadButtonRow}>
            <button
              type="button"
              className={styles.uploadButton}
              onClick={handleUpload}
              disabled={!hasUploadContent || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload selected content"}
            </button>

            {status === "success" && (
              <p className={styles.success}>{message}</p>
            )}
            {status === "error" && <p className={styles.error}>{message}</p>}
          </div>
        </div>

        <div className={styles.summaryBox}>
          <div className={styles.summary}>
            <div className={styles.summaryHeader}>
              <h3 className={styles.sectionLabel}>Ready to upload</h3>
              <p className={styles.summaryMeta}>
                {files.length} file{files.length === 1 ? "" : "s"} selected
                {code ? (
                  <>
                    {" | "}
                    <span className={styles.defaultFont}>{codeLines}</span>
                    {" lines of pasted code"}
                  </>
                ) : (
                  ""
                )}
                {repoLink ? " | 1 GitHub repository link" : ""}
                {files.length > 0 ? ` | ${totalSize}B total` : ""}
                {folderFiles.length > 0
                  ? ` | ${folderFiles.length} folder file${folderFiles.length === 1 ? "" : "s"}`
                  : ""}
                {folderFiles.length > 0
                  ? ` | ${totalFolderSize}B folder total`
                  : ""}
              </p>
            </div>

            <div className={styles.summaryBody}>
              {code ? (
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardHeader}>
                    <div>
                      <p className={styles.summaryCardTitle}>Pasted code</p>
                      <p className={styles.summaryCardMeta}>
                        <span className={styles.defaultFont}>{codeLines}</span>
                        {" lines | "}
                        <span className={styles.defaultFont}>
                          {code.length}
                        </span>
                        {" characters"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={clearCode}
                      aria-label="Remove pasted code"
                    >
                      X
                    </button>
                  </div>
                  <pre className={styles.codePreview}>{codePreview}</pre>
                </div>
              ) : null}

              {repoLink ? (
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardHeader}>
                    <div>
                      <p className={styles.summaryCardTitle}>
                        GitHub repository
                      </p>
                      <p className={styles.summaryCardMeta}>Repository link</p>
                    </div>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={clearRepoLink}
                      aria-label="Remove repository link"
                    >
                      X
                    </button>
                  </div>
                  <p className={styles.repoPreview}>{repoLink}</p>
                </div>
              ) : null}

              {folderFiles.length > 0 ? (
                <div className={styles.summaryCard}>
                  <div className={styles.summaryCardHeader}>
                    <div>
                      <p className={styles.summaryCardTitle}>Selected folder</p>
                      <p className={styles.summaryCardMeta}>
                        {folderFiles.length} file
                        {folderFiles.length === 1 ? "" : "s"} |{" "}
                        {totalFolderSize}B
                      </p>
                    </div>
                  </div>
                  <div className={styles.fileList}>
                    {folderFiles.map((file, index) => (
                      <div
                        key={`${file.webkitRelativePath || file.name}-${index}`}
                        className={styles.fileItem}
                      >
                        <div className={styles.fileDetails}>
                          <p
                            className={styles.fileName}
                            title={file.webkitRelativePath || file.name}
                          >
                            {file.webkitRelativePath || file.name}
                          </p>
                          <p className={styles.fileMeta}>{file.size}B</p>
                        </div>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeFolderFile(index)}
                          aria-label={`Remove ${file.webkitRelativePath || file.name}`}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {files.length > 0 ? (
                <div className={styles.fileList}>
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className={styles.fileItem}
                    >
                      <div className={styles.fileDetails}>
                        <p className={styles.fileName} title={file.name}>
                          {file.name}
                        </p>
                        <p className={styles.fileMeta}>{file.size}B</p>
                      </div>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeFile(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {!code &&
              !repoLink &&
              files.length === 0 &&
              folderFiles.length === 0 ? (
                <p className={styles.emptyState}>
                  Add pasted code, files, folders, or a GitHub repository above
                  to build the upload.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
