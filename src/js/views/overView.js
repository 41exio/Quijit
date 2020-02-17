export const toggleDark = (element) => {
	element.classList.toggle("dark");
};

export const updateProgress = (progress, element) => {
	
	element.correct.textContent = progress.correct;
	element.incorrect.textContent = progress.incorrect;
	element.remaining.textContent = progress.remaining;
		
};