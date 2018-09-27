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
let w1 = new WeightedQuickUnion(10);
console.log(w1.id);
console.log(w1.sz);
w1.union(1,2);
w1.union(3,2);
w1.union(3,4);
w1.union(8,9);
w1.union(1,9);
console.log(w1.id);
console.log(w1.connected(1,4));
console.log(w1.connected(1,8));
