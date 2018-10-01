class Puzzle {
  constructor() {
    this.dimension = 3;
    this.board = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 0 ] ];
    this.path = [];
    this.lastMove = null;
  }

  getBlankPosition() {
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        if (this.board[i][j] === 0) {
          return [i, j];
        }
      }
    }
  }

  swap(i1, j1, i2, j2) {
    let temp = this.board[i1][j1];
    this.board[i1][j1] = this.board[i2][j2];
    this.board[i2][j2] = temp;
  }

  getMove(grid) {
    let blankGrid = this.getBlankPosition();
    let row = blankGrid[0];
    let column = blankGrid[1];
    if (row > 0 && this.board[row - 1][column] == grid) {
      return "down";
    } else if (row < this.dimension - 1 && this.board[row + 1][column] == grid) {
      return "up";
    } else if (column > 0 && this.board[row][column - 1] == grid) {
      return "right";
    } else if (column < this.dimension - 1 && this.board[row][column + 1] == grid) {
      return "left";
    }
  }

  move(grid) {
    let move = this.getMove(grid);
    if (move != null) {
      var blankGrid = this.getBlankPosition();
      var row = blankGrid[0];
      var column = blankGrid[1];
      switch (move) {
        case "down":
          this.swap(row, column, row - 1, column);
          break;
        case "up":
          this.swap(row, column, row + 1, column);
          break;
        case "right":
          this.swap(row, column, row, column - 1);
          break;
        case "left":
          this.swap(row, column, row, column + 1);
          break;
      }
      if (move != null) {
          this.lastMove = grid;
      }
      return move;
    }
  }

  shuffle() {
    let i = 0;
    while(i < 20) {
      let allowed = this.getAllowedMoves();
      let moveGrid = allowed[Math.floor(Math.random() * allowed.length)];
      while (moveGrid === this.lastMove) {
        moveGrid = allowed[Math.floor(Math.random() * allowed.length)];
      }
      this.move(moveGrid);
      i++;
    }
    this.lastMove = null;
    return 0;
  }

  isDone() {
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        var grid = this.board[i][j];
        if (grid != 0) {
          let original = [Math.floor((grid - 1) / this.dimension), (grid - 1) % this.dimension];
          let doneRow = Math.floor((grid - 1) / this.dimension);
          let doneCol = (grid - 1) % this.dimension;
          if (doneRow != i || doneCol != j) {
            return false;
          }
        }
      }
    }
    return true;
  }

  getAllowedMoves() {
    let allow = [];
    for (var i = 0; i < this.dimension; i++) {
      for (var j =0; j < this.dimension; j++) {
        let grid = this.board[i][j];
        if (this.getMove(grid) != null) {
          allow.push(grid);
        }
      }
    }
    return allow;
  }

  getCopy() {
    let newPuzzle = new Puzzle(this.dimension)
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        newPuzzle.board[i][j] = this.board[i][j];
      }
    }
    for (var i = 0; i < this.path.length; i++) {
      newPuzzle.path.push(this.path[i]);
    }
    return newPuzzle;
  }

  visit() {
    let children = [];
    let allowed = this.getAllowedMoves();
    for (var i = 0; i < allowed.length; i++) {
      let move = allowed[i];
      if (move != this.lastMove) {
        let newPuzzle = this.getCopy();
        newPuzzle.move(move);
        newPuzzle.path.push(move);
        children.push(newPuzzle);
      }
    }
    return children;
  }

  bfs() {
    // debugger
    // console.log("bfs");
    let initState = this.getCopy();
    initState.path = [];
    let states = [initState];
    while (states.length > 0) {
      let state = states[0];
      states.shift();
      if (state.isDone()) {
        return state.path;
      }
      states = states.concat(state.visit());
    }
  }



}

class Draw {
  constructor(n, puzzle) {
    this.size = n;
    this.canvas = document.getElementById('animation');
    this.puzzle = puzzle;
    this.ctx = this.canvas.getContext('2d');
    this.canvasSize = this.canvas.width;
    this.gridLength = Math.floor(this.canvasSize / n);
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
  }

  position(i) {
    let gridPosition = (i - 1) * this.gridLength;
    return gridPosition;
  }

  drawGrids() {
    for(var i = 1; i < this.size + 1; i++) {
      for (var j = 1; j < this.size + 1; j++) {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.position(j), this.position(i), this.gridLength, this.gridLength);
        if (this.puzzle.board[i - 1][j - 1] != 0) {
          this.ctx.font="20px Georgia";
          this.ctx.fillStyle = "white";
          this.ctx.fillText(this.puzzle.board[i - 1][j -1], this.position(j)+50, this.position(i)+50);
        } else {
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(this.position(j), this.position(i), this.gridLength, this.gridLength);
        }
      }
    }
  }

}

let puzzle = new Puzzle();

function simulate() {
  let size = 3;
  let drawP = new Draw(size, puzzle);
  let interval;
  puzzle.move(8);
  drawP.drawGrids(size, puzzle);
  let i = 0;

  function shuffle() {
    let allowed = puzzle.getAllowedMoves();
    let moveGrid = allowed[random(allowed.length)];
    while (moveGrid === puzzle.lastMove) {
      moveGrid = allowed[random(allowed.length)];
    }
    puzzle.move(moveGrid);
    drawP.drawGrids(size, puzzle);
    i++;
    if(i > 30) {
      clearInterval(interval);
    }
  }

  function random(length) {
    return Math.floor(Math.random() * length);
  }

  interval = setInterval(shuffle, 100);
}

function simulateBFS() {
  console.log(puzzle.board);
}

// let game = new Puzzle;
// console.log(game.board);
// console.log(game.isDone());
// console.log(game.bfs());
// game.shuffle();
// console.log(game.board);
// console.log(game.isDone());
// game.shuffle();
// console.log(game.board);
// console.log(game.isDone());
// console.log(game.visit());
// console.log(game.getCopy());
// console.log(game.bfs());
