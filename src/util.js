
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

export function getDivRect(divId) {
	
	let div = document.getElementById(divId);
	
	return div.getBoundingClientRect();
}

export function enable(elementId) {
	
	let element = document.getElementById(elementId);
	
	element.disabled = false;
}

export function disable(elementId) {
	
	let element = document.getElementById(elementId);	
	
	element.disabled = true;
}
