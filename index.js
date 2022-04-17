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
  };

  domBoard.addEventListener("click", (e) => {
    if (!e.target.classList.contains("board__square")) return;
    insert(gameController.getCurrentPlayer().piece, e.target.dataset.square);
  });

  return {
    board,
    insert,
  };
})();

const displayController = (function () {
  const domBoard = document.querySelector(".board");
  const renderBoard = () => {
    gameBoard.board.forEach((el, i) => {
      domBoard.children[i].textContent = el;
    });
  };
  const clearBoard = () => {
    gameBoard.board.splice(0, gameBoard.board.length);
    Array.from(domBoard.children).forEach((e) => (e.textContent = ""));
  };

  return {
    renderBoard,
    clearBoard,
  };
})();

// game controller module
const gameController = (function () {
  // Player factory
  const Player = function (piece) {
    return {
      piece,
    };
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

  return {
    getCurrentPlayer,
    changeCurrentPlayer,
  };
})();
