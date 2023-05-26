package main

import (
	"encoding/csv"
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
