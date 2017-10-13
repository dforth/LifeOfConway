import * as util from './Util.js';
import defaultOptions from './defaultOptions.js';


class LifeOfConway {
	
	constructor(divId, userOptions) {
	
		this.divId = divId;
	
		if (userOptions) {
			
			this.options = Object.assign(defaultOptions, userOptions);
			
		} else {
			
			this.options = defaultOptions;
		}
		
		let divRect = util.getDivRect(divId);
		
		if (this.options.width > divRect.width) {
			
			this.options.width = divRect.width;
		}
		
		if (this.options.height > divRect.height) {
			
			this.options.height = divRect.height;
		}
		
		this.xScale = divRect.width / this.options.width;
		this.yScale = divRect.height / this.options.height;
		
		this.running = false;
		this.cycle = 0;
		this.staleness = 0;
		
		// create and add our canvas
		let div = document.getElementById(divId);
		var canvas = document.createElement('canvas');
		
		let canvasId = divId + '-canvas';
		this.canvasId = canvasId;
        canvas.id = canvasId;
        canvas.width = divRect.width;
        canvas.height = divRect.height;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        div.appendChild(canvas);
        
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, divRect.width, divRect.height);
		
		// Create the data array
		this.cells = util.createDataArray(this.options.width, this.options.height);
		this.cellsPlusOne = null;
		this.cellsPlusTwo = null;
		
		this.randomize();
		this.draw();
		
		canvas.addEventListener('click', this.clickHandler.bind(this), false);
		
		if (this.options.autoRun) {
			
			this.run();
		}
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
				
				if (i >= 0 && i < this.options.width && j >= 0 && j < this.options.height) {
					
					if (this.cells[i][j] > 0 && !(x == i && y == j)) {
						
						count ++;
					}
				}
			}			
		}
		
		return count;
	}	
	
	clickHandler(event) {
		
		if (event) {
			
			// Determine the coords of the cell they clicked on
			let cellCoords = this.determineCellCoords(event.clientX, event.clientY);
			// then toggle that cell
			this.toggleCell(cellCoords.x, cellCoords.y);
		}
		
	}
	
	determineCellCoords(screenX, screenY) {

		// The relative position of the div could have changed - so get this each time we need it.	
		// We do not allow for the size of the div to have changed.
		let divRect = util.getDivRect(this.divId);
		
		return {
			x: Math.floor((screenX - Math.floor(divRect.left)) / this.xScale),
			y: Math.floor((screenY - Math.floor(divRect.top)) / this.yScale)
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
			
			if (this.options.autoRun) {
				
				if (this.checkForStaleness()) {
					
					this.randomize();
					this.cycle = 0;
					this.staleness = 0;
				}
			}
			
		}.bind(this), 100);
		
	}
	
	cellsAreEqual(cellsOne, cellsTwo) {
		
		if(cellsOne != null && cellsTwo != null) {
			
			for (var x=0; x<this.options.width; x++) {
			
				for (var y=0; y<this.options.height; y++) {
					
					if (cellsOne[x][y] != cellsTwo[x][y]) {
						
						return false;
					}
				}
			}
			
			return true;
		}
		
		return false;
	}
	
	checkForStaleness() {
		
		if (this.cellsAreEqual(this.cells, this.cellsPlusOne) || this.cellsAreEqual(this.cells, this.cellsPlusTwo)) {
			
			this.staleness = this.staleness + 1;
			
		} else {
			
			this.staleness = 0;
		}
		
		return (this.staleness > this.options.stalenessLimit);			
	}
	
	step() {

		if (this.cellsPlusOne != null) {
			
			this.cellsPlusTwo = this.cellsPlusOne;
		}
		
		this.cellsPlusOne = this.cells;

		let newCells = util.createDataArray(this.options.width, this.options.height);

		for (var x=0; x<this.options.width; x++) {
			
			for (var y=0; y<this.options.height; y++) {
				
				let count = this.countNeighbors(x,y);
				let oldValue = this.cells[x][y];
								
				newCells[x][y] = 0;
				
				if (oldValue == 0) {
					
					if (count == 3) {
						
						newCells[x][y] = 1;
					}
					
				} else {

					if (count == 2 || count == 3) {
						
						newCells[x][y] = 1;
					}					
				} 				
				
				console.groupEnd();									
			}			
		}

		this.cells = newCells;
		
		this.draw();	
	}
	
	stop() {
		
		this.running = false;
		
		if (this.interval) {
			
			clearInterval(this.interval);
		}
	}
	
	toggleCell(x,y) {
		
		if (this.cells[x][y]) {
		
			this.cells[x][y] = 0;			
			
		} else {
			
			this.cells[x][y] = 1;
		}
		
		this.draw();
	}
	
	clear() {

		
		for(var x=0; x<this.options.width; x++) {
			
			for(var y=0; y<this.options.height; y++) {
				
				this.cells[x][y] = 0;
			}			
		}
	
	}
	
	randomize() {
		
		for(var x=0; x<this.options.width; x++) {
			
			for(var y=0; y<this.options.height; y++) {
				
				this.cells[x][y] = util.getRandomIntInclusive(0, 1);
			}			
		}
	}
	
	draw() {
	
		let canvas = document.getElementById(this.canvasId);
		let ctx = canvas.getContext("2d");

		ctx.fillStyle = this.options.cellColor;
		
		for(var x=0; x<this.options.width; x++) {
			
			for(var y=0; y<this.options.height; y++) {
				
				if (this.cells[x][y] == 0) {
					
					ctx.clearRect(x * this.xScale, y * this.yScale, (x+1) * this.xScale, (y+1) * this.yScale);
					
				} else {
					
					ctx.fillRect(x * this.xScale, y * this.yScale, (x+1) * this.xScale, (y+1) * this.yScale);			
				}
			}			
		}
		
		if (this.options.showGrid) {

			this.drawGrid(ctx);
		}
	}	
	
	drawGrid(ctx) {
		
		ctx.strokeStyle = this.options.gridColor;
		
		for(var x=1; x< this.options.width; x++) {
			
			let xValue = x * this.xScale;
			
			ctx.beginPath();
			ctx.moveTo(xValue, 0);
			ctx.lineTo(xValue, this.options.height * this.yScale);
			ctx.stroke();
		}	
		
		for(var y=1; y< this.options.height; y++) {
			
			let yValue = y * this.yScale;
			
			ctx.beginPath();
			ctx.moveTo(0, yValue);
			ctx.lineTo(this.options.width * this.xScale, yValue);
			ctx.stroke();
		}
	}		
}

export default LifeOfConway;