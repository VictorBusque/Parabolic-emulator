var initial_pos = [50,650];
var goals = [ [99,500], [222,222], [684, 450] ];

var scaling = 2;
var x_pixels = 1280;
var y_pixels = 720;

var projectile;

function compute_pos_at_timestep(pos, force, angle) {
	return [];
}

function setup() {
	createCanvas(x_pixels*scaling, y_pixels*scaling);
	projectile = new Projectile([50,500], [70,50]);
}

function draw() {
	clear();
	fill(0,0,0);
	strokeWeight(2);
	fill(0,255,0);
	for (var i = 0; i < goals.length; i++) {
		ellipse(goals[i][0], goals[i][1], 10*scaling, 10*scaling);
	}
	projectile.simulate_step();
}

class Projectile {
	constructor(pos, init_speed) {
		this.x = pos[0];
		this.y = pos[1];
		this.v_x_t = init_speed[0];
		this.v_y_t = init_speed[1];
		this.g = 9.81;
		this.t = 0;
	}

	compute_x(angle, data) {
		return data*sin(angle);
	}

	compute_y(angle, data) {
		return data*cos(angle);
	}

	// motion equation: mx = 0, my = -mg
	// x(t) = v_init_x_t+x0
	// y(t) = -(1/2)*g*t+v_init_y_t+y0;
	simulate_step() {
		this.x = this.v_x_t + this.x;
		this.y = -(1/2)*this.g*this.t + this.v_y_t + this.y;
		this.show();
		this.t++;
	}

	show() {
		fill(0,0,255);
		ellipse(this.x, this.y, 5*scaling, 5*scaling);
	}
}