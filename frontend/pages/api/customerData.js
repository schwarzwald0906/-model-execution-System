// api.js
import axios from "axios";

export async function getCustomerData() {
  const response = await axios.get("http://localhost:8080/getColumn"); // データを取得するAPIエンドポイント
  return response.data;
}

// import axios from "axios";

// export async function getCustomerData() {
//   const response = await axios.get("http://localhost:8080/getColumn"); // データを取得するAPIエンドポイント
//   return response.data;
// }
