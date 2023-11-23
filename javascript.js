const gameboard = (function () {
  const gameboard = [
    ["0", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"],
  ];

  const getGameboard = () => gameboard;

  const isEmptyCell = (rowIndex, columnIndex) =>
    gameboard[rowIndex][columnIndex] === "0";

  const isEmptyCellLeft = () => {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        if (isEmptyCell(i, j)) return true;
      }
    }
    return false;
  };

  const setCellSign = (rowIndex, columnIndex, playerSign) => {
    gameboard[rowIndex][columnIndex] = playerSign;
  };

  const isWinner = (playerSign) => {
    for (let i = 0; i < gameboard.length; i++) {
      // check row
      if (
        gameboard[i][0] === playerSign &&
        gameboard[i][1] === playerSign &&
        gameboard[i][2] === playerSign
      ) {
        return true;
      }

      // check column
      if (
        gameboard[0][i] === playerSign &&
        gameboard[1][i] === playerSign &&
        gameboard[2][i] === playerSign
      ) {
        return true;
      }
    }

    if (
      // Check diagonal 1
      gameboard[0][0] === playerSign &&
      gameboard[1][1] === playerSign &&
      gameboard[2][2] === playerSign
    ) {
      return true;
    }

    if (
      // Check diagonal 2
      gameboard[0][2] === playerSign &&
      gameboard[1][1] === playerSign &&
      gameboard[2][0] === playerSign
    ) {
      return true;
    }

    return false;
  };

  const getDOMGameboard = () => {
    const cells = document.querySelectorAll(".col");

    const columnsPerRow = 3;

    const rows = Array.from(cells).reduce((rows, cell, index) => {
      // ~~ = Math.floor()
      const rowIndex = ~~(index / columnsPerRow);

      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }

      rows[rowIndex].push(cell);

      return rows;
    }, []);

    return rows;
  };

  const setDOMGameboard = () => {
    const rows = getDOMGameboard();

    rows.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (gameboard[rowIndex][colIndex] === "0") {
          col.innerHTML = "0";
          col.classList.add("opacity-0");
        } else {
          col.innerHTML = gameboard[rowIndex][colIndex];
          col.classList.remove("opacity-0");
        }
      });
    });
  };

  return {
    getGameboard,
    isEmptyCell,
    isEmptyCellLeft,
    setCellSign,
    isWinner,
    setDOMGameboard,
  };
})();

function createPlayer(name, sign) {
  const getPlayerName = () => name;
  const getPlayerSign = () => sign;

  return { name, getPlayerName, getPlayerSign };
}

const player1 = createPlayer("Me", "x");
const player2 = createPlayer("Robot", "o");

const game = (function () {
  player1Score = 0;
  player2Score = 0;

  function playTurn() {
    let hor, ver;
    hor = prompt(`${this.getPlayerName()} Enter row`, "") - 1;
    ver = prompt(`${this.getPlayerName()} Enter column`, "") - 1;

    while (!gameboard.isEmptyCell(hor, ver)) {
      hor =
        prompt(
          `Error! Cell is not empty! ${this.getPlayerName()} Enter new row`,
          ""
        ) - 1;
      ver =
        prompt(
          `Error! Cell is not empty! ${this.getPlayerName()} Enter new column`,
          ""
        ) - 1;
    }

    gameboard.setCellSign(hor, ver, this.getPlayerSign());
  }

  function playRobotTurn() {
    let hor = Math.floor(Math.random() * 3);
    let ver = Math.floor(Math.random() * 3);

    while (!gameboard.isEmptyCell(hor, ver)) {
      hor = Math.floor(Math.random() * 3);
      ver = Math.floor(Math.random() * 3);
    }

    gameboard.setCellSign(hor, ver, this.getPlayerSign());
  }

  const getFullGameboardMessage = () => "Draw! The game is over!";

  const getPlayerWinnerMessage = (playerName) => `Victory! ${playerName} won!`;

  const getPlayerLoserMessage = (playerName) => `Defeat! ${playerName} won!`;

  const isGameEnd = () => {
    if (!gameboard.isEmptyCellLeft()) {
      alert(getFullGameboardMessage());
      return true;
    }

    if (gameboard.isWinner(player1.getPlayerSign())) {
      alert(getPlayerWinnerMessage(player1.getPlayerName()));
      return true;
    }

    if (gameboard.isWinner(player2.getPlayerSign())) {
      alert(getPlayerLoserMessage(player2.getPlayerName()));
      return true;
    }

    return false;
  };

  const playGame = () => {
    while (true) {
      playTurn.call(player1);
      gameboard.setDOMGameboard();
      if (isGameEnd()) break;

      playRobotTurn.call(player2);
      gameboard.setDOMGameboard();
      if (isGameEnd()) break;
    }
  };

  return { playGame };
})();

// const controllPanel = (function () { }}();

game.playGame();
