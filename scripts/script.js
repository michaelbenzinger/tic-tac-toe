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
  return {setCell, getBoard, clearBoard};
})();

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
        const cellText = document.createElement('div');
        cellText.classList.add('cell-text');
        if (col == 'x') cellText.classList.add('cell-text', 'fas', 'fa-times');
        if (col == 'o') cellText.classList.add('cell-text', 'fas', 'fa-circle');
        cell.appendChild(cellText);
        boardContainer.appendChild(cell);
        cell.addEventListener('click', function(e) {
          game.play(e.target.getAttribute('data-id'));
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
  return {initialize, update};
})();

// factory: manages the game
const Game = () => {
  const p1 = Player('x');
  const p2 = Player('o');
  let currentPlayer;
  Math.floor(Math.random()*2) == 0 ? currentPlayer = p1 : currentPlayer = p2;
  display.initialize(currentPlayer);
  const play = (cellRef) => {
    const row = cellRef[0];
    const col = cellRef[1];
    if (board.setCell(currentPlayer.char, row, col) != -1) advanceTurn(row, col);
    console.log(cellRef);
  }
  const advanceTurn = (row, col) => {
    if (currentPlayer == p1) currentPlayer = p2;
    else if (currentPlayer == p2) currentPlayer = p1;
    display.update(currentPlayer, row, col);
  }
  return {play, currentPlayer};
}

// factory: holds player information
const Player = (myChar) => {
  const char = myChar;
  return {char};
}

const game = Game();