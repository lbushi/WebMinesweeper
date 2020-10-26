import React, {useEffect, useState} from "react";
import Row from "./Row";
function validCell(row, col, size) {
    return row >= 0 && row < size && col >= 0 && col < size;
}
function Grid(props) {
    let rows = [];
    let bombs = 0;
    let [state, setState] = useState({
        grid: init(),
        bombs: bombs,
        totalRevealed: 0,
        game_over:false
    });
    function init() {
        let grid = [];
        for (let i = 0; i < props.size; ++i) {
            grid.push([]);
            for (let j = 0; j < props.size; ++j) {
                grid[i].push({
                    row: i,
                    col: j,
                    isBomb: isBombRandom(),
                    isRevealed: false,
                    isFlagged: false,
                    bombsAround: 0
                })
            }
        }
        for (let i = 0; i < props.size; ++i) {
            for (let j = 0; j < props.size; ++j) {
                let neighbours = [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1], [i + 1, j + 1], [i - 1, j + 1], [i - 1, j - 1], [i + 1, j - 1]];
                for (let k = 0; k < 8; ++k) {
                let  [row, col] = neighbours[k];
                if (validCell(row, col, props.size)) {
                    grid[i][j].bombsAround += (grid[row][col].isBomb ? 1 : 0);
                }
            }
            }
        }
        return grid;
    }
    function isBombRandom() {
        let rand = Math.floor((Math.random() * props.level));
        let result = (rand % props.level) === 0;
        if (result) {
            bombs++;
        }
        return result;
    }
    function updateCell(grid, row, col, action) {
        if (action === "reveal") {
        grid[row][col].isRevealed = true;
        }
        else {
            grid[row][col].isFlagged = !grid[row][col].isFlagged;
        }
        return grid;
    }
    function checkRevealed() {
        console.log(state.totalRevealed);
        console.log(state.bombs);
        if (props.size * props.size - state.bombs === state.totalRevealed) {
            console.log("yes");
            setState((prevState) => {
                return {...prevState, game_over: "won"};
            });
        }
        console.log(state.game_over);
    }
    function recursiveSetState(row, col) {
        let visited = new Set();
        let stack = [];
        stack.push([row, col]);
        visited.add(String(row) + "," + String(col));
        while (stack.length) {
            let i = stack[stack.length - 1][0];
            let j = stack[stack.length - 1][1];
            stack.pop();
            setState((prevState) => {return {...prevState, grid: updateCell(prevState.grid, i, j, "reveal"), totalRevealed: prevState.totalRevealed + 1}});
            if (state.grid[i][j].bombsAround !== 0) continue;
            let neighbours = [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1], [i + 1, j + 1], [i - 1, j + 1], [i - 1, j - 1], [i + 1, j - 1]];
            for (let k = 0; k < 8; ++k) {
                let [row_1, col_1] = neighbours[k];
                if (validCell(row_1, col_1, props.size) && !visited.has((String(row_1) + "," + String(col_1)))) {
                    stack.push([row_1, col_1]);
                    visited.add((String(row_1) + "," + String(col_1)));
                }
            }
        }
    }
    useEffect(() => {
        checkRevealed();
    }, [state.totalRevealed]);
    function handleClick(row, col, flag) {
        if (state.game_over !== false || state.grid[row][col].isRevealed) return;
        if (!flag) {
            if (state.grid[row][col].isBomb) {
                setState({...state, grid: updateCell(state.grid, row, col, "reveal"), game_over: "lost"});
                return;
            }
            else {
                recursiveSetState(row, col);
            }
        }
        else {
            setState({...state, grid: updateCell(state.grid, row, col, "flag")});
        }
    }
    for (let i = 0; i < props.size; ++i) {
        rows.push(<Row key = {i} size={props.size} row={i} cells={state.grid[i]} onclick={handleClick}></Row>)
    }
    return (
        <div>
        <p style={{textAlign:"center"}}>Minesweeper <br></br> {state.game_over === "lost" && "Game over! You clicked on a mine!"} {state.game_over === "won" && "You won! All the empty squares are marked!"}</p>
        <div class = "container" style={{marginTop: "2%"}}> 
        {rows}
        </div>
        </div>
    );
}
export default Grid;