// module: holds the game board and its functions
const board = (() => {
  // private
  // let board = [["x","x","o"],["","o","x"],["x","o",""]];
  let board = [["","",""],["","",""],["","",""]];
  const isOpen = (row, col) => {
    return board[row][col] == "" ? true : false;
  }
  // public
  const setCell = (char, row, col) => {
    if (isOpen(row,col)) {
      board[row][col] = char;
      return `${row}${col}`;
    } else {
      return -1;
    }
  }
  const getBoard = () => {
    return board;
  }
  const clearBoard = () => {
    board = [["","",""],["","",""],["","",""]];
    return board;
  }
  const hasWin = () => {
    const rowWin = () => {
      for (let i=0; i<=2; i++) {
        if (board[i][0] != "") {
          if (board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
            return `${i}${board[i][0]}`;
          }
        }
      }
      return null;
    }
    const colWin = () => {
      for (let i=0; i<=2; i++) {
        if (board[0][i] != "") {
          if (board[0][i] == board[1][i] && board[0][i] == board[2][i]) {
            return `${i}${board[0][i]}`;
          }
        }
      }
      return null;
    }
    const diagWin = () => {
      let diagWins = "";
      if (board[1][1] != "") {
        if (board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
          diagWins += "down";
        }
        if (board[2][0] == board[1][1] && board[2][0] == board[0][2]) {
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
 
  return {setCell, getBoard, hasWin, clearBoard};
}
)();



// module: displays the game
const display = (() => {
  const gameInfo = document.querySelector('.game-info');
  const boardContainer = document.querySelector('.board-container');
  const current = document.createElement('div');
  const initialize = (currentPlayer) => {
    update(currentPlayer);
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
        cell.addEventListener('click', function(e) {
          if (!game.isOver()) {
            game.play(e.target.getAttribute('data-id'));
          }
        });
        colNum ++;
      })
      rowNum ++;
    });
  }
  const update = (currentPlayer, row, col) => {
    current.innerText = `Current player: ${currentPlayer.char.toUpperCase()}`;
    gameInfo.appendChild(current);
    if (row != undefined) {
      const cells = document.querySelectorAll('.cell');
      // update the provided cell
      cells.forEach(cell => {
        if (cell.getAttribute('data-id') == `${row}${col}`) {
          console.log(cell);
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
      current.innerText = `${winner.getName()} won!`
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
        console.log(winState.diagWin);
        if (winState.diagWin.includes('up')) {
          const up1 = document.querySelector("[data-id='20']");
          up1.classList.add('cell-won');
          const up2 = document.querySelector("[data-id='11']");
          up2.classList.add('cell-won');
          const up3 = document.querySelector("[data-id='02']");
          up3.classList.add('cell-won');
        }
        if (winState.diagWin.includes('down')) {
          const down1 = document.querySelector("[data-id='00']");
          down1.classList.add('cell-won');
          const down2 = document.querySelector("[data-id='11']");
          down2.classList.add('cell-won');
          const down3 = document.querySelector("[data-id='22']");
          down3.classList.add('cell-won');
        }
      }
    } else {
      current.innerText = "It's a tie!";
    }
  }
  return {initialize, update, finish};
})();

// factory: manages the game
const Game = () => {
  const p1 = Player('x');
  const p2 = Player('o');
  let turn = 0;
  let over = false;
  let currentPlayer;
  Math.floor(Math.random()*2) == 0 ? currentPlayer = p1 : currentPlayer = p2;
  display.initialize(currentPlayer);
  const play = (cellRef) => {
    const row = cellRef[0];
    const col = cellRef[1];
    if (board.setCell(currentPlayer.char, row, col) != -1) advanceTurn(row, col);
    // console.log(cellRef);
  }
  const advanceTurn = (row, col) => {
    turn ++;
    display.update(currentPlayer, row, col);
    if (board.hasWin().any() == null) {
      if (turn < 9) {
        if (currentPlayer == p1) currentPlayer = p2;
        else if (currentPlayer == p2) currentPlayer = p1;
      } else {
        over = true;
        display.finish(null, null);
      }
    } else {
      over = true;
      display.finish(currentPlayer, board.hasWin());
    }
  }
  const isOver = () => {
    return over;
  }
  return {play, isOver, currentPlayer, p1, p2};
}

// factory: holds player information
const Player = (myChar) => {
  let char = myChar;
  let myName = char.toUpperCase() + ' player';
  const getName = () => {
    return myName;
  }
  const rename = (nameInput) => {
    myName = nameInput;
  }
  return {char, getName, rename};
}

const game = Game();