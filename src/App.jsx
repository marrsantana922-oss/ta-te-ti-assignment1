import { useState } from 'react';

import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import GameOver from './components/GameOver.jsx';
import { WINNING_COMBINATIONS } from './winning-combinations.js';

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveWinnerSymbol(gameBoard) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = firstSquareSymbol;
    }
  }

  return winner;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const [winsX, setWinsX] = useState(0);
  const [drawsX, setDrawsX] = useState(0);
  const [winsO, setWinsO] = useState(0);
  const [drawsO, setDrawsO] = useState(0);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winnerSymbol = deriveWinnerSymbol(gameBoard);
  const winner = winnerSymbol ? players[winnerSymbol] : undefined;
  const hasDraw = gameTurns.length === 9 && !winnerSymbol;

  function handleSelectSquare(rowIndex, colIndex) {
    const updatedTurns = [
      { square: { row: rowIndex, col: colIndex }, player: activePlayer },
      ...gameTurns,
    ];
    setGameTurns(updatedTurns);

    const newWinner = deriveWinnerSymbol(deriveGameBoard(updatedTurns));

    if (newWinner === 'X') {
      setWinsX(winsX + 1);
    } else if (newWinner === 'O') {
      setWinsO(winsO + 1);
    } else if (updatedTurns.length === 9) {
      setDrawsX(drawsX + 1);
      setDrawsO(drawsO + 1);
    }
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handleResetScores() {
    setWinsX(0);
    setDrawsX(0);
    setWinsO(0);
    setDrawsO(0);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
            wins={winsX}
            draws={drawsX}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
            wins={winsO}
            draws={drawsO}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
        <button id="reset-scores" onClick={handleResetScores}>
          Reiniciar marcador
        </button>
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
