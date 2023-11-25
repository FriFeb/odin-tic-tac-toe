let player1, player2;

function createPlayer(name, mark) {
  const turn = (function createTurn() {
    let row, col;

    const setCoords = (newRow, newCol) => {
      row = newRow;
      col = newCol;
    };

    const isLegitTurn = () => gameboard.isEmptyCell(row, col);

    const generateRandomTurn = () => {
      row = Math.floor(Math.random() * 3);
      col = Math.floor(Math.random() * 3);

      if (!isLegitTurn()) generateRandomTurn();
    };

    const playTurn = function () {
      gameboard.setCellMark(row, col, getPlayerMark());
    };

    return {
      setCoords,
      generateRandomTurn,
      isLegitTurn,
      playTurn,
    };
  })();

  const getPlayerName = () => name;
  const setPlayerName = (newName) => (name = newName);

  const getPlayerMark = () => mark;
  const setPlayerMark = (newMark) => (mark = newMark);

  return { turn, getPlayerName, setPlayerName, getPlayerMark, setPlayerMark };
}

const gameboard = (function () {
  const gameboard = [
    ["0", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"],
  ];

  const get = () => gameboard;

  const reset = () => {
    gameboard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => (gameboard[rowIndex][colIndex] = "0"));
    });
  };

  const isEmptyCell = (rowIndex, colIndex) =>
    gameboard[rowIndex][colIndex] === "0";

  const setCellMark = (rowIndex, colIndex, playerMark) => {
    gameboard[rowIndex][colIndex] = playerMark;
  };

  const isPlayerWinner = (player) => {
    const playerMark = player.getPlayerMark();

    for (let i = 0; i < gameboard.length; i++) {
      // check row
      if (
        gameboard[i][0] === playerMark &&
        gameboard[i][1] === playerMark &&
        gameboard[i][2] === playerMark
      ) {
        return true;
      }

      // check column
      if (
        gameboard[0][i] === playerMark &&
        gameboard[1][i] === playerMark &&
        gameboard[2][i] === playerMark
      ) {
        return true;
      }
    }

    if (
      // Check diagonal 1
      gameboard[0][0] === playerMark &&
      gameboard[1][1] === playerMark &&
      gameboard[2][2] === playerMark
    ) {
      return true;
    }

    if (
      // Check diagonal 2
      gameboard[0][2] === playerMark &&
      gameboard[1][1] === playerMark &&
      gameboard[2][0] === playerMark
    ) {
      return true;
    }

    return false;
  };

  const isFullGameboard = () => {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        if (isEmptyCell(i, j)) return false;
      }
    }
    return true;
  };

  return {
    get,
    reset,
    isEmptyCell,
    setCellMark,
    isPlayerWinner,
    isFullGameboard,
  };
})();

const game = (function () {
  function createMessage(winMsg, lossMsg, drawMsg) {
    let message, type;

    const set = () => {
      const roundResult = round.getState();

      if (roundResult === "player1") {
        message = winMsg;
        type = "success";
        return;
      }
      if (roundResult === "player2") {
        message = lossMsg;
        type = "danger";
        return;
      }
      if (roundResult === "draw") {
        message = drawMsg;
        type = "dark";
        return;
      }
    };

    const show = () => {
      DOMElements.alertBox.hideAlert();

      set();
      const alert = DOMElements.alertBox.createAlert(message, type);
      DOMElements.alertBox.showAlert(alert);
    };

    return {
      show,
    };
  }

  const round = (function () {
    let message;

    const isOver = () => {
      return (
        gameboard.isFullGameboard() ||
        gameboard.isPlayerWinner(player1) ||
        gameboard.isPlayerWinner(player2)
      );
    };

    const getState = () => {
      if (gameboard.isPlayerWinner(player1)) {
        return "player1";
      }
      if (gameboard.isPlayerWinner(player2)) {
        return "player2";
      }
      if (gameboard.isFullGameboard()) {
        return "draw";
      }
    };

    const endRound = () => {
      score.update();
      setTimeout(message.show, 0);
    };

    const generateMessage = () => {
      message = createMessage(
        `<i class="bi bi-trophy me-3"></i> ` +
          `${player1.getPlayerName()} won!`,
        `<i class="bi bi-emoji-frown me-3"></i>` +
          `${player2.getPlayerName()} won!`,
        '<i class="bi bi-people me-3"></i>' + "Draw!"
      );
    };

    return {
      isOver,
      getState,
      endRound,
      generateMessage,
    };
  })();

  const game = (function () {
    let message;

    const isOver = () => Math.max(...score.get()) === 5;

    const endGame = () => {
      DOMElements.newRoundBtn.disable();
      setTimeout(message.show, 0);
    };

    const generateMessage = () => {
      message = createMessage(
        `Game is over! ${player1.getPlayerName()} won!`,
        `Game is over! ${player2.getPlayerName()} won!`,
        "Game is over! Draw!"
      );
    };

    return { isOver, endGame, generateMessage };
  })();

  const score = (function () {
    let player1Score = 0,
      player2Score = 0;

    const get = () => [player1Score, player2Score];

    const reset = () => (player1Score = player2Score = 0);

    const update = () => {
      const roundResult = round.getState();

      if (roundResult === "player1") {
        player1Score++;
      }
      if (roundResult === "player2") {
        player2Score++;
      }

      DOMElements.scorePanel.setPlayersScore(...get());
    };

    return {
      get,
      reset,
      update,
    };
  })();

  const playRound = (function () {
    const isLegitPlayerTurn = (player, row, col) => {
      player.turn.setCoords(row, col);
      return player.turn.isLegitTurn();
    };

    const playPlayerTurn = (player, row, col) => {
      player.turn.playTurn();
      DOMElements.DOMGameboard.render();
    };

    const playRobotTurn = () => {
      player2.turn.generateRandomTurn();
      player2.turn.playTurn();
      DOMElements.DOMGameboard.render();
    };

    const isPlayerTurnFirst = (player) => {
      return player.getPlayerMark() === "x";
    };

    const play = (row, col) => {
      if (round.isOver() || game.isOver()) return;

      if (!isLegitPlayerTurn(player1, row, col)) return;
      playPlayerTurn(player1, row, col);

      if (round.isOver()) {
        round.endRound();
        if (game.isOver()) {
          game.endGame();
        }
        return;
      }

      playRobotTurn();

      if (round.isOver()) {
        round.endRound();
        if (game.isOver()) {
          game.endGame();
        }
        return;
      }
    };

    return {
      isPlayerTurnFirst,
      playRobotTurn,
      play,
    };
  })();

  return {
    round,
    game,
    score,
    playRound,
  };
})();

const DOMElements = (function () {
  const startGameBtn = (function () {
    const btn = document.querySelector("#start-game");

    const toggleHiddenStateStartGameForm = () => {
      if (startGameForm.isHidden()) {
        startGameForm.show();
        newRoundBtn.hide();
        scorePanel.hide();
        DOMGameboard.hide();
        alertBox.hideAlert();
      } else {
        startGameForm.hide();
      }
    };

    btn.addEventListener("click", toggleHiddenStateStartGameForm);
  })();

  const startGameForm = (function () {
    const form = document.querySelector("#start-game-form");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const playerData = form.elements;

      player1 = createPlayer(playerData.nickname.value, "x");
      player2 = createPlayer("Robot", "o");

      if (playerData.markO.checked) {
        player1.setPlayerMark("o");
        player2.setPlayerMark("x");
      }

      startGameForm.hide();

      newRoundBtn.restartRound();
      newRoundBtn.enable();
      newRoundBtn.show();

      game.score.reset();
      scorePanel.setPlayersName();
      scorePanel.setPlayersScore(...game.score.get());
      scorePanel.show();

      DOMGameboard.show();

      game.round.generateMessage();
      game.game.generateMessage();
    });

    const isHidden = () => form.parentElement.hidden;

    const show = () => {
      form.parentElement.hidden = false;
    };

    const hide = () => {
      form.parentElement.hidden = true;
    };

    return {
      isHidden,
      show,
      hide,
    };
  })();

  const newRoundBtn = (function () {
    const btn = document.querySelector("#new-round");

    const restartRound = () => {
      gameboard.reset();
      DOMGameboard.render();
      alertBox.hideAlert();

      if (!game.playRound.isPlayerTurnFirst(player1)) {
        game.playRound.playRobotTurn();
      }
    };

    btn.addEventListener("click", restartRound);

    const enable = () => {
      btn.classList.remove("disabled");
    };

    const disable = () => {
      btn.classList.add("disabled");
    };

    const show = () => {
      btn.parentElement.hidden = false;
    };

    const hide = () => {
      btn.parentElement.hidden = true;
    };

    return {
      restartRound,
      enable,
      disable,
      show,
      hide,
    };
  })();

  const scorePanel = (function () {
    const panel = document.querySelector("#score-panel");

    const setPlayersName = () => {
      panel.querySelector("#player1-nickname").innerHTML =
        player1.getPlayerName();
      panel.querySelector("#player2-nickname").innerHTML =
        player2.getPlayerName();
    };

    const setPlayersScore = (player1Score, player2Score) => {
      panel.querySelector("#player1-score").innerHTML = player1Score;
      panel.querySelector("#player2-score").innerHTML = player2Score;
    };

    const show = () => {
      panel.hidden = false;
    };

    const hide = () => {
      panel.hidden = true;
    };

    return {
      setPlayersName,
      setPlayersScore,
      show,
      hide,
    };
  })();

  const DOMGameboard = (function () {
    const board = document.querySelector("#gameboard");

    const get = () => board;

    const getRows = () => {
      const cells = board.querySelectorAll(".col>span");

      const columnsPerRow = 3;

      return Array.from(cells).reduce((rows, cell, index) => {
        // ~~ === Math.floor()
        const rowIndex = ~~(index / columnsPerRow);

        if (!rows[rowIndex]) {
          rows[rowIndex] = [];
        }

        rows[rowIndex].push(cell);

        return rows;
      }, []);
    };

    const render = () => {
      const rows = getRows();

      rows.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (gameboard.get()[rowIndex][colIndex] === "0") {
            col.innerHTML = "0";
            col.classList.add("invisible");
          } else {
            col.innerHTML = gameboard.get()[rowIndex][colIndex];
            col.classList.remove("invisible");
          }
        });
      });
    };

    const show = () => {
      board.parentElement.hidden = false;
    };

    const hide = () => {
      board.parentElement.hidden = true;
    };

    return {
      get,
      render,
      show,
      hide,
    };
  })();

  const alertBox = (function () {
    const div = document.querySelector(".alert-box");

    const createAlert = (text, type) => {
      return `
      <div class="alert alert-${type} dismissible fade show">
        <button type="button" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>
        ${text}
      </div>
      `;
    };

    const showAlert = (alert) => {
      div.insertAdjacentHTML("afterbegin", alert);
    };

    const hideAlert = () => {
      div.innerHTML = "";
    };

    return {
      createAlert,
      showAlert,
      hideAlert,
    };
  })();

  const activateGameboard = () => {
    DOMGameboard.render();

    DOMGameboard.get().addEventListener("click", (e) => {
      const cell = e.target.closest(".col");

      if (!cell) return;

      game.playRound.play(cell.dataset.row - 1, cell.dataset.col - 1);
    });
  };

  activateGameboard();
  startGameForm.hide();
  newRoundBtn.hide();
  scorePanel.hide();
  DOMGameboard.hide();

  return {
    newRoundBtn,
    scorePanel,
    DOMGameboard,
    alertBox,
  };
})();
