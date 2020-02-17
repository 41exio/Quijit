(function () {
	'use strict';

	// Expects array of objects with properties: question, answer, false[1-N]
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

	const toggleDark = (element) => {
		element.classList.toggle("dark");
	};

	const updateProgress = (progress, element) => {
		
		element.correct.textContent = progress.correct;
		element.incorrect.textContent = progress.incorrect;
		element.remaining.textContent = progress.remaining;
			
	};

	const getCSV = (fileInput, callback) => {

		const csvFile = {};

		// 2 - Listen for loaded file
		fileInput.onchange = () => {
			
		
			// 3 - Get file metadata
			const fileMeta = fileInput.files[0];
		
			// 4 - Check correct type
			if (fileMeta.type === "text/csv" || fileMeta.type === "application/vnd.ms-excel") {
				
				// 5 - Set up FileReader and listen for file being read
				const fileReader = new FileReader();
				fileReader.onload = () => { 
				
					csvFile.content = fileReader.result;
					csvFile.name = fileMeta.name.replace(/\.[^\.]+$/, "");	// Remove extension
					
					// 6 - PROMISE or promise would be better callback hell
					callback(csvFile);
				};
				
				// 5a - Read file as text and trigger callback
				fileReader.readAsText(fileMeta);
				
			}
			else {
				console.log("Error: File type not accepted.");
			}
		};
	};

	const getObjectArrayFromCSV = (csvString) => {

		// https://stackoverflow.com/questions/59218548/what-is-the-best-way-to-convert-from-csv-to-json-when-commas-and-quotations-may/59219146
		const regex = /(?:[\t ]?)+("+)?(.*?)\1(?:[\t ]?)+(?:,|$)/gm;
		const cutlast = (_, i, a) => i < a.length - 1;	

		// 0 - Fix for Windows "\r\n" newlines
		csvString = csvString.replace(/[\r]/g, "");

		// 1 - Get array of lines	
		const lines = csvString.split("\n");
		
		// 2 - Remove first line into headers, match regex and non-empty as properties, remove commas
		const headers = lines.splice(0, 1)[0].match(regex).filter(h => h.length > 1);	
		for (let i = 0; i < headers.length-1; i++) {
			headers[i] = headers[i].slice(0, -1);
		}
		
		// 3 - Get Values
		const array = [];
		for (const line of lines) {
			
			const val = {};
			for (const [i, m] of [...line.matchAll(regex)].filter(cutlast).entries()) {
				
				val[headers[i]] = (m[2].length > 0) ? m[2] : null;
			  
			}
			if(Object.keys(val).length > 0) array.push(val);
		}
		
		return array;
	};

	const renderCSVForm = (element) => {
		
		element.innerHTML = '<input type="file" id="fileInput" name="file" accept=".csv">';
		return element.firstChild;
		
	};

	class Elements {
		
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
				
			};

		}
		
	}

	const el = new Elements();

	const shuffle = (array) => {
		
		let currentIndex = array.length;
		
		// While elements remain to be shuffled
		while (currentIndex !== 0) {
		
			// 1 - Pick an element
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			
			// 2 - Swap with current element
			const oldValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = oldValue;
		
		}
		return array;
	};

	const renderQuestion = (question, element) => {

		// 0 - Clear main
		element.innerHTML = "";

		// 1 - Create DOM fragment
		const fragment = document.createRange().createContextualFragment('<div id="questionDiv"></div>');
		const questionDiv = fragment.querySelector("div");

		// 2 - Add Question
		const h2 = document.createElement("h2");
		h2.textContent = question.question;
		questionDiv.appendChild(h2);
		
		// 2 - Check for snippet
		if(question.snippet) {
			const pre = document.createElement("pre");
			pre.textContent=question.snippet;
			questionDiv.appendChild(pre);
		}

		// 3 - Add correct answer to answers array
		let answers = [];
		const correct = document.createElement("a");
		correct.textContent = question.answer;
		correct.className = el.classes.correct;
		correct.href = el.hashes.correct;
		answers.push(correct);
		
		// 4 - Add incorrect answers
		question.notAnswers.forEach(wrongAnswer => {
			const a = document.createElement("a");
			a.textContent = wrongAnswer;
			a.className = "";
			a.href = el.hashes.incorrect;
			answers.push(a);
		});

		// 5 - Shuffle array
		answers = shuffle(answers);
		
		// 6 - Add to fragment
		answers.forEach((answer) => {
			questionDiv.appendChild(answer);
		});
		
		// 7 - Render
		element.appendChild(fragment);
	};

	const renderResult = (result, element) => {
		
		const percent = Math.floor(result.correct/result.total*100);
		
		element.innerHTML = "<p></p>";
		element.firstChild.textContent = `You got ${result.correct} correct, ${result.incorrect} wrong, out of a total of ${result.total}, which is a success rate of ${percent}%`;
		
	};

	const addHintStyle = (element) => {

		element.firstChild.classList.add("hint");
		
	};

	const el$1 = new Elements();

	const state = {};
	const initResult = () => {
		state.result = {
			correct: 0,
			incorrect: 0,
			total: 0
		};
	};
	initResult();
	state.hintTimeout = "";

	window.el = el$1;
	window.state = state;

	const convert = () => {
		
		// 0 - Reset counters
		initResult();
		
		// 1 - Render form & get file element
		const fileInput = renderCSVForm(el$1.main);
		
		// 2 - Setup callback for csv data
		getCSV( fileInput, (csvFile) => {
			
			// 1 - Get questions as object
			state.csvObject = getObjectArrayFromCSV(csvFile.content);
			
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
		toggleDark(el$1.body);
		
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
		updateProgress(progress, el$1.counter);

		// If questions left
		if(state.remaining && state.remaining.length > 0 ) {
			
			// 1 - Choose random question and remove from array
			const randomIndex = Math.floor(Math.random()*state.remaining.length);
			state.current = state.remaining.splice(randomIndex, 1)[0];
			
			// 2 - Render Question
			renderQuestion(state.current, el$1.main);
			
			// 3 - Countdown to hint highlight
			clearTimeout(state.hintTimeout);
			state.hintTimeout = setTimeout(() => { 
				addHintStyle(el$1.main);
			}, 10000);
		}
		else {
			
			// 1 - Render results
			renderResult(state.result, el$1.main);
		
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
		if (hash === el$1.hashes.load) convert();
		else if (hash === el$1.hashes.dark) darkMode();
		else if (hash === el$1.hashes.toggleHint) toggleHint();
		else if (hash === el$1.hashes.correct) correct();
		else if (hash === el$1.hashes.incorrect) incorrect();
		
	};

}());
