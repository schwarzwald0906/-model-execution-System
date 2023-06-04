import React, { useEffect, useState } from "react";
import styles from "../styles/columnSelector.module.css";
import { getCustomerData } from "./api/customerData";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const CheckboxComponent = ({
  name,
  selectedVariables,
  handleCheckboxChange,
  index,
}) => (
  <Draggable draggableId={name} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <label>
          <input
            type="checkbox"
            name={name}
            checked={selectedVariables[name] || false}
            onChange={handleCheckboxChange}
          />
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </label>
      </div>
    )}
  </Draggable>
);

const saveSelectedColumnsData = async (selectedColumns) => {
  const response = await fetch("http://localhost:8080/saveSelectedColumn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedColumns),
  });

  if (!response.ok) {
    throw new Error("保存に失敗しました");
  }
};

export default function ColumnSelector() {
  const [columns, setColumns] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState({});

  useEffect(() => {
    async function fetchColumns() {
      const data = await getCustomerData();
      setColumns(data);
    }

    fetchColumns();
  }, []);

  const handleCheckboxChange = (event) => {
    setSelectedVariables({
      ...selectedVariables,
      [event.target.name]: event.target.checked,
    });
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setColumns(items);
  };

  const handleConvertButtonClick = async () => {
    const selectedColumns = Object.entries(selectedVariables)
      .filter(([_, isChecked]) => isChecked)
      .map(([column, _]) => column);

    try {
      await saveSelectedColumnsData(selectedColumns);
      alert("データの保存に成功しました");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>モデル実行システム</h1>
      <h2 className={styles.heading}>step3　項目選択</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="columns">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {columns.map((column, index) => (
                <CheckboxComponent
                  key={column}
                  name={column}
                  selectedVariables={selectedVariables}
                  handleCheckboxChange={handleCheckboxChange}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleConvertButtonClick}>変換</button>
    </div>
  );
}
