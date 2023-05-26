package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func uploadFiles(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// ファイルを取得し、それぞれについて同じ処理を行います
		for _, fileKey := range []string{"file1", "file2", "file3"} {
			file, handler, err := r.FormFile(fileKey)
			if err != nil {
				fmt.Println("Error Retrieving the File")
				fmt.Println(err)
				return
			}
			defer file.Close()

			// ファイル名とサイズを表示します
			fmt.Printf("Uploaded File: %+v\n", handler.Filename)
			fmt.Printf("File Size: %+v\n", handler.Size)
			fmt.Printf("MIME Header: %+v\n", handler.Header)

			// アップロードされたファイルを新しいファイルに書き込みます
			dst, err := os.Create(handler.Filename)
			defer dst.Close()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// アップロードされたファイルを新しいファイルにコピーします
			if _, err := io.Copy(dst, file); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		// ファイルのアップロードが成功したら、その旨を通知します
		fmt.Fprintf(w, "Successfully Uploaded Files\n")
	}
}
