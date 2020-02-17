export default class Elements {
	
	constructor() {
		
		this.body = document.getElementsByTagName("body")[0];
		this.main = document.getElementsByTagName("main")[0];
		
		this.counter = {};
		this.counter.correct = document.querySelector("footer div.progress a.correct");
		this.counter.incorrect = document.querySelector("footer div.progress a.incorrect");
		this.counter.remaining = document.querySelector("footer div.progress a.remaining");
		
		this.classes = {
		
			correct: "correctAnswer"
			
		};
		
		this.hashes = {
			
			dark: "#dark",
			toggleHint: "#toggleHint",
			load: "#convert",
			correct: "#correct",
			incorrect: "#wrong"
			
		}

	}
	
}
