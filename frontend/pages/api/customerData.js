// api.js
import axios from "axios";

export async function getCustomerData() {
  const response = await axios.get("http://localhost:8080/getColumn"); // データを取得するAPIエンドポイント
  return response.data;
}

export const saveSelectedColumnsData = async (selectedColumns) => {
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
