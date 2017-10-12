
export function getRandomIntInclusive(min, max) {
	
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

export function createDataArray(width, height) {

	let result = new Array(width);
	
	for (var x = 0; x < width; x++) {
		
		result[x] = new Array(height).fill(0);
	}
		
	return result;
}