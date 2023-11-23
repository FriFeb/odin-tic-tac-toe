const gameboard = (function () {
  const gameboard = [
    ["0", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"],
  ];

  const getGameboard = () => gameboard;

  const isEmptyCell = (rowIndex, columnIndex) =>
    gameboard[rowIndex][columnIndex] === "0";

  const isFullGameboard = () => {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        if (isEmptyCell(i, j)) return false;
      }
    }
    return true;
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
    isFullGameboard,
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
  const isDraw = gameboard.isFullGameboard;
  const isPlayerWinner = gameboard.isWinner;

  const getDrawMessage = () => "Draw! The game is over!";

  const getPlayerWinnerMessage = (playerName) => `Victory! ${playerName} won!`;

  const getPlayerLoserMessage = (playerName) => `Defeat! ${playerName} won!`;

  const showGameOverMessage = () => {
    if (isPlayerWinner(player1.getPlayerSign())) {
      alert(getPlayerWinnerMessage(player1.getPlayerName()));
      return;
    }
    if (isPlayerWinner(player2.getPlayerSign())) {
      alert(getPlayerLoserMessage(player2.getPlayerName()));
      return;
    }
    if (isDraw()) {
      alert(getDrawMessage());
      return;
    }
  };

  const isGameOver = () => {
    if (
      isDraw() ||
      isPlayerWinner(player1.getPlayerSign()) ||
      isPlayerWinner(player2.getPlayerSign())
    ) {
      return true;
    }
    return false;
  };

  function createTurn() {
    let hor, ver;

    const setHor = (newHor) => (hor = newHor);
    const setVer = (newVer) => (ver = newVer);

    const generateRandomTurn = () => {
      // const generateRandomNumber = () => {
      //   return Math.floor(Math.random() * 3);
      // };

      // hor = generateRandomNumber();
      // ver = generateRandomNumber();

      hor = Math.floor(Math.random() * 3);
      ver = Math.floor(Math.random() * 3);

      if (!isLegitTurn()) generateRandomTurn();
    };

    const isLegitTurn = () => gameboard.isEmptyCell(hor, ver);

    const playTurn = function () {
      gameboard.setCellSign(hor, ver, this.getPlayerSign());
    };

    return {
      setHor,
      setVer,
      generateRandomTurn,
      isLegitTurn,
      playTurn,
    };
  }

  const playerTurn = createTurn();
  const robotTurn = createTurn();

  const playRound = (hor, ver) => {
    if (isGameOver()) return;

    playerTurn.setHor(hor);
    playerTurn.setVer(ver);
    if (!playerTurn.isLegitTurn()) return;

    playerTurn.playTurn.call(player1);
    gameboard.setDOMGameboard();
    if (isGameOver()) {
      setTimeout(showGameOverMessage, 0);
      return;
    }

    robotTurn.generateRandomTurn();
    robotTurn.playTurn.call(player2);
    gameboard.setDOMGameboard();
    if (isGameOver()) {
      setTimeout(showGameOverMessage, 0);
      return;
    }
  };

  return { playRound };
})();

// const controllPanel = (function () { }}();

gameboard.setDOMGameboard();
// game.playRound();

document.querySelector(".container").addEventListener("click", (e) => {
  if (!e.target.classList.contains("col")) return;

  game.playRound(e.target.dataset.row - 1, e.target.dataset.col - 1);
});
