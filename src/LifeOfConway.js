import * as util from './Util.js';
import defaultOptions from './defaultOptions.js';


class LifeOfConway {
	
	constructor(divId, userOptions) {
	
		this.divId = divId;
	
		this.options = Object.assign({}, defaultOptions);
	
		if (userOptions) {
			
			this.options = Object.assign(this.options, userOptions);
			
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
		
		// create and add our canvas
		let div = document.getElementById(divId);
		let canvas = document.createElement('canvas');
		
		let canvasId = divId + '-canvas';
		this.canvasId = canvasId;
        canvas.id = canvasId;
        canvas.width = divRect.width;
        canvas.height = divRect.height;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.cursor = 'pointer';
        div.appendChild(canvas);
        
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, divRect.width, divRect.height);
		
		// Create the data array
		this.cells = util.createDataArray(this.options.width, this.options.height);
		console.log("myCells: ", this.cells);
		this.cellsPlusOne = null;
		this.cellsPlusTwo = null;
		
		canvas.addEventListener('click', this.buttonClickHandler.bind(this), false);
		
		
		// Controls		
		this.initControls();
		
		if (this.options.startWithControlsVisible) {
			console.log("here0");
			this.toggleControls();
		}
		
		// Starting state
		
		this.running = false;
		this.cycle = 0;
		this.staleness = 0;		
		
		this.randomize();
		this.draw();

		if (this.options.autoRun) {
			
			this.toggleState();
		}
	}
	
	initControls() {
		
		this.controlsVisible = false;
		
		let div = document.getElementById(this.divId);
		
		let controlDiv = document.createElement('DIV');
		this.controlsId = this.divId + '_controls';
		controlDiv.id = this.controlsId;
		controlDiv.style.width = "100%";
		controlDiv.style.border = "1px solid black";
		controlDiv.style.display = "none";
		controlDiv.style['flex-flow'] = "row nowrap";
		controlDiv.style['justify-content'] = "space-around";
		
		let runButton = document.createElement('BUTTON');		
		this.runButtonId = this.controlsId + "_run_button";
		runButton.id = this.runButtonId;
		runButton.appendChild(document.createTextNode('Run'));		
		runButton.addEventListener('click', this.buttonClickHandler.bind(this), false);
		
		controlDiv.appendChild(runButton);

		let stopButton = document.createElement('BUTTON');		
		this.stopButtonId = this.controlsId + "_stop_button";
		stopButton.id = this.stopButtonId;
		stopButton.appendChild(document.createTextNode('Stop'));
		stopButton.addEventListener('click', this.buttonClickHandler.bind(this), false);
		
		controlDiv.appendChild(stopButton);
		
		let stepButton = document.createElement('BUTTON');		
		this.stepButtonId = this.controlsId + "_step_button";
		stepButton.id = this.stepButtonId;
		stepButton.appendChild(document.createTextNode('Step'));
		stepButton.addEventListener('click', this.buttonClickHandler.bind(this), false);
		
		controlDiv.appendChild(stepButton);
		
		let rndButton = document.createElement('BUTTON');		
		this.rndButtonId = this.controlsId + "_randomize_button";
		rndButton.id = this.rndButtonId;
		rndButton.appendChild(document.createTextNode('Randomize'));
		rndButton.addEventListener('click', this.buttonClickHandler.bind(this), false);
		
		controlDiv.appendChild(rndButton);
		
		let clearButton = document.createElement('BUTTON');		
		this.clearButtonId = this.controlsId + "_clear_button";
		clearButton.id = this.clearButtonId;
		clearButton.appendChild(document.createTextNode('Clear'));
		clearButton.addEventListener('click', this.buttonClickHandler.bind(this), false);
		
		controlDiv.appendChild(clearButton);
		
		div.appendChild(controlDiv);				
	}
	
	buttonClickHandler(event) {
		
		if (event) {
		
			let targetId = event.target.id;
			
			if (targetId == this.canvasId) {
				
				// With ALT?
				if (event.altKey) {
					
					this.toggleControls();
					
				} else {
					
					// Determine the coords of the cell they clicked on
					let cellCoords = this.determineCellCoords(event.clientX, event.clientY);
					// then toggle that cell
					this.toggleCell(cellCoords.x, cellCoords.y);	
			
					event.stopPropagation();	
				}
				
			} else if (targetId == this.runButtonId) {
				
				if (!this.running) {
					
					this.run();
				}
				
			} else if (targetId == this.stopButtonId) {
				
				if (this.running) {
					
					this.stop();
				}
				
			} else if (targetId == this.stepButtonId) {
				
				if (this.running) {
					
					this.stop();
				}
				
				this.step();
				
			} else if (targetId == this.rndButtonId) {
				
				this.randomize();
				this.cycle = 0;
				this.staleness = 0;
				this.draw();
				
			} else if (targetId == this.clearButtonId) {
				
				if (this.running) {
					
					this.stop();
				}
				
				this.clear();
				this.cycle = 0;
				this.staleness = 0;
				this.draw();
			}
		
			this.updateControls();
			event.stopPropagation();	
		}			
	}
	
	toggleControls() {
		
		if (!this.controlsVisible) {
		
			this.showControls();
			this.updateControls();
				
		} else {
			
			this.hideControls();
		}		
	}
	
	showControls() {
		
		let controls = document.getElementById(this.controlsId);
		
		controls.style.display = "flex";
		
		this.controlsVisible = true;
	}
	
	hideControls() {
		
		let controls = document.getElementById(this.controlsId);
		
		controls.style.display = "none";

		
		this.controlsVisible = false;
	}
	
	updateControls() {
		
		if (this.controlsVisible) {
		
			if (this.running) {
				
				util.enable(this.stopButtonId);
				util.disable(this.runButtonId);
				util.disable(this.stepButtonId);
				
			} else {
				
				util.disable(this.stopButtonId);
				util.enable(this.runButtonId);
				util.enable(this.stepButtonId);				
			}			
		}		
	}

	countNeighbors(x, y) {
		
		let count = 0;

		//
		// [x - 1 ,y - 1] [x, y - 1] [x + 1, y - 1]
		// [x - 1, y] [x, y] [x + 1, y]
		// [x - 1, y + 1] [x, y + 1] [x + 1, y + 1]
		//
		
		for(let i = (x - 1); i <= (x + 1); i++) {
		
			for(let j = (y - 1); j <= (y + 1); j++) {	
				
				if (i >= 0 && i < this.options.width && j >= 0 && j < this.options.height) {
					
					if (this.cells[i][j] > 0 && !(x == i && y == j)) {
						
						count ++;
					}
				}
			}			
		}
		
		return count;
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
		
		this.updateControls();
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
			
		}.bind(this), this.options.runStepDelayMilliseconds);
		
	}
	
	cellsAreEqual(cellsOne, cellsTwo) {
		
		if(cellsOne != null && cellsTwo != null) {
			
			for (let x=0; x<this.options.width; x++) {
			
				for (let y=0; y<this.options.height; y++) {
					
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

		for (let x=0; x<this.options.width; x++) {
			
			for (let y=0; y<this.options.height; y++) {
				
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

		
		for(let x=0; x<this.options.width; x++) {
			
			for(let y=0; y<this.options.height; y++) {
				
				this.cells[x][y] = 0;
			}			
		}
		
	}
	
	randomize() {
		
		for(let x=0; x<this.options.width; x++) {
			
			for(let y=0; y<this.options.height; y++) {
				
				this.cells[x][y] = util.getRandomIntInclusive(0, 1);
			}			
		}		
	}
	
	draw() {
	
		let canvas = document.getElementById(this.canvasId);
		let ctx = canvas.getContext("2d");

		ctx.fillStyle = this.options.cellColor;
		
		for(let x=0; x<this.options.width; x++) {
			
			for(let y=0; y<this.options.height; y++) {
				
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
		
		for(let x=0; x< this.options.width + 1; x++) {
			
			let xValue = x * this.xScale;
			
			ctx.beginPath();
			ctx.moveTo(xValue, 0);
			ctx.lineTo(xValue, this.options.height * this.yScale);
			ctx.stroke();
		}	
		
		for(let y=0; y< this.options.height + 1; y++) {
			
			let yValue = y * this.yScale;
			
			ctx.beginPath();
			ctx.moveTo(0, yValue);
			ctx.lineTo(this.options.width * this.xScale, yValue);
			ctx.stroke();
		}
	}		
}

export default LifeOfConway;