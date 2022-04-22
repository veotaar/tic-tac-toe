"use strict";

const gameBoard = (function () {
  let board = [];
  let taken = [];
  const domBoard = document.querySelector(".board");

  const insert = (el, pos) => {
    if (taken[pos]) return;
    board[pos] = el;
    taken[pos] = true;
    displayController.renderBoard();
    gameController.changeCurrentPlayer();
    gameController.checkWinner();
  };

  domBoard.addEventListener("click", (e) => {
    if (!e.target.classList.contains("board__square")) return;
    if (!gameController.getGameRunning()) return;
    insert(gameController.getCurrentPlayer().piece, e.target.dataset.square);
  });

  return {
    board,
    taken,
    insert,
  };
})();

const displayController = (function () {
  const domBoard = document.querySelector(".board");
  const screen = document.querySelector(".screen");
  const playerXInput = document.querySelector("#player-x");
  const playerOInput = document.querySelector("#player-o");

  const renderBoard = () => {
    gameBoard.board.forEach((el, i) => {
      domBoard.children[i].textContent = el;
    });
  };

  const clearBoard = () => {
    gameBoard.board.splice(0, gameBoard.board.length);
    gameBoard.taken.splice(0, gameBoard.taken.length);
    Array.from(domBoard.children).forEach((e) => (e.textContent = ""));
  };

  const highlightWinner = (positions) => {
    if (gameController.getGameRunning()) return;
    const winnerSquares = positions.map((pos) =>
      domBoard.querySelector(`[data-square="${pos}"]`)
    );
    winnerSquares.forEach((sq) => sq.classList.add("winner"));
  };

  const deHighlightWinner = () => {
    const squares = Array.from(domBoard.querySelectorAll(".board__square"));
    squares.forEach((sq) => sq.classList.remove("winner"));
  };

  const getPlayerNames = () => {
    const x = playerXInput.value;
    const o = playerOInput.value;
    return {
      x,
      o,
    };
  };

  const anounceWinner = (result) => (screen.innerText = result);
  const removeWinnerText = () => (screen.innerText = "");

  return {
    renderBoard,
    clearBoard,
    highlightWinner,
    deHighlightWinner,
    anounceWinner,
    removeWinnerText,
    getPlayerNames,
  };
})();

////////////////////////////
// game controller module
const gameController = (function () {
  let isGameRunning = true;
  let rounds = 9;

  // Player factory
  const Player = function (playerName, piece) {
    return {
      playerName,
      piece,
    };
  };

  // create players
  const playerX = Player("", "X");
  const playerO = Player("", "O");
  const players = [playerX, playerO];
  let currentPlayer = players[0];

  const _checkThree = (pos1, pos2, pos3) => {
    const { board } = gameBoard;
    if (!board[pos1] || !board[pos2]) return;

    return {
      won: board[pos1] === board[pos2] && board[pos2] === board[pos3],
      winner: board[pos1],
      positions: [pos1, pos2, pos3],
    };
  };

  const _updatePlayerNames = () => {
    const playerNames = displayController.getPlayerNames();
    playerX.playerName = playerNames.x;
    playerO.playerName = playerNames.o;
  };

  const checkWinner = () => {
    rounds--;
    const positions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const results = positions
      .map((pos) => _checkThree(pos[0], pos[1], pos[2]))
      .filter((el) => el?.won);
    // as soon as we have a winner, stop playing
    if (results.length) isGameRunning = false;
    if (rounds === 0) {
      displayController.anounceWinner(`It's a draw!`);
      return;
    }
    displayController.highlightWinner(results[0]?.positions);
    if (!isGameRunning) {
      changeCurrentPlayer();
      _updatePlayerNames();
      const winner = getCurrentPlayer();
      displayController.anounceWinner(
        `${winner.playerName} (${winner.piece}) wins!`
      );
    }
  };

  const changeCurrentPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const startNewGame = () => {
    displayController.clearBoard();
    displayController.deHighlightWinner();
    displayController.removeWinnerText();
    rounds = 9;
    currentPlayer = players[0];
    isGameRunning = true;
  };

  const getCurrentPlayer = () => currentPlayer;
  const getGameRunning = () => isGameRunning;

  return {
    getGameRunning,
    getCurrentPlayer,
    changeCurrentPlayer,
    checkWinner,
    startNewGame,
  };
})();

(function () {
  const newGameButton = document.querySelector(".reset");
  newGameButton.addEventListener("click", gameController.startNewGame);
})();
