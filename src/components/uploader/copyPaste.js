import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./copyPaste.module.css";
import { postUploadJson } from "./uploadClient";

export async function uploadCopyPaste(code) {
  if (!code || !code.trim()) {
    return;
  }

  await postUploadJson({ code });
}

function CopyPaste({
  onCodeChange,
  placeholder = "Paste your code here...",
  showPreview = true,
}) {
  const [code, setCode] = useState("");

  const handleChange = (event) => {
    const nextCode = event.target.value;
    setCode(nextCode);

    if (onCodeChange) {
      onCodeChange(nextCode);
    }
  };

  const handleClear = () => {
    setCode("");

    if (onCodeChange) {
      onCodeChange("");
    }
  };

  const lineCount = code ? code.split(/\r?\n/).length : 0;
  const characterCount = code.length;

  return (
    <div className={styles.copyPaste}>
      <div className={styles.copyPaste__input}>
        <div className={styles.copyPaste__label}>
          <p className={styles.copyPaste__title}>Paste your code</p>
          <p className={styles.copyPaste__subtitle}>
            Click into the field and paste code with Ctrl+V or Cmd+V.
          </p>
        </div>

        <textarea
          className={styles.copyPaste__textarea}
          value={code}
          onChange={handleChange}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>

      {showPreview ? (
        <div className={styles.copyPaste__preview}>
          <div className={styles.copyPaste__previewHeader}>
            <p className={styles.copyPaste__previewTitle}>Ready to upload</p>
            {code ? (
              <button
                type="button"
                className={styles.copyPaste__clear}
                onClick={handleClear}
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className={styles.copyPaste__summary}>
            <p>{lineCount} lines</p>
            <p>{characterCount} characters</p>
          </div>

          <div className={styles.copyPaste__content}>
            {code ? (
              <pre className={styles.copyPaste__code}>{code}</pre>
            ) : (
              <p className={styles.copyPaste__empty}>
                Pasted code will appear here for review.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

CopyPaste.propTypes = {
  onCodeChange: PropTypes.func,
  placeholder: PropTypes.string,
  showPreview: PropTypes.bool,
};

export default CopyPaste;
