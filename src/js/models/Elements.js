export default class Elements {
	
	constructor() {
		
		this.body = document.getElementsByTagName("body")[0];
		this.main = document.getElementsByTagName("main")[0];
		
		this.classes = {
		
			correct: "correctAnswer"
			
		};
		
		this.hashes = {
			
			dark: "#dark",
			load: "#convert",
			correct: "#correct",
			incorrect: "#wrong"
			
		}

	}
	
}
