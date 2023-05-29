package main

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"os"
)

func parseCSV(filepath string) ([][]string, error) {
	file, err := os.Open(filepath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	data, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	return data, nil
}

func convertDataToMap(data [][]string) map[string]map[string]string {
	headers := data[0]
	body := data[1:]

	dataMap := make(map[string]map[string]string)
	for _, row := range body {
		rowMap := make(map[string]string)
		for i, cell := range row {
			rowMap[headers[i]] = cell
		}
		dataMap[row[0]] = rowMap // Assuming that the first column is 'id'
	}

	return dataMap
}

func innerJoin(map1, map2 map[string]map[string]string) map[string]map[string]string {
	resultMap := make(map[string]map[string]string)

	for id, row := range map1 {
		if row2, ok := map2[id]; ok {
			joinedRow := make(map[string]string)
			for k, v := range row {
				joinedRow[k] = v
			}
			for k, v := range row2 {
				joinedRow[k] = v
			}
			resultMap[id] = joinedRow
		}
	}

	return resultMap
}
func leftOuterJoin(map1, map2 map[string]map[string]string) map[string]map[string]string {
	resultMap := make(map[string]map[string]string)

	for id, row := range map1 {
		joinedRow := make(map[string]string)
		for k, v := range row {
			joinedRow[k] = v
		}
		if row2, ok := map2[id]; ok {
			for k, v := range row2 {
				joinedRow[k] = v
			}
		}
		resultMap[id] = joinedRow
	}

	return resultMap
}

func rightOuterJoin(map1, map2 map[string]map[string]string) map[string]map[string]string {
	return leftOuterJoin(map2, map1)
}

func writeMapToCSV(filename string, data map[string]map[string]string) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	headersSet := make(map[string]struct{})
	for _, row := range data {
		for header := range row {
			headersSet[header] = struct{}{}
		}
	}

	headers := make([]string, 0, len(headersSet))
	for header := range headersSet {
		headers = append(headers, header)
	}

	if err := writer.Write(headers); err != nil {
		return err
	}

	for _, row := range data {
		rowSlice := make([]string, len(headers))
		for i, header := range headers {
			rowSlice[i] = row[header]
		}

		if err := writer.Write(rowSlice); err != nil {
			return err
		}
	}

	return nil
}

func performJoin(w http.ResponseWriter, r *http.Request, fileNames []string, outputFile string, joinFunc func(map[string]map[string]string, map[string]map[string]string) map[string]map[string]string) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	fmt.Println("Performing Join operation on files:", fileNames)

	data1, err := parseCSV(fileNames[0])
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}
	data2, err := parseCSV(fileNames[1])
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}
	data3, err := parseCSV(fileNames[2])
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}

	map1 := convertDataToMap(data1)
	map2 := convertDataToMap(data2)
	map3 := convertDataToMap(data3)

	resultMap := joinFunc(map1, map2)
	resultMap = joinFunc(resultMap, map3)

	err = writeMapToCSV(outputFile, resultMap)
	if err != nil {
		http.Error(w, "Error writing result", http.StatusInternalServerError)
		return
	}

	// fmt.Fprintln(w, successMessage)
}

func InnerJoinHandler(w http.ResponseWriter, r *http.Request) {
	performJoin(w, r, []string{"file/input/file1.csv", "file/input/file2.csv", "file/input/file3.csv"}, "file/output/innerJoinResult.csv", innerJoin)
}

func LeftOuterJoinHandler(w http.ResponseWriter, r *http.Request) {
	performJoin(w, r, []string{"file/input/file1.csv", "file/input/file2.csv", "file/input/file3.csv"}, "file/output/leftOuterJoinResult.csv", leftOuterJoin)
}

func RightOuterJoinHandler(w http.ResponseWriter, r *http.Request) {
	performJoin(w, r, []string{"file/input/file1.csv", "file/input/file2.csv", "file/input/file3.csv"}, "file/output/rightOuterJoinResult.csv", rightOuterJoin)
}
