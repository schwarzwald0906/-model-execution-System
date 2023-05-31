package main

import (
	"encoding/csv"
	"encoding/json"
	"net/http"
	"os"
)

// CSVファイルからデータを読み込む関数
func GetColumnNames() ([]map[string]string, error) {
	file, err := os.Open("file/output/innerJoinResult.csv")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	rawCSVdata, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	// CSVのヘッダー(最初の行)を取得
	headers := rawCSVdata[0]

	// ヘッダー以外のデータ部分を取得
	dataRows := rawCSVdata[1:]

	// データを格納するためのスライスを作成
	var data []map[string]string
	for _, row := range dataRows {
		rowData := make(map[string]string)
		for i, value := range row {
			// 各値をヘッダーの名前でマッピング
			rowData[headers[i]] = value
		}
		data = append(data, rowData)
	}

	return data, nil
}

// APIエンドポイントのハンドラ
func GetColumnNamesHandler(w http.ResponseWriter, r *http.Request) {
	data, err := GetColumnNames()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
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
