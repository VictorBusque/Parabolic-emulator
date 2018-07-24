class Population {
	constructor(num_brains, num_moves) {
		this.num_brains = num_brains;
		this.brains = []
		this.num_moves = num_moves
		for (var i = 0; i < num_brains; i++) {
			this.brains[i] = new Brain(num_moves);
			//this.brains[i].projec.info_i(i);
		}
		this.generation = 1;
	}

	natural_selection() {
		var best_idx = 0;
		var best_fitness = this.brains[0].fitness;
		//console.log("Genome 0 has fitness " + this.brains[0].fitness)
		//console.log("Genome 0 got distances: " + this.brains[0].lowest_distances)
		for (var i = 1; i < this.num_brains; i++) {
			var actual_fitness = this.brains[i].fitness;
			if (actual_fitness > best_fitness) {
				best_idx = i;
				best_fitness = actual_fitness;
			}	
			//console.log("Genome "+i+" has fitness " + this.brains[i].fitness + " with shot: "+p.brains[i].directions)
			//console.log("Genome " +i+ " got distances: " + this.brains[i].lowest_distances)
		}
		console.log(best_idx+" is the best genome of generation " + this.generation + ". At distance: " + floor(1/best_fitness));
		return best_idx;
	}

	arraysEqual(arr1, arr2) {
	    if(arr1.length !== arr2.length)
	        return false;
	    for(var i = arr1.length; i--;) {
	        if(arr1[i] !== arr2[i])
	            return false;
	    }
	    return true;
	}

	vectorClone(v1) {
		var clone = [];
		for (var i = 0; i < v1.length; i++) clone[i] = v1[i];
		return clone;
	}

	compute_fitness() {
		for (var i = 0; i < this.num_brains; i++) {
			this.brains[i].compute_fitness();
		}
	}

	set_next_generation(selected_genome) {
		//console.log("Setting next generation")
		var genome_brain = this.brains[selected_genome];
		var genome_movements = this.vectorClone(this.brains[selected_genome].directions);
		//console.log("THE SELECTED GENOME HAS VECTOR: "+genome_movements)
		for (var i = 0; i < this.num_brains; i++) {
			this.brains[i] =  new Brain(this.num_moves);
			this.brains[i].directions = this.vectorClone(genome_movements);
			if (i != 0) {
				this.brains[i].mutate();
			}
			this.brains[i].set_projec_vec();
			//this.brains[i].projec.info_i(i);
			//console.log("created brain " +i+" with dirs = "+this.brains[i].directions)
		}
		this.generation+=1;
	}

	reached_goal() {
		for (var i = 0; i < this.num_brains; i++) {
			if(this.brains[i].reached_goal) return true;
		}
		return false;
	}

	dead_dots() {
		var dead = 0;
		for (var i = 0; i < this.num_brains; i++) {
			if (!this.brains[i].projec.alive) dead++;
		}
		return dead;		
	}

	someone_alive() {
		for (var i = 0; i < this.num_brains; i++) {
			if (this.brains[i].projec.alive) return true;
		}
		return false;
	}

	update_step() {
		this.brains[0].update();
		for (var i = 1; i < this.num_brains; i++) {
			this.brains[i].update();
			if (!showbest) this.brains[i].show();
		}
		this.brains[0].show_first();
	}
}