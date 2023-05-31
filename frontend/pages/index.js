import axios from "axios";
import React, { useState } from "react";
import styles from "../styles/index.module.css";
import Link from "next/link";

const FileUpload = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const submitFile = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    formData.append("file3", file3);
    try {
      const res = await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Successfully uploaded files");
      setIsError(false);
    } catch (err) {
      setMessage("An error occurred while uploading files");
      setIsError(true);
    }
  };

  const handleButtonClick = (apiEndpoint) => {
    fetch(`http://localhost:8080/${apiEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileNames: ["file1", "file2", "file3"] }),
    })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Successfully performed Join operation");
          setIsError(false);
        } else {
          setMessage("An error occurred while performing Join operation");
          setIsError(true);
        }
      })
      .catch((error) => {
        setMessage("An error occurred while performing Join operation");
        setIsError(true);
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>モデル実行システム</h1>
      <h2 className={styles.heading}>step1　ファイルアップロード</h2>
      <form onSubmit={submitFile}>
        <input
          className={styles.inputFile}
          type="file"
          onChange={(e) => setFile1(e.target.files[0])}
        />
        <input
          className={styles.inputFile}
          type="file"
          onChange={(e) => setFile2(e.target.files[0])}
        />
        <input
          className={styles.inputFile}
          type="file"
          onChange={(e) => setFile3(e.target.files[0])}
        />
        <button className={styles.uploadButton} type="submit">
          ファイルアップロード
        </button>
      </form>
      <h2 className={`${styles.heading} ${styles.step2Title}`}>
        step2　ファイル加工形式の選択
      </h2>
      <div>
        <button
          className={styles.joinButton}
          onClick={() => handleButtonClick("innerJoin")}
        >
          Inner Join
        </button>
        <button
          className={styles.joinButton}
          onClick={() => handleButtonClick("rightOuterJoin")}
        >
          Right Outer Join
        </button>
        <button
          className={styles.joinButton}
          onClick={() => handleButtonClick("leftOuterJoin")}
        >
          Left Outer Join
        </button>
      </div>
      <br />
      {message && (
        <div
          className={`${styles.message} ${
            isError ? styles.error : styles.success
          }`}
        >
          {message}
        </div>
      )}
      <Link legacyBehavior href="/columnSelector">
        <a>次へ</a>
      </Link>
    </div>
  );
};

export default FileUpload;
