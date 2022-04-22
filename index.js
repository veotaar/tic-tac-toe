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
    insert,
  };
})();

const displayController = (function () {
  const domBoard = document.querySelector(".board");
  const screen = document.querySelector(".screen");

  const renderBoard = () => {
    gameBoard.board.forEach((el, i) => {
      domBoard.children[i].textContent = el;
    });
  };

  const clearBoard = () => {
    gameBoard.board.splice(0, gameBoard.board.length);
    Array.from(domBoard.children).forEach((e) => (e.textContent = ""));
  };

  const highlightWinner = (positions) => {
    if (gameController.getGameRunning()) return;
    const winnerSquares = positions.map((pos) =>
      domBoard.querySelector(`[data-square="${pos}"]`)
    );
    winnerSquares.forEach((sq) => sq.classList.add("winner"));
  };

  const anounceWinner = (winner) => (screen.innerText = `Winner is ${winner}`);

  return {
    renderBoard,
    clearBoard,
    highlightWinner,
    anounceWinner,
  };
})();

////////////////////////////
// game controller module
const gameController = (function () {
  let isGameRunning = true;
  let rounds = 9;

  // Player factory
  const Player = function (piece) {
    return {
      piece,
    };
  };

  const _checkThree = (pos1, pos2, pos3) => {
    const { board } = gameBoard;
    if (!board[pos1] || !board[pos2]) return;

    return {
      won: board[pos1] === board[pos2] && board[pos2] === board[pos3],
      winner: board[pos1],
      positions: [pos1, pos2, pos3],
    };
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
      console.log("DRAW");
      return;
    }
    displayController.highlightWinner(results[0]?.positions);
    if (!isGameRunning) {
      console.log(`Winner: ${results[0].winner}`);
      displayController.anounceWinner(`${results[0].winner}`);
    }
  };

  // create players
  const playerX = Player("X");
  const playerO = Player("O");
  const players = [playerX, playerO];
  let currentPlayer = players[0];

  const changeCurrentPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const getCurrentPlayer = () => currentPlayer;
  const getGameRunning = () => isGameRunning;

  return {
    getGameRunning,
    getCurrentPlayer,
    changeCurrentPlayer,
    checkWinner,
  };
})();
