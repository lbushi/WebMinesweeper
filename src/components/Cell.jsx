import React from "react";
const bomb = <i class="fas fa-bomb fa-lg" style={{marginTop: "22px"}}></i>;
const flag = <i class="fas fa-flag fa-lg" style={{marginTop: "22px"}}></i>;
function Cell(props) {
    function handleClick() {
        props.onclick(props.state.row, props.state.col, false);
    }
    function handleRightClick(event) {
        event.preventDefault();
        props.onclick(props.state.row, props.state.col, true);
    }
    function getSymbol() {
        if (props.state.isRevealed) {
            if (props.state.isBomb) {
                return bomb;
            }
            else {
                return <h4 style={{marginTop: "15px"}}>{props.state.bombsAround}</h4>;
            }
        }
        else {
            if (props.state.isFlagged) {
                return flag;
            }
        }
        return null;
    }
    return (
        <div className = "col" style={{textAlign: "center", backgroundColor: (!(props.state.isRevealed || props.state.isFlagged) && "#a6a5a5")}} onClick={handleClick} onContextMenu={handleRightClick}>{getSymbol()}</div>
    );
}
export default Cell;