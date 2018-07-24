var initial_pos = [10,550];
var initial_speed = [];
var goals = [];

var scaling = 1;
var x_pixels = 1280;
var y_pixels = 600;

var speed_factor = 0.25;
var time_scaling_factor = 0.01;
var limit_power = 50;
var mutation_scale = 5;
var p;

var mouse_pressed = false;
var mouse_released = false;

var best_distance = 999;

var margin = 250;

var showbest = false;

function setup() {
	createCanvas(x_pixels*scaling, y_pixels*scaling);
	p = new Population(20,1);
}

function draw() {
	clear();
	fill(0,0,0);

	textSize(25*scaling);
  	text("Generation: "+p.generation, (x_pixels-margin)*scaling+10*scaling, 25*scaling);
  	text("Best Distance: "+floor(best_distance), (x_pixels-margin)*scaling+10*scaling, 50*scaling);

	line(0,0,0,y_pixels*scaling);
	line(0,0,x_pixels*scaling-margin*scaling,0);
	line(x_pixels*scaling-margin*scaling,0,x_pixels*scaling-margin*scaling,y_pixels*scaling);
	line(0,y_pixels*scaling,x_pixels*scaling-margin*scaling,y_pixels*scaling);
	strokeWeight(2);
	fill(0,255,0);
	for (var i = 0; i < goals.length; i++) {
		ellipse(goals[i][0]*scaling, goals[i][1]*scaling, 15*scaling, 15*scaling);
	}
	fill(255,255,0);
	ellipse(initial_pos[0]*scaling, initial_pos[1]*scaling, 20*scaling, 20*scaling);

	if (p.someone_alive() & goals.length > 0) {
		p.update_step();
	}
	else if (goals.length > 0) {//} if (mouse_pressed) {
		p.compute_fitness();
	    var selected_genome = p.natural_selection();
	    p.set_next_generation(selected_genome);		
	}

}

function mouseReleased() {
   goals.push([mouseX, mouseY])
}


function keyReleased() {
	showbest = !showbest;
}


class Projectile {
	constructor(speed) {
		this.x = initial_pos[0]*scaling;
		this.y = initial_pos[1]*scaling;
		this.v_x_t = speed[0]*speed_factor;
		this.v_y_t = speed[1]*speed_factor;
		this.g = -9.81;
		this.t = 0;
		this.alive = true;
	}


	info_i(i) {
		console.log("------------------")
		console.log("Genome number -> "+i)
		console.log("Position: "+this.x+", "+this.y);
		console.log("Speed: "+this.v_x_t+", "+this.v_y_t);
		console.log("Alive: "+this.alive);
		console.log("------------------")
	}


	set_speed() {
		this.v_x_t = initial_speed[0]*speed_factor;
		this.v_y_t = initial_speed[1]*speed_factor;	
	}

	// motion equation: mx = 0, my = -mg
	// x(t) = v_x_t+x0
	// y(t) = -(1/2)*g*t+v_y_t+y0;
	simulate_step() {
		if (this.x < 0 || this.x > x_pixels*scaling-margin*scaling || this.y < 0 || this.y > y_pixels*scaling) {
			this.alive = false;
		}
		else if (this.alive) {
			this.x = this.v_x_t*this.t + this.x;
			this.y = -(1/2)*this.g*this.t*this.t + this.v_y_t*this.t + this.y;
			this.t = this.t + time_scaling_factor;		
		}

	}

	show() {
		ellipse(this.x, this.y, 10*scaling, 10*scaling);
	}
}