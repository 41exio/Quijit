import Question from "./models/Question.js";

import * as overView from "./views/overView.js";
import * as csvView from "./views/csvView.js";
import * as questionView from "./views/questionView.js";

import Elements from "./models/Elements.js";
const el = new Elements();

const state = {};
const initResult = () => {
	state.result = {
		correct: 0,
		incorrect: 0,
		total: 0
	};
};
initResult()
state.hintTimeout = "";

/*
window.el = el;
window.state = state;

*/

const convert = () => {
	
	// 0 - Reset counters
	initResult();
	
	// 1 - Render form & get file element
	const fileInput = csvView.renderCSVForm(el.main);
	
	// 2 - Setup callback for csv data
	csvView.getCSV( fileInput, (csvFile) => {
		
		// 1 - Get questions as object
		state.csvObject = csvView.getObjectArrayFromCSV(csvFile.content);
		
		// 2 - Create remaining questions
		state.remaining = [];
		state.csvObject.forEach(csvQuestion => {
			state.remaining.push(new Question(csvQuestion));
		});
	
		// 3 - Render success
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
	const progress = {
		correct: state.result.correct,
		incorrect: state.result.incorrect,
		remaining: state.remaining.length
	};
	overView.updateProgress(progress, el.counter);

	// If questions left
	if(state.remaining && state.remaining.length > 0 ) {
		
		// 1 - Choose random question and remove from array
		const randomIndex = Math.floor(Math.random()*state.remaining.length);
		state.current = state.remaining.splice(randomIndex, 1)[0];
		
		// 2 - Render Question
		questionView.renderQuestion(state.current, el.main);
		
		// 3 - Countdown to hint highlight
		clearTimeout(state.hintTimeout);
		state.hintTimeout = setTimeout(() => { 
			questionView.addHintStyle(el.main);
		}, 10000);
	}
	else {
		
		// 1 - Render results
		questionView.renderResult(state.result, el.main);
	
		// 2 - Reset counters
		initResult();
	}
	
	// Reset hash
	window.location.hash = "";
		
};
const correct = () => {	
	state.result.correct++;
	state.result.total++;
	nextQuestion();
};
const incorrect = () => {
	state.result.incorrect++;
	state.result.total++;
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
	else {
// 		console.log("Error: Unknown Hash.");
	}
	
};
