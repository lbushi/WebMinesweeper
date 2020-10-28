import React from "react";
import Cell from "./Cell";
function Row(props) {
    let cells = [];
    for (let i = 0; i < props.size; ++i) {
        cells.push(<Cell key = {i} state={props.cells[i]} onclick={props.onclick}></Cell>)
    }
    return (
    <div className = "row" style={{height: "60px"}}>
      {cells}
    </div>
    );
}
export default Row;