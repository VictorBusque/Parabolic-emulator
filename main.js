var initial_pos = [10,550];
var initial_speed = [];
var goals = [ [99,500], [444,222], [684, 450] ];

var scaling = 1;
var x_pixels = 1280;
var y_pixels = 600;

var speed_factor = 0.25;
var time_scaling_factor = 0.01;
var limit_power = 50;
var p;

var mouse_pressed = false;
var mouse_released = false;


function setup() {
	createCanvas(x_pixels*scaling, y_pixels*scaling);
	//projectile = new Projectile();
	p = new Population(20,1);
}

function draw() {
	clear();
	fill(0,0,0);
	line(0,0,0,y_pixels*scaling);
	line(0,0,x_pixels*scaling,0);
	line(x_pixels*scaling,0,x_pixels*scaling,y_pixels*scaling);
	line(0,y_pixels*scaling,x_pixels*scaling,y_pixels*scaling);
	strokeWeight(2);
	fill(0,255,0);
	for (var i = 0; i < goals.length; i++) {
		ellipse(goals[i][0]*scaling, goals[i][1]*scaling, 15*scaling, 15*scaling);
	}
	fill(255,255,0);
	ellipse(initial_pos[0]*scaling, initial_pos[1]*scaling, 20*scaling, 20*scaling);

	if (p.someone_alive()) {
		p.update_step();
	}
	else if (mouse_pressed) {
		p.compute_fitness();
	    var selected_genome = p.natural_selection();
	    p.set_next_generation(selected_genome);		
	}

}

function mousePressed() {
   mouse_pressed = true;
   mouse_released = false;
}

function mouseReleased() {
	mouse_released = true;
	mouse_pressed = false;
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

	set_speed() {
		this.v_x_t = initial_speed[0]*speed_factor;
		this.v_y_t = initial_speed[1]*speed_factor;	
		//console.log("Speeds: "+this.v_x_t+", "+this.v_y_t)	
	}

	// motion equation: mx = 0, my = -mg
	// x(t) = v_x_t+x0
	// y(t) = -(1/2)*g*t+v_y_t+y0;
	simulate_step() {
		if (this.x < 0 || this.x > x_pixels*scaling || this.y < 0 || this.y > y_pixels*scaling) {
			this.alive = false;
		}
		else if (this.alive) {
			this.x = this.v_x_t*this.t + this.x;
			this.y = -(1/2)*this.g*this.t*this.t + this.v_y_t*this.t + this.y;
			this.show();
			this.t = this.t + time_scaling_factor;		
		}

	}

	show() {
		ellipse(this.x, this.y, 10*scaling, 10*scaling);
	}
}