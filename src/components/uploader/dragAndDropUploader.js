// DropFileInput.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./DragAndDrop.module.css";
import { ImageConfig } from "../icons/ImageConfig.js";

const DropFileInput = (props) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { onFileChange, showPreview = true } = props;

  const onDragEnter = () => setDragOver(true);
  const onDragLeave = () => setDragOver(false);
  const onDrop = () => setDragOver(false);

  const onFileDrop = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      const updatedList = [...fileList, ...newFiles];
      setFileList(updatedList);
      if (onFileChange) {
        onFileChange(updatedList);
      }
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
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
      >
        <div className={styles["drop-file-input__label"]}>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20240308113922/Drag-.png"
            alt=""
          />
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" multiple value="" onChange={onFileDrop} />
      </div>
      {showPreview && fileList.length > 0 ? (
        <div className={styles["drop-file-preview"]}>
          <p className={styles["drop-file-preview__title"]}>Ready to upload</p>
          <div className={styles["drop-file-preview__list"]}>
            {fileList.map((item, index) => (
              <div key={index} className={styles["drop-file-preview__item"]}>
                <img
                  src={
                    ImageConfig[item.type.split("/")[1]] || ImageConfig["default"]
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
  showPreview: PropTypes.bool,
};

export default DropFileInput;
