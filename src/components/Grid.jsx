import {useEffect, useState} from "react";
import Row from "./Row";
function validCell(row, col, size) {
    return row >= 0 && row < size && col >= 0 && col < size;
}
function Grid(props) {
    let rows = [];
    let bombs = 0;
    let [state, setState] = useState({
        grid: start(),
		initialized: false,
        bombs: 0,
        totalRevealed: 0,
		prevRow: -1,
		prevCol: -1,
        game_over:false
    });
	 function start() {
        let grid = [];
        for (let i = 0; i < props.size; ++i) {
            grid.push([]);
            for (let j = 0; j < props.size; ++j) {
                grid[i].push({
                    row: i,
                    col: j,
                    isBomb: false,
                    isRevealed: false,
                    isFlagged: false,
                    bombsAround: 0
                })
            }
        }
        return grid;
    }
    function init(prevRow, prevCol) {
        let grid = [];
        bombs = 0;
        for (let i = 0; i < props.size; ++i) {
            grid.push([]);
            for (let j = 0; j < props.size; ++j) {
                grid[i].push({
                    row: i,
                    col: j,
                    isBomb: (i === prevRow && j === prevCol) ? false: isBombRandom(),
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
        let result = ((rand % props.level) === 0);
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
        if (props.size * props.size - state.bombs === state.totalRevealed) {
            console.log("yes");
            setState((prevState) => {
                return {...prevState, game_over: "won"};
            });
        }
    }
	function resetGrid() {
		setState({grid: start(), bombs : 0, initialized: false, totalRevealed: 0, game_over: false});
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
                if (validCell(row_1, col_1, props.size) && !visited.has((String(row_1) + "," + String(col_1))) && !(state.grid[row_1][col_1].isRevealed || state.grid[row_1][col_1].isFlagged)) {
                    stack.push([row_1, col_1]);
                    visited.add((String(row_1) + "," + String(col_1)));
                }
            }
        }
    }
    useEffect(() => {
        checkRevealed();
    }, [state.totalRevealed]);
	useEffect(() => {
		if (state.initialized) recursiveSetState(state.prevRow, state.prevCol);
	}, [state.initialized]);
    function handleClick(row, col, flag) {
		if (!state.initialized) {
			setState({...state, grid: init(row, col), bombs: bombs, initialized: true, prevRow: row, prevCol: col});
			return;
		}
        if (state.game_over !== false || state.grid[row][col].isRevealed || (state.grid[row][col].isFlagged && !flag)) return;
        if (!flag) {
            if (state.grid[row][col].isBomb) {
                setState({...state, grid: updateCell(state.grid, row, col, "reveal"), prevRow: row, prevCol: col, game_over: "lost"});
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
    function redo() {
        let grid = state.grid;
        grid[state.prevRow][state.prevCol].isRevealed = false;
        setState({...state, grid: grid, game_over: false});
    }
    for (let i = 0; i < props.size; ++i) {
        rows.push(<Row key = {i} size={props.size} row={i} cells={state.grid[i]} onclick={handleClick}></Row>)
    }
    return (
        <div>
        <p style={{textAlign:"center"}}>Minesweeper <br></br> {state.game_over === "lost" && <p>Game over! You clicked on a mine! or <button onClick={redo}>Undo</button>.</p>} {state.game_over === "won" && "You won! All the empty squares are marked!"}
		<br></br><button onClick={resetGrid}>New Game</button></p>
        <div className = "container" style={{marginTop: "2%"}}> 
        {rows}
        </div>
        </div>
    );
}
export default Grid;