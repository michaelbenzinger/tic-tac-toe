const board = (() => {
  let gameBoard = [["","",""],["","",""],["","",""]];
  const isOpen = (row, col) => {
    return gameBoard[row][col] == "" ? true : false;
  }
  const setCell = (char, row, col) => {
    if (isOpen(row,col)) {
      gameBoard[row][col] = char;
      return `${row}${col}`;
    } else {
      return -1;
    }
  }
  const getBoard = () => {
    return gameBoard;
  }
  const clearBoard = () => {
    gameBoard = [["","",""],["","",""],["","",""]];
    return gameBoard;
  }
  const hasWin = () => {
    const rowWin = () => {
      for (let i=0; i<=2; i++) {
        if (gameBoard[i][0] != "") {
          if (gameBoard[i][0] == gameBoard[i][1] && gameBoard[i][0] == gameBoard[i][2]) {
            return `${i}${gameBoard[i][0]}`;
          }
        }
      }
      return null;
    }
    const colWin = () => {
      for (let i=0; i<=2; i++) {
        if (gameBoard[0][i] != "") {
          if (gameBoard[0][i] == gameBoard[1][i] && gameBoard[0][i] == gameBoard[2][i]) {
            return `${i}${gameBoard[0][i]}`;
          }
        }
      }
      return null;
    }
    const diagWin = () => {
      let diagWins = "";
      if (gameBoard[1][1] != "") {
        if (gameBoard[0][0] == gameBoard[1][1] && gameBoard[0][0] == gameBoard[2][2]) {
          diagWins += "down";
        }
        if (gameBoard[2][0] == gameBoard[1][1] && gameBoard[2][0] == gameBoard[0][2]) {
          diagWins += "up";
        }
      }
      if (diagWins == "") return null;
      else return diagWins;
    }
    let winsObject = {
      'rowWin': rowWin(),
      'colWin': colWin(),
      'diagWin': diagWin(),
      'any': () => {
        if ((winsObject.rowWin == null && winsObject.colWin == null) && winsObject.diagWin == null) {
          return null;
        } else {
          return winsObject;
        }
      }
    }
    return winsObject;
  }
  const isFull = () => {
    // console.table(gameBoard);
    for (let i=0; i<=2; i++) {
      for (let j=0; j<=2; j++) {
        if (gameBoard[i][j] == "") return false;
      }
    }
    return true;
  }
 
  return {setCell, getBoard, hasWin, isFull, clearBoard};
}
)();

const display = (() => {
  const gameInfo = document.querySelector('.game-info');
  const boardContainer = document.querySelector('.board-container');
  const instructions = document.createElement('div');
  const p1Input = document.querySelector('#p1');
  const p2Input = document.querySelector('#p2');
  instructions.classList.add('instructions');
  const initialize = () => {
    p1Input.disabled = true;
    p2Input.disabled = true;

    gameInfo.appendChild(instructions);
    instructions.innerText = 'Press start to play.';

    const start = document.querySelector('.start');
    let game1;
    start.addEventListener('click', () => {
      start.innerText = 'Restart';
      start.classList.add('restart');
      game1 = Game();
    });

    let array = board.getBoard();
    let rowNum = 0;
    array.forEach(row => {
      let colNum = 0;
      row.forEach(col => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-id', `${rowNum}${colNum}`);
        cell.setAttribute('data-row', `${rowNum}`);
        cell.setAttribute('data-col', `${colNum}`);
        const cellText = document.createElement('div');
        cellText.setAttribute('data-id', `${rowNum}${colNum}`);
        cellText.setAttribute('data-row', `${rowNum}`);
        cellText.setAttribute('data-col', `${colNum}`);
        cellText.classList.add('cell-text');
        if (col == 'x') cellText.classList.add('cell-text', 'fas', 'fa-times');
        if (col == 'o') cellText.classList.add('cell-text', 'fas', 'fa-circle');
        cell.appendChild(cellText);
        boardContainer.appendChild(cell);
        colNum ++;
      })
      rowNum ++;
    });

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.classList.add('cell-disabled');
    });
  }
  const startGame = (p1, p2, currentPlayer) => {
    p1Input.value = '';
    p2Input.value = '';
    p1Input.disabled = false;
    p2Input.disabled = false;
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.classList.remove('cell-disabled');
    });

    refreshNames(p1, p2, currentPlayer);
  }
  const refreshNames = (p1, p2, currentPlayer) => {
    p1Input.setAttribute('placeholder', p1.getName());
    p2Input.setAttribute('placeholder', p2.getName());
    instructions.innerText = `Current player: ${currentPlayer.getName()} (${currentPlayer.char.toUpperCase()})`;
  }
  const update = (currentPlayer, row, col) => {
    const cells = document.querySelectorAll('.cell');
    instructions.innerText = `Current player: ${currentPlayer.getName()} (${currentPlayer.char.toUpperCase()})`;
    if (row != undefined) {
      cells.forEach(cell => {
        if (cell.getAttribute('data-id') == `${row}${col}`) {
          const cellValue = board.getBoard()[row][col];
          const cellText = cell.childNodes[0];
          if (cellValue == 'x') cellText.classList.add('fas', 'fa-times');
          if (cellValue == 'o') cellText.classList.add('fas', 'fa-circle');
        }
      });
    }
  }
  const finish = (winner, winState) => {
    if (winner != null) {
      instructions.innerText = `${winner.getName()} won!`
      const cells = document.querySelectorAll('.cell');
      if (winState.rowWin != null) {
        cells.forEach(cell => {
          if (cell.getAttribute('data-row') == winState.rowWin[0]) {
            cell.childNodes[0].classList.add('cell-won');
          }
        })
      }
      if (winState.colWin != null) {
        cells.forEach(cell => {
          if (cell.getAttribute('data-col') == winState.colWin[0]) {
            cell.childNodes[0].classList.add('cell-won');
          }
        })
      }
      if (winState.diagWin != null) {
        if (winState.diagWin.includes('up')) {
          const up1 = document.querySelector("[data-id='20']");
          up1.childNodes[0].classList.add('cell-won');
          const up2 = document.querySelector("[data-id='11']");
          up2.childNodes[0].classList.add('cell-won');
          const up3 = document.querySelector("[data-id='02']");
          up3.childNodes[0].classList.add('cell-won');
        }
        if (winState.diagWin.includes('down')) {
          const down1 = document.querySelector("[data-id='00']");
          down1.childNodes[0].classList.add('cell-won');
          const down2 = document.querySelector("[data-id='11']");
          down2.childNodes[0].classList.add('cell-won');
          const down3 = document.querySelector("[data-id='22']");
          down3.childNodes[0].classList.add('cell-won');
        }
      }
    } else {
      instructions.innerText = "It's a tie!";
    }
    const start = document.querySelector('.start');
    start.innerText = 'Start';
    start.classList.remove('restart');
  }
  const clearDisplay = () => {
    const cellTexts = document.querySelectorAll('.cell-text');
    cellTexts.forEach(cellText => {
      cellText.classList.remove('fas', 'fa-times', 'fa-circle', 'cell-won');
    });
  }
  return {initialize, startGame, update, refreshNames, finish, clearDisplay};
})();

const Game = () => {
  board.clearBoard();
  display.clearDisplay();
  const p1 = Player('x');
  const p2 = Player('o');
  let over = false;
  let currentPlayer;
  Math.floor(Math.random()*2) == 0 ? currentPlayer = p1 : currentPlayer = p2;

  const p1Input = document.querySelector('#p1');
  const p2Input = document.querySelector('#p2');

  p1Input.addEventListener('focusout', function(e) {
    if (e.target.value != "") {
      p1.rename(e.target.value);
      display.refreshNames(p1,p2,currentPlayer);
    }
  });
  p2Input.addEventListener('focusout', function(e) {
    if (e.target.value != "") {
      p2.rename(e.target.value);
      display.refreshNames(p1,p2,currentPlayer);
    }
  });

  display.startGame(p1, p2, currentPlayer);

  const addEvents = (() => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.addEventListener('click', function(e) {
        if (!isOver()) {
          play(e.target.getAttribute('data-id'));
        }
      });
    });
  })();
  const play = (cellRef) => {
    const row = cellRef[0];
    const col = cellRef[1];
    if (board.setCell(currentPlayer.char, row, col) != -1) advanceTurn(row, col);
  }
  const advanceTurn = (row, col) => {
    if (board.hasWin().any() == null) {
      if (!board.isFull()) {
        if (currentPlayer == p1) {
          currentPlayer = p2;
        } else if (currentPlayer == p2) {
          currentPlayer = p1;
        }
        display.update(currentPlayer, row, col);
      } else {
        over = true;
        display.update(currentPlayer, row, col);
        display.finish(null, null);
      }
    } else {
      over = true;
      display.update(currentPlayer, row, col);
      display.finish(currentPlayer, board.hasWin());
    }
  }
  const isOver = () => {
    return over;
  }
  return {play, isOver, currentPlayer, p1, p2};
}

const Player = (myChar) => {
  let char = myChar;
  let myName = char.toUpperCase() + ' Player';
  const getName = () => {
    return myName;
  }
  const rename = (nameInput) => {
    myName = nameInput;
  }
  return {char, getName, rename};
}

display.initialize();