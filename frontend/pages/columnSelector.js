import React, { useEffect, useState } from "react";
import styles from "../styles/columnSelector.module.css";
import { getCustomerData } from "./api/customerData";

export default function ColumnSelector() {
  const [customers, setCustomers] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState({});

  useEffect(() => {
    async function fetchCustomers() {
      const data = await getCustomerData();
      setCustomers(data);
    }

    fetchCustomers();
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
      {customers.map((customer, index) => (
        <div key={index}>
          <div>
            <label>
              <input
                type="checkbox"
                name="age"
                checked={selectedVariables["age"] || false}
                onChange={handleCheckboxChange}
              />
              Age: {customer.age}
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="customer_rank"
                checked={selectedVariables["customer_rank"] || false}
                onChange={handleCheckboxChange}
              />
              Customer Rank: {customer.customer_rank}
            </label>
          </div>
          {/* 他の項目も同様に追加... */}
        </div>
      ))}
    </div>
  );
}
