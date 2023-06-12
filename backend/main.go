package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/upload", UploadFiles)
	mux.HandleFunc("/innerJoin", InnerJoinHandler)
	mux.HandleFunc("/rightOuterJoin", RightOuterJoinHandler)
	mux.HandleFunc("/leftOuterJoin", LeftOuterJoinHandler)
	mux.HandleFunc("/getColumn", GetColumnNamesHandler)
	mux.HandleFunc("/saveSelectedColumn", SaveSelectedColumnsDataHandler)
	mux.HandleFunc("/analyze", analyzeHandler)

	handler := cors.Default().Handler(mux)
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		data := struct {
			Name string `json:"name"`
		}{
			Name: "Go!!",
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	})

	fmt.Println("Server started at localhost:8080")
	http.ListenAndServe(":8080", handler)
}
