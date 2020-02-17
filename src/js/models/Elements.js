export default class Elements {
	
	constructor() {
		
		this.main = document.getElementsByTagName("main")[0];
		
		this.classes = {
		
			correct: "correctAnswer"
			
		};
		
		this.hashes = {
			
			start: "#start",
			load: "#convert",
			correct: "#correct",
			incorrect: "#wrong"
			
		}

	}
	
}
