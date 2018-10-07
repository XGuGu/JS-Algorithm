class WeightedQuickUnion {
  constructor(n) {
    this.count = n;
    this.id = [];
    this.sz = [];
    for(var i = 0; i < n; i++) {
      this.id[i] = i;
      this.sz[i] = 1;
    }
  }

  root(i) {
    while(i != this.id[i]) {
      i = this.id[i];
    }

    return i;
  }

  connected(p, q) {
    return this.root(p) === this.root(q);
  }

  union(p, q) {
    if (this.root(p) === this.root(q)) {
      return;
    }

    if (this.sz[this.root(p)] < this.sz[this.root(q)]) {
      this.id[this.root(p)] = this.root(q);
      this.sz[this.root(q)] += this.sz[this.root(p)]
    } else {
      this.id[this.root(q)] = this.root(p);
      this.sz[this.root(p)] += this.sz[this.root(q)]
    }

    this.count--;
  }
}
// let w1 = new WeightedQuickUnion(10);
// console.log(w1.id);
// console.log(w1.sz);
// w1.union(1,2);
// w1.union(3,2);
// w1.union(3,4);
// w1.union(8,9);
// w1.union(1,9);
// console.log(w1.id);
// console.log(w1.connected(1,4));
// console.log(w1.connected(1,8));

class Percolation {
  constructor(n) {
    this.uf = new WeightedQuickUnion(n * n + 2);
    this.topUF = new WeightedQuickUnion(n * n + 2);
    this.size = n;
    this.state = [];
    for( var i = 0; i < n * n; i++) {
      this.state[i] = false;
    }
  }

  position(i, j) {
    let positionInUf = this.size*(i - 1) + j;
    return positionInUf;
  }

  isOpen(i, j) {
    return this.state[this.position(i, j)];
  }

  open(i, j) {
    this.state[this.position(i, j)] = true;
    this.connectNeighbors(i, j);
  }

  connectNeighbors(i, j) {
    if (i != 1 && this.isOpen(i - 1, j)) {
      this.uf.union(this.position(i - 1, j), this.position(i, j))
      this.topUF.union(this.position(i - 1, j), this.position(i, j))
    }
    if (i != this.size && this.isOpen(i + 1, j)) {
      this.uf.union(this.position(i + 1, j), this.position(i , j));
      this.topUF.union(this.position(i + 1, j), this.position(i , j));
    }
    if (j != this.size && this.isOpen(i, j + 1)) {
      this.uf.union(this.position(i, j + 1), this.position(i, j));
      this.topUF.union(this.position(i, j + 1), this.position(i, j));
    }
    if(j != 1 && this.isOpen(i, j - 1)) {
      this.uf.union(this.position(i, j - 1), this.position(i, j));
      this.topUF.union(this.position(i, j - 1), this.position(i, j));
    }

    if (i === 1) {
      this.uf.union(this.position(i, j),  0);
      this.topUF.union(this.position(i, j),  0);
    }
    if (i === this.size) {
      this.uf.union(this.position(i, j), this.size * this.size + 1);
    }
  }

  isFull(i, j) {
    return this.topUF.connected(this.position(i, j), 0);
  }

  isPercolate() {
    return this.uf.connected(0, this.size * this.size + 1);
  }
}

// let percolate = new Percolation(5);
// console.log(percolate.uf);
// console.log(percolate.state);
// percolate.open(1,1);
// console.log(percolate.isOpen(1,1));
// percolate.open(1,2);
// percolate.open(2,2);
// percolate.open(3,2);
// percolate.open(4,2);
// percolate.open(5,2);
// console.log(percolate.isPercolate());
// console.log(percolate.state)

class Draw {
  constructor(n, percolate) {
    this.size = n;
    this.canvas = document.getElementById('animation');
    this.percolate = percolate;
    this.ctx = this.canvas.getContext('2d');
    this.canvasSize = this.canvas.width;
    this.gridLength = Math.floor(this.canvasSize / n);
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

  }

  position(i) {
    let gridPosition = (this.canvasSize - this.gridLength * this.size) / 2 + (i - 1) * this.gridLength;
    return gridPosition;
    //400 - 100 * 3
  }

  drawGrids() {
    for (var i = 1; i < this.size + 1; i++) {
      for (var j = 1; j < this.size + 1; j++) {
        if (this.percolate.isFull(i, j)) {
          this.ctx.fillStyle = "#65C3F2";
          this.ctx.fillRect(this.position(j), this.position(i), this.gridLength, this.gridLength);
        } else if (this.percolate.isOpen(i, j)) {
          this.ctx.fillStyle = "white";
          // this.ctx.fillText("8", this.position(j), this.position(i));
          this.ctx.fillRect(this.position(j), this.position(i), this.gridLength, this.gridLength);
        } else {
          this.ctx.fillStyle = "black";
          this.ctx.fillRect(this.position(j), this.position(i), this.gridLength, this.gridLength);
        }
      }
    }
  }
}

let interval;

function simulate() {
  document.getElementById("percolates").innerHTML = "";
  clearInterval(interval);
  let size = +document.getElementById("size").value;
  let delay = +document.getElementById("delay").value;
  let percolate = new Percolation(size);
  let drawP = new Draw(size, percolate);
  let count = 0;

  function randomOpen() {
    let i = Math.floor(Math.random() * size + 1);
    let j = Math.floor(Math.random() * size + 1);
    if (percolate.isOpen(i, j)) {
      randomOpen();
    } else {
      percolate.open(i, j);
      return;
    }
  }

  function check() {
    if (!percolate.isPercolate()) {
      randomOpen();
      count++;
      drawP.drawGrids();
      let percentage = parseFloat((count / (size * size)) * 100).toFixed(2);
      let info = "Open grids: " + count + ". Open percentage: " + percentage + "%";
      document.getElementById("percolates").innerHTML = info;
    } else {
      clearInterval(interval);
    }
  }

  function fastOutput() {
    while(!percolate.isPercolate()) {
      randomOpen();
      count++;
    }
    drawP.drawGrids();
    let percentage = parseFloat((count / (size * size)) * 100).toFixed(2);
    let info = "Open grids: " + count + ". Open percentage: " + percentage + "%";
    document.getElementById("percolates").innerHTML = info;
  }

  if (delay === 0) {
    fastOutput();
  } else {
    interval = setInterval(check, delay);
    interval();
  }

}

document.addEventListener('DOMContentLoaded', () => {
  var canvas = document.getElementById('animation');
  // debugger
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "lightgrey";
  ctx.fillRect(0,0,500,500);

});
