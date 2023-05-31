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
    </div>
  );
}
