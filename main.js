var initial_pos = [150,450];
var initial_speed = [];
var goals = [];

var scaling = 1;
var arrow_scaling = 8;
var x_pixels = 1280;
var y_pixels = 600;

var speed_factor = 0.25;
var time_scaling_factor = 0.01;
var limit_power = 50;
var mutation_scale = 5;
var p;

var n_brains = 50;

var mouse_pressed = false;
var mouse_released = false;

var best_distance = 999;

var margin = 250;

var z = 20;
var sphereSize = [15,15,15];

var showbest = false;

var goalColor;
var bestColor;
var homeColor;
var normalColor;

var start = false;

function setup() {
	createCanvas(x_pixels*scaling, y_pixels*scaling, WEBGL);
	p = new Population(n_brains,1);
	frameRate(120);
	goalColor = color(0,255,0);
	bestColor = color(0,255,255);
	homeColor = color(255,255,0);
	normalColor = color(0,0,255);
	ambientLight(100);
	pointLight(120, 120, 120, 0, 0, 0);
}

function draw() {

	clear();
	background(200);

	for (var i = 0; i < goals.length; i++) {
		push();
		ambientMaterial(goalColor);
		translate(-(x_pixels/2)+goals[i][0]*scaling, -(y_pixels/2)+goals[i][1]*scaling, z+(sphereSize[2]));
		rotateY(sin(millis()/150)*QUARTER_PI);
		torus(floor(sphereSize[0]*1.5), 5);
		pop();
	}
	push();
	ambientMaterial(homeColor);
	translate(-x_pixels/2+initial_pos[0]*scaling, -y_pixels/2+initial_pos[1]*scaling, z);
	sphere(floor(sphereSize[0]*1.5), floor(sphereSize[1]*1.5), floor(sphereSize[2]*1.5));
	pop();

	if (start & p.someone_alive() & goals.length > 0) {
		p.update_step();
	}
	else if (start & goals.length > 0) {
		p.compute_fitness();
    var selected_genome = p.natural_selection();
    p.set_next_generation(selected_genome);
	}

}

function withinLimits(x, y) {
	return x < x_pixels*scaling-margin & y < y_pixels & 0 < y;
}


function touchEnded() {
	if (withinLimits(mouseX, mouseY)) goals.push([mouseX, mouseY]);
	return false;
}

function mouseReleased() {
	if (withinLimits(mouseX, mouseY)) goals.push([mouseX, mouseY]);
	return false;
}


function keyPressed() {
	if (keyCode == 66) {
		showbest = !showbest;
	}
	else if (keyCode === 32) {
			start = !start;
		}
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
		push();
		translate(-x_pixels/2+this.x, -y_pixels/2+this.y, z);
		sphere(sphereSize[0], sphereSize[1], sphereSize[2]);
		pop();
	}

	show_line() {
		strokeWeight(3);
	}
}
