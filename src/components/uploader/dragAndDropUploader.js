// DropFileInput.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./dragAndDrop.module.css";
import { ImageConfig } from "../icons/ImageConfig.js";

const DropFileInput = (props) => {
  const [dragOver, setDragOver] = useState(false);
  const {
    onFileChange,
    selectedFiles = [],
    showPreview = true,
    selectionMode = "file",
  } = props;

  const isFolderMode = selectionMode === "folder";

  const onDragEnter = () => setDragOver(true);
  const onDragLeave = () => setDragOver(false);
  const onDrop = () => setDragOver(false);

  const onFileDrop = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      const updatedList = [...selectedFiles, ...newFiles];
      if (onFileChange) {
        onFileChange(updatedList);
      }
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...selectedFiles];
    updatedList.splice(selectedFiles.indexOf(file), 1);
    if (onFileChange) {
      onFileChange(updatedList);
    }
  };

  return (
    <>
      <div
        className={`${styles["drop-file-input"]} ${dragOver ? styles.dragover : ""}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        data-selection-mode={selectionMode}
      >
        <div className={styles["drop-file-input__label"]}>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20240308113922/Drag-.png"
            alt=""
          />
          <p>
            {isFolderMode
              ? "Drag & Drop your folder contents here"
              : "Drag & Drop your files here"}
          </p>
        </div>
        <input
          type="file"
          multiple
          value=""
          onChange={onFileDrop}
          {...(isFolderMode ? { webkitdirectory: "", directory: "" } : {})}
        />
      </div>
      {showPreview && selectedFiles.length > 0 ? (
        <div className={styles["drop-file-preview"]}>
          <p className={styles["drop-file-preview__title"]}>
            {isFolderMode ? "Folder ready to upload" : "Ready to upload"}
          </p>
          <div className={styles["drop-file-preview__list"]}>
            {selectedFiles.map((item, index) => (
              <div key={index} className={styles["drop-file-preview__item"]}>
                <img
                  src={
                    ImageConfig[item.type.split("/")[1]] ||
                    ImageConfig["default"]
                  }
                  alt=""
                />
                <div className={styles["drop-file-preview__item__info"]}>
                  <p>{item.name}</p>
                  <p>{item.size}B</p>
                </div>
                <span
                  className={styles["drop-file-preview__item__del"]}
                  onClick={() => fileRemove(item)}
                >
                  x
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
  selectedFiles: PropTypes.arrayOf(PropTypes.object),
  showPreview: PropTypes.bool,
  selectionMode: PropTypes.oneOf(["file", "folder"]),
};

export default DropFileInput;
