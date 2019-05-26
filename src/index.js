import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';

const Square = (props) => {
    return (
        <button 
            className={`square ${props.winningSquare ? 'winningSquare' : 'null'}`} 
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i<lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], winningSquares: lines[i]};
        }
    }
    return null;
}

class Board extends Component {
    renderSquare(i) {
        let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winningSquare={winningSquare} 
            />
        );
    }

    render() {

        const rows = (rowIndex) => {
            return Array(3).fill().map((v,i) => this.renderSquare(i + rowIndex * 3));
        }

        const grid = (row, col) => {
            return (
                Array(row).fill().map((v,rowIndex) => {
                    return (
                        <div className="board-row">
                            {rows(rowIndex)}
                        </div>
                );})
            )
        };

        return (
            <div>
                {grid(3, 3)}
            </div>
        );
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: null,
                col: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            ascending: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                row: Math.floor(i / 3),
                col: i % 3,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo = (step) => {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sortHandleClick = () => {
        this.setState({
            ascending: !this.state.ascending,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const ascending = this.state.ascending;

        const moves = history.map((step, move) => {
            const desc = move ? 
                `Move #${move} - (${step.row},${step.col})`:
                'Game start';
            return (
                <li key={move}>
                    <button
                        className={this.state.stepNumber === move ? "bold" : "normal"} 
                        onClick={() => this.jumpTo(move)}
                    >
                {desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else if (!winner && history.length === 10) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner={winner && winner.winningSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{ascending ? moves : moves.reverse()}</ol>
                    <button onClick={() => this.sortHandleClick()}>Toggle Sort Order</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

