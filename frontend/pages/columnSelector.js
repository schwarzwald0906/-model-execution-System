import React, { useEffect, useState } from "react";
import styles from "../styles/columnSelector.module.css";
import axios from "axios";

export async function getCustomerData() {
  const response = await axios.get("http://localhost:8080/getColumn"); // データを取得するAPIエンドポイント
  return response.data;
}

export default function ColumnSelector() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchCustomers() {
      const data = await getCustomerData();
      setCustomers(data);
    }

    fetchCustomers();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>モデル実行システム</h1>
      <h2 className={styles.heading}>step3　項目選択</h2>
      {/* 実際のレイアウトとスタイリングは適宜調整してください */}
      {customers.map((customer, index) => (
        <div key={index}>
          <p>Age: {customer.age}</p>
          <p>Customer Rank: {customer.customer_rank}</p>
          {/* 他の項目も同様に追加... */}
        </div>
      ))}
    </div>
  );
}
