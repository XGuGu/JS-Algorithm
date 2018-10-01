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



}
// let game = new Puzzle;
// console.log(game.board);
// console.log(game.isDone());
// console.log(game.move(6));
// console.log(game.board);
// console.log(game.isDone());
// game.move(6);
// console.log(game.board);
// console.log(game.isDone());
