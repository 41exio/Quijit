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
		return {
			remaining: this.remaining.length,
			correct: this.correct.length,
			incorrect: this.incorrect.length,
			total: this.remaining.length + this.correct.length + this.incorrect.length
		}
	}
	
	answerWasCorrect(isCorrect) {
		
		if (isCorrect) {
			this.correct.push(this.current);
		}
		else {
			this.incorrect.push(this.current);
		}


	}
	
}

