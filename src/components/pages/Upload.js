import { useState } from "react";
import styles from "../UI/Upload.module.css";
import DropFileInput from "../uploader/dragAndDropUploader.js";
import CopyPaste from "../uploader/copyPaste.js";

function Upload() {
  const [files, setFiles] = useState([]);
  const [code, setCode] = useState("");
  const [repoLink, setRepoLink] = useState("");

  const onFileChange = (files) => {
    setFiles(files);
  };

  const onCodeChange = (code) => {
    setCode(code);
  };

  const onRepoChange = (event) => {
    setRepoLink(event.target.value);
  };

  const handleUpload = () => {
    console.log({ code, files, repoLink });
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const codeLines = code ? code.split(/\r?\n/).length : 0;
  const codePreview = code.length > 500 ? `${code.slice(0, 500)}...` : code;
  const hasUploadContent = Boolean(code || repoLink || files.length > 0);

  return (
    <div className={styles.container}>
      <div className={styles.layoutRow}>
        <div className={styles.box}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>Upload source code</h2>
          </div>

          <div className={styles.repoSection}>
            <p className={styles.sectionLabel}>Share your GitHub link here</p>
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
                <DropFileInput
                  onFileChange={(nextFiles) => onFileChange(nextFiles)}
                  showPreview={false}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.uploadButton}
            onClick={handleUpload}
            disabled={!hasUploadContent}
          >
            Upload selected content
          </button>
        </div>

        <div className={styles.summaryBox}>
          <div className={styles.summary}>
            <div className={styles.summaryHeader}>
              <h3 className={styles.sectionLabel}>Ready to upload</h3>
              <p className={styles.summaryMeta}>
                {files.length} file{files.length === 1 ? "" : "s"} selected
                {code ? ` | ${codeLines} lines of pasted code` : ""}
                {repoLink ? " | 1 GitHub repository link" : ""}
                {files.length > 0 ? ` | ${totalSize}B total` : ""}
              </p>
            </div>

            <div className={styles.summaryBody}>
              {code ? (
                <div className={styles.summaryCard}>
                  <p className={styles.summaryCardTitle}>Pasted code</p>
                  <p className={styles.summaryCardMeta}>
                    {codeLines} lines | {code.length} characters
                  </p>
                  <pre className={styles.codePreview}>{codePreview}</pre>
                </div>
              ) : null}

              {repoLink ? (
                <div className={styles.summaryCard}>
                  <p className={styles.summaryCardTitle}>GitHub repository</p>
                  <p className={styles.summaryCardMeta}>Repository link</p>
                  <p className={styles.repoPreview}>{repoLink}</p>
                </div>
              ) : null}

              {files.length > 0 ? (
                <div className={styles.fileList}>
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className={styles.fileItem}
                    >
                      <p className={styles.fileName}>{file.name}</p>
                      <p className={styles.fileMeta}>{file.size}B</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {!code && !repoLink && files.length === 0 ? (
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
