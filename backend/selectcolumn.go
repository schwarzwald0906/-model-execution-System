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

// 選択されたカラムのデータを取得し、サーバー上にCSVとして保存
func SaveSelectedColumnsData(selectedColumns []string) error {
	file, err := os.Open("file/output/innerJoinResult.csv")
	if err != nil {
		return err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	allRows, err := reader.ReadAll() // 全行読み込む
	if err != nil {
		return err
	}

	headers := allRows[0]
	var selectedRows [][]string

	for _, row := range allRows[1:] { // ヘッダー行を除いてループ
		var selectedRow []string
		for idx, header := range headers {
			for _, selectedColumn := range selectedColumns {
				if selectedColumn == header {
					selectedRow = append(selectedRow, row[idx])
				}
			}
		}
		selectedRows = append(selectedRows, selectedRow)
	}

	// 選択されたカラムのデータをサーバー上にCSVとして保存
	outputFile, err := os.Create("file/output/selectedData.csv")
	if err != nil {
		return err
	}
	defer outputFile.Close()

	writer := csv.NewWriter(outputFile)
	writer.Write(selectedColumns) // ヘッダー行を書き込む
	writer.WriteAll(selectedRows) // データ行を書き込む
	writer.Flush()

	return nil
}

// APIエンドポイントのハンドラ
func SaveSelectedColumnsDataHandler(w http.ResponseWriter, r *http.Request) {
	// リクエストボディから選択された項目名を取得
	var selectedColumns []string
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&selectedColumns); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err := SaveSelectedColumnsData(selectedColumns)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
