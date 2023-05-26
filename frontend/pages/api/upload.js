export default function handler(req, res) {
  if (req.method === "POST") {
    const file = req.files?.file;

    if (file) {
      // ファイルの処理を行う
      console.log("Received file:", file.name);
      // ファイルの処理が完了した場合のレスポンスを返す
      res.status(200).json({ message: "File uploaded successfully." });
    } else {
      // ファイルが選択されていない場合のエラーレスポンスを返す
      res.status(400).json({ error: "No file selected." });
    }
  } else {
    // POSTメソッド以外のリクエストに
    res.status(405).json({ error: "Method not allowed." });
  }
}
