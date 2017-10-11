import * as util from './src/util.js';


function createDataArray(width, height) {

	let data = new Array(width);
	for (var x = 0; x < width; x++) {
		data[x] = new Array(height);
	}
	
	return data;
}



class LifeOfConway {
	
	constructor(width, height, containerId, wrapFlag) {
	
		this.width = width;
		this.height = height;	
		this.containerId = containerId;
		this.running = false;
		this.cycle = 0;
		this.wrapFlag = wrapFlag
		
		this.data = createDataArray(this.width, this.height);
		
		this.randomize();
		this.draw();
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
					
					if (this.data[i][j] > 0) {
						
						count ++;
					}
				}
			}			
		}
		
		return count;
	}	
	
	run() {
		
	}
	
	step() {

		let newData = createDataArray(this.width, this.height);
				
		for (var x=0; x<this.width; x++) {
			
			for (var y=0; y<this.height; y++) {
				
				let count = countNeightbors(x,y);
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
			}			
		}
		
		this.data = newData;
		
	}
	
	stop() {
		
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
	
		console.log("data = ", this.data);	
	}			
}

export default LifeOfConway;