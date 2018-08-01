class Brain {
  constructor(size){
    this.max_moves = size
    this.directions = [];
    this.randomize(size);
    this.fitness = 0;
    this.mutation_rate = 0.5;
    this.lowest_distances = [];
    this.initialize_ld();
    this.alive = true;
    this.reached_goal = false;
    this.projec = new Projectile(this.directions[0]);
  }

  initialize_ld() {
    for (var i = 0; i < goals.length; i++) {
      this.lowest_distances[i] = 9999;
    }
  }


  set_projec_vec() {
    this.projec = new Projectile(this.directions[0]);
  }


  randomize(size) {
    for (var i = 0; i < size; i++) {
      this.directions[i] = this.getRandomDirection();
    }
  }


  fill_X_pos() {
    for (var i = this.directions.length; i < this.max_moves; i++) {
      this.directions[i] = this.getRandomDirection();
    }
  }


  getRandomDirection() {
    return [floor(limit_power*random(1)), floor(-limit_power*random(1))];
  }

  pos_or_neg() {
    var v = floor(random(2))-1;
    if (v==0) return 1;
    return v;
  }

  getRelativeDirection(vx, vy) {
    return [this.directions[0][0]+floor(mutation_scale*this.pos_or_neg()*random(1)),
            this.directions[0][1]+floor(mutation_scale*this.pos_or_neg()*random(1))];
  }


  clone() {
    var clone = new Brain(this.directions.length);
    for (var i = 0; i < this.directions.length; i++) {
      clone.directions[i] = this.directions[i];
    }
    return clone;
  }


  mutate() {
    for (var i = 0; i< this.max_moves; i++) {
      var p = random(1) <= this.mutation_rate;
      //set this direction as a random direction
      if (p) {
        var next_value = this.getRelativeDirection();
        this.directions[i] = next_value;
      }
    }
  }


  compute_distance(i) {
    var x1 = goals[i][0];//*scaling;
    var y1 = goals[i][1];//*scaling;
    var a = x1 - this.projec.x;
    var b = y1 - this.projec.y;
    var dist = Math.sqrt( a*a + b*b );
    return dist;
  }


  compute_fitness() {
    for (var i = 0; i < goals.length; i++) {
      this.lowest_distances[i] = floor(min(this.lowest_distances[i], this.compute_distance(i)));
    }
    this.fitness = 1/this.lowest_distances.reduce((a, b) => a + b, 0);
  }


  update() {
    if (this.alive) {
      this.projec.simulate_step();
      this.compute_fitness();
      if (this.fitness < 50) this.reached_goal = true;
    }
    this.alive = this.projec.alive;
  }

  show() {
		ambientMaterial(normalColor);
    this.projec.show();
  }

  show_first() {
    ambientMaterial(bestColor);
    this.projec.show();
    this.projec.show_line();
  }
}
