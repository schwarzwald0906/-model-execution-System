import axios from "axios";
import React, { useState } from "react";

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

  return (
    <div>
      <h1>モデル実行システム</h1>
      <h2>step1　ファイルアップロード</h2>
      <form onSubmit={submitFile}>
        <input type="file" onChange={(e) => setFile1(e.target.files[0])} />
        <br />
        <input type="file" onChange={(e) => setFile2(e.target.files[0])} />
        <br />
        <input type="file" onChange={(e) => setFile3(e.target.files[0])} />
        <br />
        <br />
        <button type="submit">ファイルアップロード</button>
      </form>
      <br />
      {message && (
        <div style={{ color: isError ? "red" : "green" }}>{message}</div>
      )}
      <h2>step2　ファイル加工形式の選択</h2>
      <button type="inner_join">INNER JOIN</button>
      <br />
      <br />
      <button type="left_outer_join">LEFT OUTER JOIN</button>
      <br />
      <br />
      <button type="right_outer_join">RIGHT OUTER JOIN</button>
    </div>
  );
};

export default FileUpload;
