// Expects array of objects with properties: question, answer, false[1-N]
export default class Question {
	
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