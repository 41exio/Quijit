import Elements from "../models/Elements.js";
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
}

const getQuestion = (question) => {

	// 1 - Create DOM fragment
	const fragment = document.createRange().createContextualFragment('<div class="question"></div>');
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
		a.className = "answer";
		a.href = el.hashes.incorrect;
		answers.push(a);
	});

	// 5 - Shuffle array
	answers = shuffle(answers);
	
	// 6 - Add to fragment
	answers.forEach((answer) => {
		questionDiv.appendChild(answer);
	});
	
	return fragment;
	
};

export const renderQuestion = (question, element) => {

	// 0 - Clear main
	element.innerHTML = "";

	// 1 - Render
	element.appendChild(getQuestion(question));
};

export const renderResult = (quijit, element) => {

	// 0 - Clear main
	element.innerHTML = "";

	// 1 - Create DOM fragment
	const fragment = document.createRange().createContextualFragment('<div class="results"></div>');
	const resultsDiv = fragment.querySelector("div");

	// 1 - Add Summary
	const percent = Math.floor(quijit.result.correct/quijit.result.total*100);
	const pSummary = document.createElement("p");
	pSummary.textContent = `You got ${quijit.result.correct} correct, ${quijit.result.incorrect} wrong, out of a total of ${quijit.result.total}, which is a success rate of ${percent}%.Select questions to view or restart quiz with:`;
	resultsDiv.appendChild(pSummary);
	
	// 2 - Add nav
	
	// TODO: This and Quijit next is garbage
	
	const nav = document.createElement("nav");
	
	let navAs = '<a href="#continue">Continue</a>';

	if (quijit.next.contains === "all") {
		
		navAs = `<a class="active" href="#showCorrect">Correct</a><a class="active" href="#showIncorrect">Incorrect</a>${navAs}`;
	} 
	else if (quijit.next.contains === "incorrect") {
		
		navAs = `<a href="#showCorrect">Correct</a><a class="active" href="#showIncorrect">Incorrect</a>${navAs}`;
	}
	else if (quijit.next.contains === "correct") {
		
		navAs = `<a class="active" href="#showCorrect">Correct</a><a href="#showIncorrect">Incorrect</a>${navAs}`;
	}
	else if (quijit.next.contains === "") {
		
		navAs = `<a href="#showCorrect">Correct</a><a href="#showIncorrect">Incorrect</a>${navAs}`;
	}
	
	nav.innerHTML = navAs;
	const br = document.createElement("br");
	resultsDiv.appendChild(br);
	resultsDiv.appendChild(nav);
	
	// Render
	element.appendChild(fragment);
	
	// 3 - Add Questions
	quijit.next.questions.forEach( question => {
		const br = document.createElement("br");
		element.appendChild(br);
		element.appendChild(getQuestion(question));
	});
	
	// TODO: really fix this crap
	
	for (const tag of document.getElementsByTagName("a")) {
		
		if (tag.className === "answer") {
			tag.href = "#";
		}
		else if (tag.className === "correctAnswer") {
			tag.href = "#";
			tag.style.fontWeight = "bold";
		}
	}

	
};

export const addHintStyle = (element) => {

	element.firstChild.classList.add("hint");
	
};
