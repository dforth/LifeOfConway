import * as util from './src/util.js';


class LifeOfConway {
	
	constructor(width, height, containerId, wrapFlag) {
	
		this.width = width;
		this.height = height;	
		this.running = false;
		this.cycle = 0;
		this.wrapFlag = wrapFlag
		
		// add a canvas to the container
		let container = document.getElementById(containerId);
		
		var canvas = document.createElement('canvas');
		
		let canvasId = containerId + '-canvas';
		this.canvasId = canvasId;
        canvas.id = canvasId;
        canvas.width = this.width;
        canvas.height = this.height;
        //canvas.style.zIndex   = 8;
        //canvas.style.position = "absolute";
        //canvas.style.border   = "1px solid";
        //canvas.style.background = "red";
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);
		
		
		// Create the data array
		this.data = util.createDataArray(this.width, this.height);
		
		this.randomize();
		this.draw();
		//this.step();
		
		canvas.addEventListener('click', this.toggle.bind(this), false);
	}
	
	
	

	countNeighbors(x, y) {
		
		let count = 0;
		
		//
		// [x - 1 ,y - 1] [x, y - 1] [x + 1, y - 1]
		// [x - 1, y] [x, y] [x + 1, y]
		// [x - 1, y + 1] [x, y + 1] [x + 1, y + 1]
		//
		
		for(var i = (x - 1); i <= (x + 1); i++) {
		
			for(var j = (y - 1); j <= (y + 1); j++) {	
				
				if (i >= 0 && i < this.width && j >= 0 && j < this.height) {
					
					if (this.data[i][j] > 0 && !(x == i && y == j)) {
						
						count ++;
					}
				}
			}			
		}
		
		return count;
	}	
	
	toggle() {
		
		if (this.running) {
			
			this.stop();
			
		} else {
						
			this.run();
		}
	}
	
	run() {
		
		this.running = true;
		this.cycle = 0;
		
		this.interval = setInterval(function() { 
			
			this.step();
			this.cycle = this.cycle + 1;
			
		}.bind(this), 100);
		
	}
	
	step() {

		let newData = util.createDataArray(this.width, this.height);

		for (var x=0; x<this.width; x++) {
			
			for (var y=0; y<this.height; y++) {
				
				let count = this.countNeighbors(x,y);
				let oldValue = this.data[x][y];
								
				newData[x][y] = 0;
				
				if (oldValue == 0) {
					
					if (count == 3) {
						
						newData[x][y] = 1;
					}
					
				} else {

					if (count == 2 || count == 3) {
						
						newData[x][y] = oldValue + 1;
					}					
				} 				
				
				console.groupEnd();									
			}			
		}

		this.data = newData;	
		
		this.draw();	
	}
	
	stop() {
		
		this.running = false;
		
		if (this.interval) {
			
			clearInterval(this.interval);
		}
	}
	
	clear() {

		
		for(var x=0; x<this.width; x++) {
			
			for(var y=0; y<this.height; y++) {
				
				this.data[x][y] = 0;
			}			
		}
	
	}
	
	randomize() {
		
		for(var x=0; x<this.width; x++) {
			
			for(var y=0; y<this.height; y++) {
				
				this.data[x][y] = util.getRandomIntInclusive(0, 1);
			}			
		}
	}
	
	draw() {
	
		let canvas = document.getElementById(this.canvasId);
		let ctx = canvas.getContext("2d");
		ctx.fillStyle = "#000000";
		
		for(var x=0; x<this.width; x++) {
			
			for(var y=0; y<this.height; y++) {
				
				if (this.data[x][y] == 0) {
					
					ctx.clearRect(x, y, x+1, y+1);
					
				} else {
					
					ctx.fillRect(x, y, x+1, y+1);			
				}
			}			
		}
		
		
	}			
}

export default LifeOfConway;