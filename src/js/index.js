import Quijit from "./models/Quijit.js";
// import Question from "./models/Question.js";

import * as overView from "./views/overView.js";
import * as csvView from "./views/csvView.js";
import * as questionView from "./views/questionView.js";

import Elements from "./models/Elements.js";
const el = new Elements();

/* 

	- Quijit Object
		- Contains 4 arrays of question objects
			- CVS loaded into remaining
			- Correctly & incorrectly answered questions
			- Currect question
			- Next round questions
		- Random Q chosen
		- Asked
		- Then moved into either correct or incorrect 
		- Until remaining is empty
	
	Quijit = {
	
		correct: [
			{
				question: "",
				(snippet: "",)
				answer: "";
				notAnswers: ["",...,""]
			},
			{...}
		],
		incorrect: [...],
		remaining: [...],
		next: {
			questions: [...],
			contains: "correct" | "incorrect" | "all" | ""
		}
	}
*/ 


const state = {};
state.hintTimeout = "";

window.el = el;
window.state = state;


const convert = () => {
	
	// 1 - Render form & get file element
	const fileInput = csvView.renderCSVForm(el.main);
	
	// 2 - Setup callback for csv data
	csvView.getCSV( fileInput, (csvFile) => {

		// 1 - Load CSV into Quijit
		const csvObject = csvView.getObjectArrayFromCSV(csvFile.content);
		state.quijit = new Quijit(csvObject);
	
		// 2 - Load first question
		nextQuestion();
		
		// Reset hash
		window.location.hash = "";
		
	});
};

const darkMode = () => {
	
	// 1. Toggle class
	overView.toggleDark(el.body);
	
	// 2. Reset hash
	window.location.hash = "";
	
};
const toggleHint = () => {

	// TODO: me
	
/*
	// 1. Toggle class
	overView.toggleHint(el.body);
*/
	
	// Reset hash
	window.location.hash = "";	
};

const nextQuestion = () => {
	
	// 0 - Update Progress
	overView.updateProgress(state.quijit.getResult(), el.counter);

	// If questions left
	if(state.quijit.questionsRemain()) {
		
		// 1 - Load next question
		state.quijit.loadNext();
		
		// 2 - Render Question
		questionView.renderQuestion(state.quijit.current, el.main);
		
		// 3 - Countdown to hint highlight
		clearTimeout(state.hintTimeout);
		state.hintTimeout = setTimeout(() => { 
			questionView.addHintStyle(el.main);
		}, 10000);
	}
	else {
		
		// 0 - Don't do hint timeout
		clearTimeout(state.hintTimeout);
		
		// 1 - Reset next
		state.quijit.initNext();
		
		// 2 - Render results
		// TODO: this too
		state.quijit.getResult();
		if (state.quijit.result.total > 0) {
			questionView.renderResult(state.quijit, el.main);
		}
				// TODO: this too
		else {
			console.log("asdasda");
			el.main.innerHTML = "<p>You selected no questions, load new CSV</p>";
		}	
	}
	
	// Reset hash
	window.location.hash = "";
		
};
const showCorrect = () => {
	
 	// Toggle correct 
 	state.quijit.toggleCorrect();
	
	// Re-render results
	questionView.renderResult(state.quijit, el.main);
	
	// Reset hash
	window.location.hash = "";
};
const showIncorrect = () => {
	
 	// Toggle incorrect 
 	state.quijit.toggleIncorrect();
	
	// Re-render results
	questionView.renderResult(state.quijit, el.main);
	
	// Reset hash
	window.location.hash = "";
};
const restart = () => {

	// 1 - Load next into remain
	state.quijit.restartWithNext();

	nextQuestion();
	
	// Reset hash
	window.location.hash = "";
	
};

const correct = () => {	
	state.quijit.answerWasCorrect(true);
	nextQuestion();
};
const incorrect = () => {
	state.quijit.answerWasCorrect(false);
	nextQuestion();
};

// Listener for haschange
window.onhashchange = () => {

	const hash = window.location.hash;

// 	if (hash === "") console.log("Action complete.")
	if (hash === el.hashes.load) convert();
	
	else if (hash === el.hashes.dark) darkMode();
	else if (hash === el.hashes.toggleHint) toggleHint();
	
	else if (hash === el.hashes.correct) correct();
	else if (hash === el.hashes.incorrect) incorrect();
	
	else if (hash === el.hashes.showCorrect) showCorrect();
	else if (hash === el.hashes.showIncorrect) showIncorrect();
	else if (hash === el.hashes.continue) restart();
	
	else {
// 		console.log("Error: Unknown Hash.");
	}
	
};
