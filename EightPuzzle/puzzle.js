class MinHeap {
  constructor(array, comparator) {
    this.heap = array || new Array();
    this.compare = comparator || function(item1, item2) {
      return item1 == item2 ? 0 : item1 < item2 ? -1 : 1;
    };
    this.left = function(i) {
      return 2 * i + 1;
    };
    this.right = function(i) {
      return 2 * i + 2;
    };
    this.parent = function(i) {
      return Math.ceil(i / 2) - 1;
    };
    this.heapify = function(i) {
		var lIdx = this.left(i);
 		var rIdx = this.right(i);
  		var smallest;
  		if (lIdx < this.heap.length
  				&& this.compare(this.heap[lIdx], this.heap[i]) < 0) {
  			smallest = lIdx;
  		} else {
  			smallest = i;
  		}
  		if (rIdx < this.heap.length
  				&& this.compare(this.heap[rIdx], this.heap[smallest]) < 0) {
  			smallest = rIdx;
  		}
  		if (i != smallest) {
  			var temp = this.heap[smallest];
  			this.heap[smallest] = this.heap[i];
  			this.heap[i] = temp;
  			this.heapify(smallest);
  		}
  	};

    this.siftUp = function(i) {
 		var p = this.parent(i);
 		if (p >= 0 && this.compare(this.heap[p], this.heap[i]) > 0) {
 			var temp = this.heap[p];
 		  this.heap[p] = this.heap[i];
 			this.heap[i] = temp;
 			this.siftUp(p);
   		}
   	};

    this.heapifyArray = function() {
 		var i = Math.floor(this.heap.length / 2) - 1;
 		for (; i >= 0; i--) {
 			this.heapify(i);
   		}
   	};
    if (array != null) {
      this.heapifyArray();
    }
  }

  push(item) {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  insert(item) {
    this.push(item);
  }

  pop() {
    var value;
    if (this.heap.length > 1) {
      value = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapify(0);
    } else {
      value = this.heap.pop();
    }
    return value;
  }

  remove() {
    return this.pop();
  }

  getMin() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}



class Puzzle {
  constructor(n) {
    this.dimension = n;
    this.board = [];
    if (n === 3) {
      this.board = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 0 ] ];
    }
    if (n === 4) {
      this.board = [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ], [ 13, 14, 15, 0 ] ];
    }
    if (n === 5) {
      this.board = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 0]
      ]
    }
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

  dfs() {
    //later
  }

  g() {
    return this.path.length;
  }

  h1() {
    let count = 0;
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
          let piece = this.board[i][j];
          if (piece != 0) {
              let originalLine = Math.floor((piece - 1) / this.dimension);
              let originalColumn = (piece - 1) % this.dimension;
              if (i != originalLine || j != originalColumn) count++;
            }
        }
    }
    return count;
  }

  h2() {
    let distance = 0;
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        let piece = this.board[i][j];
        if (piece != 0) {
            let originalLine = Math.floor((piece - 1) / this.dimension);
            let originalColumn = (piece - 1) % this.dimension;
            distance += Math.abs(i - originalLine) + Math.abs(j - originalColumn);
        }
      }
    }
    return distance;
  }

  aStar() {
    let states = new MinHeap(null, function(a, b) {
      return a.distance - b.distance;
    });
    this.path = [];
    states.push({
      puzzle: this,
      distance: 0
    });
    while (states.size() > 0) {
      let state = states.pop().puzzle;
      if (state.isDone()) {
        return state.path;
      }
      let children = state.visit();
      for (var i = 0; i < children.length; i++) {
        let child = children[i];
        let f = child.g() + child.h2();
        states.push({
          puzzle: child,
          distance: f
        });
      }
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
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);``
  }

  position(i) {
    let gridPosition = (i - 1) * this.gridLength;
    return gridPosition;
  }

  drawGrids() {
    this.ctx.clearRect(0, 0, 600, 600);
    for(var i = 1; i < this.size + 1; i++) {
      for (var j = 1; j < this.size + 1; j++) {
        this.ctx.fillStyle = "lightblue";
        this.ctx.fillRect(this.position(j), this.position(i), this.gridLength, this.gridLength);
        this.ctx.strokeStyle="darkblue";
        this.ctx.strokeRect(this.position(j), this.position(i), this.gridLength, this.gridLength);
        if (this.puzzle.board[i - 1][j - 1] != 0) {
          this.ctx.font=font;
          this.ctx.fillStyle = "black";
          this.ctx.fillText(this.puzzle.board[i - 1][j -1], this.position(j)+skew, this.position(i)+topskew);
        } else {
          this.ctx.fillStyle = "lightgrey";
          this.ctx.fillRect(this.position(j), this.position(i), this.gridLength, this.gridLength);
        }
      }
    }
  }

}

// let shuffleTimes = 12;
// let three = false;
// let four = true;
// // debugger
//
// let dimension;
// let font;
// let skew;
// if (three) {
//   dimension = 3;
//   font = "30px Georgia";
//   skew = 50;
// }
// if (four) {
//   dimension = 4;
//   font = "20px Georgia";
//   skew = 34;
// }
// var canvas = document.getElementById("animation");
document.addEventListener('DOMContentLoaded', () => {
  var canvas = document.getElementById('animation');
  // debugger
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "lightgrey";
  ctx.fillRect(0,0,500,500);

});




let dimension;
let font;
let skew;

let size
let puzzle
let interval;
let shuffleTimes;

function simulate() {
  let three;
  let four;
  let five;
  // debugger
  let gridSize = document.getElementsByName('dimension');
  for (var k = 0; k < gridSize.length; k++) {
    if (gridSize[k].checked) {
      if (gridSize[k].value === "3x3") {
        three = true;
        four = false;
        five = false;
      } else if (gridSize[k].value === "4x4") {
        four = true;
        three = false;
        five = false;
      } else if (gridSize[k].value === "5x5") {
        five = true;
        three = false;
        four = false;
      }
      break;
    }
  }

  shuffleTimes = +document.getElementById("shuffleTimes").value;
  // debugger

  // let dimension;
  // let font;
  // let skew;
  // five = true;
  if (five) {
    dimension = 5;
    font = "30px Georgia";
    skew = 40;
    topskew = 55;
  }
  if (three) {
    dimension = 3;
    font = "60px Georgia";
    skew = 70;
    topskew = 100;
  }
  if (four) {
    dimension = 4;
    font = "45px Georgia";
    skew = 45;
    topskew = 75;
  }

  size = dimension;
  puzzle = new Puzzle(size);


  let drawP = new Draw(size, puzzle);
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
    if(i >= shuffleTimes) {
      clearInterval(interval);
    }
  }

  function random(length) {
    return Math.floor(Math.random() * length);
  }

  interval = setInterval(shuffle, 100);
}

function simulateBFS() {
  let drawP = new Draw(size, puzzle);
  let date1 = new Date();
  let path = puzzle.bfs();
  let date2 = new Date();
  console.log(date2 - date1);
  let runTime = date2 - date1;
  document.getElementById("insert").innerHTML = `Run Time: ${runTime} ms`;
  drawP.drawGrids(size, puzzle);

  function move() {
    let step;
    if (path.length > 0) {
      step = path.shift();
      puzzle.move(step);
      drawP.drawGrids(size, puzzle);
    } else {
      clearInterval(interval);
    }
  }
  interval = setInterval(move, 300);
}

function simulateAStar() {
  let drawP = new Draw(size, puzzle);
  let date1 = new Date();
  let path = puzzle.aStar();
  let date2 = new Date();
  console.log(date2 - date1);
  let runTime = date2 - date1;
  document.getElementById("insert").innerHTML = `Run Time: ${runTime} ms`;
  drawP.drawGrids(size, puzzle);

  function move() {
    let step;
    if (path.length > 0) {
      step = path.shift();
      puzzle.move(step);
      drawP.drawGrids(size, puzzle);
    } else {
      clearInterval(interval);
    }
  }
  interval = setInterval(move, 300);
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
