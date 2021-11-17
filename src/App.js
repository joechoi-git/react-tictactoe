import React from "react";
import "./App.css";

function Square(props) {
  return (
    <button className={props.isWinningCell ? "square-highlight" : "square"} onClick={props.onClick} style={{ backgroundColor: props.isWinningCell ? "yellow": "white"}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinningCell={this.props.winner && this.props.winner.includes(i)}
        key={i}
      />
    );
  }

  columns = [0, 1, 2];
  rows = [0, 1, 2];

  render() {
    return (
      <div>
        {this.rows.map((row) => {
          const rowKey = "row" + row;
          return (
            <div className="board-row" key={rowKey}>
              {this.columns.map((column) => {
                const i = (row * 3) + column;
                return (
                  this.renderSquare(i)
                )
              })}
            </div>
          )
        })}
        {/*}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        {*/}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          value: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      lastMove: null,
      isAscendingSort: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          value: i,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      lastMove: i,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleSort() {
    this.setState({
      isAscendingSort: !this.state.isAscendingSort
    });
  }

  handleReset() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          value: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      lastMove: null,
      isAscendingSort: true,
    });
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    console.log("render", history, stepNumber, current.squares, winner, this.state.isAscendingSort);

    const moves = history.map((step, index) => {
      const cell = calulateCell(step.value);
      // console.log(step, index, cell);
      const desc = (index > 0) ?
        `Go to move # ${index} (Column:${cell[0]}, Row:${cell[1]})` :
        'Go to game start';
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>
            {(stepNumber === index) ? (
              <strong>{desc}</strong>
            ):(
              desc
            )}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner[0];
    } else {
      if (stepNumber > 8) {
        status = "There was no winner this round. Try again!";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={(winner) ? winner[1] : null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.handleSort()}>
              {this.state.isAscendingSort ? (
                <>Sort Descending</>
              ):(
                <>Sort Ascending</>
              )}
            </button>
            <button onClick={() => this.handleReset()}>
              Start a New Game
            </button>
          </div>
          <ol reversed={!this.state.isAscendingSort}>
            {(this.state.isAscendingSort) ? moves : moves.reverse()}
          </ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // console.log(squares[a], squares[b], squares[c]);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { // all X or all O
      return [squares[a], lines[i]];
    }
  }
  return null;
}

function calulateCell(value) {
  const rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];
  const columns = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ];  
  let column = null;
  let row = null;
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].includes(value)) {
      column = i;
    }
  }
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes(value)) {
      row = i;
    }
  }
  return [column, row];
}

export default Game;
