// Expects array of objects with properties: question, (snippet), answer, false[1-N]
class Question {
	
	constructor(flatQuestion) {
		
		this.question = flatQuestion.question;
		this.answer = flatQuestion.answer;
		if(flatQuestion.snippet) this.snippet = flatQuestion.snippet.replace(/\\n/g, "\n");
		this.notAnswers = [];
		
		let i = 1;
		while(flatQuestion[`false${i}`]) {
			
			this.notAnswers.push(flatQuestion[`false${i}`]);
			i++;
		}
	}
}

export default class Quijit {
	
	constructor(csvObject) {
		
		this.remaining = [];
		csvObject.forEach(csvQuestion => {
			this.remaining.push(new Question(csvQuestion));
		});
		
		this.correct = [];
		this.incorrect = [];
		this.initNext();
		
	}
	
	loadNext() {
		
		// 1 - Choose random question
		const randomIndex = Math.floor(Math.random()*this.remaining.length);
		
		// 2 - Move from remaining to current 
		this.current = this.remaining.splice(randomIndex, 1)[0];
	}
	
	questionsRemain() {
			
		return (this.remaining.length > 0) ? true : false;
	
	}
	
	getResult() {
		
		this.result = {
			remaining: this.remaining.length,
			correct: this.correct.length,
			incorrect: this.incorrect.length,
			total: this.remaining.length + this.correct.length + this.incorrect.length
		}
		
		return this.result;
	}
	
	answerWasCorrect(isCorrect) {
		
		if (isCorrect) {
			this.correct.push(this.current);
		}
		else {
			this.incorrect.push(this.current);
		}


	}
	
	toggleCorrect() {
		
		if (this.next.contains === "all") {
			
			this.next.contains = "incorrect";
		} 
		else if (this.next.contains === "incorrect") {
			
			this.next.contains = "all";
		}
		else if (this.next.contains === "correct") {
			
			this.next.contains = "";
		}
		else if (this.next.contains === "") {
			
			this.next.contains = "correct";
		}
		
		this.setNextQuestions();
	}
	
	toggleIncorrect() {
		
		if (this.next.contains === "all") {
			
			this.next.contains = "correct";
		} 
		else if (this.next.contains === "incorrect") {
			
			this.next.contains = "";
		}
		else if (this.next.contains === "correct") {
			
			this.next.contains = "all";
		}
		else if (this.next.contains === "") {
			
			this.next.contains = "incorrect";
		}
		
		this.setNextQuestions();
	}
	
	setNextQuestions() {
		
		if (this.next.contains === "all") {
			
			this.next.questions = this.correct;
			this.next.questions = this.next.questions.concat(this.incorrect);
		} 
		else if (this.next.contains === "incorrect") {
			
			this.next.questions = this.incorrect;
		}
		else if (this.next.contains === "correct") {
			
			this.next.questions = this.correct;
		}
		else if (this.next.contains === "") {
			
			this.next.questions = [];
		}
		
		
	}
	
	restartWithNext() {
		this.remaining = this.next.questions;
		this.correct = [];
		this.incorrect = [];
	}
	
	initNext() {
		this.next = {
			contains: "",		// all, correct, incorrect, ""
			questions: []
		};
	}
}










