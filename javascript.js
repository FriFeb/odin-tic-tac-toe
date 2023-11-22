const gameboard = (function () {
  const gameboard = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  const getGameboard = () => gameboard;

  const isEmptyCell = (rowIndex, columnIndex) =>
    gameboard[rowIndex][columnIndex] === " ";

  const isEmptyCellLeft = () => {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        if (isEmptyCell(i, j)) return true;
      }
    }
    return false;
  };

  const setSign = (rowIndex, columnIndex, playerSign) => {
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

  return {
    getGameboard,
    isEmptyCell,
    isEmptyCellLeft,
    setSign,
    isWinner,
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

    gameboard.setSign(hor, ver, this.getPlayerSign());
  }

  function playRobotTurn() {
    let hor = Math.floor(Math.random() * 3);
    let ver = Math.floor(Math.random() * 3);

    while (!gameboard.isEmptyCell(hor, ver)) {
      hor = Math.floor(Math.random() * 3);
      ver = Math.floor(Math.random() * 3);
    }

    gameboard.setSign(hor, ver, this.getPlayerSign());
  }

  const getFullGameboardMessage = () => "Draw! The game is over!";

  const getPlayerWinnerMessage = (playerName) => `Victory! ${playerName} won!`;

  const getPlayerLoserMessage = (playerName) => `Defeat! ${playerName} won!`;

  const isGameEnd = () => {
    if (!gameboard.isEmptyCellLeft()) {
      console.log(getFullGameboardMessage());
      return true;
    }

    if (gameboard.isWinner(player1.getPlayerSign())) {
      console.log(getPlayerWinnerMessage(player1.getPlayerName()));
      return true;
    }

    if (gameboard.isWinner(player2.getPlayerSign())) {
      console.log(getPlayerLoserMessage(player2.getPlayerName()));
      return true;
    }

    return false;
  };

  const playGame = () => {
    while (true) {
      playTurn.call(player1);
      if (isGameEnd()) break;

      playRobotTurn.call(player2);
      if (isGameEnd()) break;
    }

    console.log(gameboard.getGameboard());
  };

  return { playGame };
})();

// const controllPanel = (function () { }}();

game.playGame();