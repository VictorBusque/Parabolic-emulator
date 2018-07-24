class Brain {
  constructor(size){
    this.max_moves = size
    this.directions = [];
    this.randomize(size);
    this.fitness = 0;
    this.mutation_rate = 0.5;
    this.lowest_distances = [9999,9999,9999];
    this.alive = true;
    this.reached_goal = false;
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

  //-------------------------------------------------------------------------------------------------------------------------------------
  //returns a perfect copy of this brain object
  clone() {
    var clone = new Brain(this.directions.length);
    for (var i = 0; i < this.directions.length; i++) {
      clone.directions[i] = this.directions[i];
    }
    return clone;
  }

  //----------------------------------------------------------------------------------------------------------------------------------------

  //mutates the brain by setting some of the directions to random vectors
  mutate() {
    for (var i = 0; i< this.max_moves; i++) {
      var p = random(1) <= this.mutation_rate;
      //set this direction as a random direction
      if (p) {
        var next_value = this.getRandomDirection();
        this.directions[i] = next_value;
      }  
    }
  }

  compute_distance(i) {
    var x1 = goals[i][0];
    var y1 = goals[i][1];
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
    //print("Lowest distance is "+this.lowest_distances)
  }


  update() {
    if (this.alive) {
      this.projec.simulate_step();
      this.compute_fitness();
      if (this.fitness < 50) this.reached_goal = true;
    }
    this.alive = this.projec.alive;
    //console.log("Am I alive? "+this.alive)
  }

  show() {
    //console.log("Showing brainnnn")
    fill(0,0,255);
    this.projec.show();
  }

  show_first() {
    fill(0,250,250);
    this.projec.show();
  }
}





