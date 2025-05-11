import React, { useState, useEffect } from 'react';
import './App.css';

const initialBoard = Array(9).fill(null);

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerXTurn, setIsPlayerXTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [isTwoPlayerMode, setIsTwoPlayerMode] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const winner = calculateWinner(board);

  // 🧠 Run AI move after player move
  useEffect(() => {
    if (
      !isTwoPlayerMode &&
      !isPlayerXTurn && // AI's turn
      !gameOver &&
      !winner
    ) {
      const timeout = setTimeout(() => {
        const aiMove = getBestMove(board);
        if (aiMove !== undefined) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);

          const winAfterAI = calculateWinner(newBoard);
          if (winAfterAI || newBoard.every(Boolean)) {
            setGameOver(true);
          } else {
            setIsPlayerXTurn(true);
          }
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [board, isPlayerXTurn, isTwoPlayerMode, gameOver, winner]);

  const handleClick = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isPlayerXTurn ? 'X' : 'O';
    setBoard(newBoard);

    const currentWinner = calculateWinner(newBoard);
    if (currentWinner || newBoard.every(Boolean)) {
      setGameOver(true);
      return;
    }

    if (isTwoPlayerMode) {
      setIsPlayerXTurn(!isPlayerXTurn);
    } else {
      setIsPlayerXTurn(false); // AI's turn
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setGameOver(false);
    setIsPlayerXTurn(true);
    setGameStarted(false);
  };

  const startGame = (mode) => {
    setIsTwoPlayerMode(mode === '2p');
    setBoard(initialBoard);
    setGameOver(false);
    setIsPlayerXTurn(true);
    setGameStarted(true);
  };

  const currentPlayer = isTwoPlayerMode
    ? isPlayerXTurn ? 'X' : 'O'
    : 'X';

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      {!gameStarted && (
        <div className="mode-select">
          <button onClick={() => startGame('2p')}>2 Player Mode</button>
          <button onClick={() => startGame('ai')}>Play vs AI</button>
        </div>
      )}

      {gameStarted && (
        <>
          <div className="board">
            {board.map((cell, idx) => (
              <div
                key={idx}
                className="cell"
                onClick={() => handleClick(idx)}
              >
                {cell}
              </div>
            ))}
          </div>

          <div className="status">
            {winner
              ? `Winner: ${winner}`
              : board.every(Boolean)
              ? "It's a draw!"
              : isTwoPlayerMode
              ? `Player ${currentPlayer}'s turn`
              : isPlayerXTurn
              ? "Your turn"
              : "AI thinking..."}
          </div>

          <button className="restart" onClick={resetGame}>
            Restart
          </button>
        </>
      )}
    </div>
  );
};

// --- Minimax & Helper Functions ---

const calculateWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const getBestMove = (board) => {
  let bestScore = -Infinity;
  let move;
  board.forEach((cell, idx) => {
    if (!cell) {
      board[idx] = 'O';
      const score = minimax(board, 0, false);
      board[idx] = null;
      if (score > bestScore) {
        bestScore = score;
        move = idx;
      }
    }
  });
  return move;
};

const minimax = (board, depth, isMaximizing) => {
  const winner = calculateWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (board.every(Boolean)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    board.forEach((cell, idx) => {
      if (!cell) {
        board[idx] = 'O';
        const score = minimax(board, depth + 1, false);
        board[idx] = null;
        best = Math.max(best, score);
      }
    });
    return best;
  } else {
    let best = Infinity;
    board.forEach((cell, idx) => {
      if (!cell) {
        board[idx] = 'X';
        const score = minimax(board, depth + 1, true);
        board[idx] = null;
        best = Math.min(best, score);
      }
    });
    return best;
  }
};

export default App;
