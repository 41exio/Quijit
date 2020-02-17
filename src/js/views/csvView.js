export const getCSV = (fileInput, callback) => {

	const csvFile = {};

	// 2 - Listen for loaded file
	fileInput.onchange = () => {
		
	
		// 3 - Get file metadata
		const fileMeta = fileInput.files[0];
	
		// 4 - Check correct type
		if (fileMeta.type === "text/csv") {
			
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

export const getObjectArrayFromCSV = (csvString) => {

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

export const renderCSVForm = (element) => {
	
	element.innerHTML = '<input type="file" id="fileInput" name="file" accept=".csv">';
	return element.firstChild;
	
};


