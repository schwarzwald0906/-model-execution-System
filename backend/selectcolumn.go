package main

import (
	"encoding/csv"
	"encoding/json"
	"net/http"
	"os"
)

// CSVファイルからカラム名を読み込む関数
func GetColumnNames() ([]string, error) {
	file, err := os.Open("file/output/innerJoinResult.csv")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	rawCSVdata, err := reader.Read() // ファイルの最初の行のみを読み込む
	if err != nil {
		return nil, err
	}

	// CSVのヘッダー(最初の行)を取得
	headers := rawCSVdata

	return headers, nil
}

// APIエンドポイントのハンドラ
func GetColumnNamesHandler(w http.ResponseWriter, r *http.Request) {
	headers, err := GetColumnNames()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(headers) // カラム名のみをJSONでエンコード
}

func RemoveColumns(w http.ResponseWriter, r *http.Request) {
	var columnNamesToRemove []string
	err := json.NewDecoder(r.Body).Decode(&columnNamesToRemove)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// CSVを読み込み、選択された列を削除
	// 省略: 選択された列を削除した新しいCSVを作成
	// 省略: 新しいCSVを保存
}
