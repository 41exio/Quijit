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

export const renderQuestion = (question, element) => {

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

export const renderResult = (result, element) => {
	
	const percent = Math.floor(result.correct/result.total*100);
	
	element.innerHTML = "<p></p>";
	element.firstChild.textContent = `You got ${result.correct} correct, ${result.incorrect} wrong, out of a total of ${result.total}, which is a success rate of ${percent}%`;
	
};

export const addHintStyle = (element) => {

	element.firstChild.classList.add("hint");
	
};




