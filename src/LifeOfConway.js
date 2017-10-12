import * as util from './Util.js';


class LifeOfConway {
	
	constructor(divId, width, height, showGrid) {
	
		this.divRect = util.getDivRect(divId);
		this.showGrid = showGrid;
		this.width = width;
		
		if (this.width > this.divRect.width) {
			
			this.width = this.divRect.width;
		}
		
		this.height = height;	
		
		if (this.height > this.divRect.height) {
			
			this.height = this.divRect.height;
		}
		
		this.xScale = this.divRect.width / this.width;
		this.yScale = this.divRect.height / this.height;
		
		this.cellColor = "#000000";
		this.gridColor = "#333333";
		
		this.running = false;
		this.cycle = 0;
		
		// add a canvas to the container
		let div = document.getElementById(divId);
		
		var canvas = document.createElement('canvas');
		
		let canvasId = divId + '-canvas';
		this.canvasId = canvasId;
        canvas.id = canvasId;
        canvas.width = this.divRect.width;
        canvas.height = this.divRect.height;
        //canvas.style.zIndex   = 8;
        //canvas.style.position = "absolute";
        //canvas.style.border   = "1px solid";
        //canvas.style.background = "red";
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        div.appendChild(canvas);
		
		
		// Create the data array
		this.data = util.createDataArray(this.width, this.height);
		
		this.randomize();
		this.draw();
		//this.step();
		
		canvas.addEventListener('click', this.clickHandler.bind(this), false);
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
	
	clickHandler(event) {
		
		if (event) {
			
			//console.log("event: ", event);
			
			let cellCoords = this.determineCellCoords(event.clientX, event.clientY);
			this.toggleCell(cellCoords.x, cellCoords.y);
		}
		
	}
	
	determineCellCoords(clientX, clientY) {
		
		let x = Math.floor((clientX - Math.floor(this.divRect.left)) / this.xScale);
		let y = Math.floor((clientY - Math.floor(this.divRect.top)) / this.yScale);
		
		return {
			x: x,
			y: y
		};		
	}
	
	toggleState() {
		
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
	
	toggleCell(x,y) {
		
		if (this.data[x][y]) {
		
			this.data[x][y] = 0;			
			
		} else {
			
			this.data[x][y] = 1;
		}
		
		this.draw();
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

		ctx.fillStyle = this.cellColor;
		
		for(var x=0; x<this.width; x++) {
			
			for(var y=0; y<this.height; y++) {
				
				if (this.data[x][y] == 0) {
					
					ctx.clearRect(x * this.xScale, y * this.yScale, (x+1) * this.xScale, (y+1) * this.yScale);
					
				} else {
					
					ctx.fillRect(x * this.xScale, y * this.yScale, (x+1) * this.xScale, (y+1) * this.yScale);			
				}
			}			
		}
		
		if (this.showGrid) {
			
			this.drawGrid(ctx);
		}
	}	
	
	drawGrid(ctx) {
		
		ctx.strokeStyle = this.gridColor;
		
		for(var x=1; x< this.width; x++) {
			
			let xValue = x * this.xScale;
			
			ctx.beginPath();
			ctx.moveTo(xValue, 0);
			ctx.lineTo(xValue, this.height * this.yScale);
			ctx.stroke();
		}	
		
		for(var y=1; y< this.height; y++) {
			
			let yValue = y * this.yScale;
			
			ctx.beginPath();
			ctx.moveTo(0, yValue);
			ctx.lineTo(this.width * this.xScale, yValue);
			ctx.stroke();
		}
	}		
}

export default LifeOfConway;