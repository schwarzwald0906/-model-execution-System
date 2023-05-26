import fetch from "node-fetch";

export default async (req, res) => {
  const response = await fetch("http://localhost:8080/api/hello"); // Goのエンドポイントにリクエストを送信
  const data = await response.json(); // レスポンスデータをJSON形式で取得

  res.statusCode = 200;
  res.json(data);
};
