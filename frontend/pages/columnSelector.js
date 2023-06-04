import React, { useEffect, useState } from "react";
import styles from "../styles/columnSelector.module.css";
import { getCustomerData } from "./api/customerData";

// チェックボックスのコンポーネントを定義
const CheckboxComponent = ({
  name,
  selectedVariables,
  handleCheckboxChange,
}) => (
  <div>
    <label>
      <input
        type="checkbox"
        name={name}
        checked={selectedVariables[name] || false}
        onChange={handleCheckboxChange}
      />
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </label>
  </div>
);

export default function ColumnSelector() {
  const [columns, setColumns] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState({});

  useEffect(() => {
    async function fetchColumns() {
      const data = await getCustomerData();
      setColumns(data);
    }

    fetchColumns();
  }, []);

  const handleCheckboxChange = (event) => {
    setSelectedVariables({
      ...selectedVariables,
      [event.target.name]: event.target.checked,
    });
  };

  // 選択された列のデータをバックエンドに送り、サーバー上にCSVとして保存するためのAPIを呼び出す関数
  const saveSelectedColumnsData = async (selectedColumns) => {
    const response = await fetch("http://localhost:8080/saveSelectedColumn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedColumns),
    });

    if (!response.ok) {
      throw new Error("保存に失敗しました");
    }
  };

  // ボタンがクリックされたときに呼ばれる関数
  const handleConvertButtonClick = async () => {
    // 選択された列名を取得
    const selectedColumns = Object.entries(selectedVariables)
      .filter(([_, isChecked]) => isChecked)
      .map(([column, _]) => column);

    // 選択された列のデータをバックエンドに送り、サーバー上にCSVとして保存
    try {
      await saveSelectedColumnsData(selectedColumns);
      alert("データの保存に成功しました");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>モデル実行システム</h1>
      <h2 className={styles.heading}>step3　項目選択</h2>
      {/* ここで列のリストをループしてチェックボックスを生成 */}
      {columns.map((column) => (
        <CheckboxComponent
          key={column}
          name={column}
          selectedVariables={selectedVariables}
          handleCheckboxChange={handleCheckboxChange}
        />
      ))}
      <button onClick={handleConvertButtonClick}>変換</button>
    </div>
  );
}
