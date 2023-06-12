package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os/exec"
)

func analyzeHandler(w http.ResponseWriter, r *http.Request) {
	// Pythonスクリプトのパス
	pythonScript := "../analytics/script.py"

	// Pythonスクリプトを実行して結果を取得
	result, err := runPythonScript(pythonScript)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 結果をJSON形式で返す
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func runPythonScript(scriptPath string) (map[string]interface{}, error) {
	cmd := exec.Command("python3", scriptPath)
	// 標準出力を取得
	var stdout bytes.Buffer
	cmd.Stdout = &stdout

	err := cmd.Run()
	if err != nil {
		return nil, err
	}

	// Pythonスクリプトの出力を解析
	var result map[string]interface{}
	err = json.Unmarshal(stdout.Bytes(), &result)
	if err != nil {
		return nil, err
	}

	return result, nil
}
