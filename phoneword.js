//TODO: change spaceNotTaken and convertNum

window.onload = function() {
 
    alert( "welcome" );
 
}

function spaceNotTaken(index, length, takenList){
	//Determines whether indices of the number are used or not.
	for (var i = index; i < index + length;  i++){
		if (takenList.indexOf(i) > -1){
			return false;
		}
	}

	for (var i = index; i < index + length;  i++){
		takenList.push(i);
	}
	return true
}





function makeSubsets(text, size){
	//creates subsets from the given text of the given size
	var keyList = Object.keys(numWordDict);
	var textLength = text.length;
	var usableLength = textLength - size;
	var subsetList = [];


	for (var index = 0; index <= usableLength; index++){
		var numSubset = text.slice(index, index + size);
		
		if (keyList.indexOf(numSubset) > -1){

			for (var i = 0; i < numWordDict[numSubset].length; i++){
				var word = numWordDict[numSubset][i];
				var subset = [word, index];
				subsetList.push(subset);
			}
		}
	}

	return subsetList;
}





function makeAllSubsets(text){
	//creates all subsets of any size from the given text
	//Returns a list of lists, where each contained list has a string as the first elements and an index of its place in the number as the second.
	//Confirmed working
	var subsetList = [];

	for (var size = 1; size <= text.length; size++){
		subsetList = subsetList.concat(makeSubsets(text, size));
	}

	return subsetList;
}




function reduceSubsets(subsets){
	// Not all subsets are needed. For example, the subset "a" is not needed if you have the subset "ad" in the same place.
	// Confirmed functioning
	var subsetIndices = [];
	var newSubsets = [];

	for (var index = 0; index < subsets.length; index++){
		subset = subsets[index];
		bigWord = subset[0];
		bigStart = subset[1];
		bigEnd = bigStart + bigWord.length;
		
		for (var ind = 0; ind < subsets.length; ind++){
			smallSubset = subsets[ind];
			smallWord = smallSubset[0];
			smallStart = smallSubset[1];
			smallEnd = smallStart + smallWord.length;

			if ((bigWord.indexOf(smallWord) > -1) && (bigWord != smallWord)){	
				if ((bigStart <= smallStart) && (bigEnd >= smallEnd)){
					subsetIndices.push(ind);
				}
			}
		}
	}

	for (var i = 0; i < subsets.length; i++){
		if (!(subsetIndices.indexOf(i) > -1)){
			newSubsets.push(subsets[i]);
		}
	}

	return newSubsets;
}




function convertNum(subsets, number, numList, takenList){
	//FIIIIIXXX Subsets format changed
	//Given the subsets from makeAllSubsets, makes all the possible numWords.
	var tempTakenList = takenList.slice(0);
	var endCheck = 1;

	for (var i = 0; i < subsets.length; i++){ //for each subset
		var takenList = tempTakenList.slice(0);
		var pair = subsets[i];
		var word = pair[0];
		var index = pair[1];

		if (spaceNotTaken(index, word.length, takenList)){ //if the space for the words connected to the num has not been used
			endCheck = 0;
			takenList.slice(i, 1) // Fix syntax
			// At this point, can you remove the subset?
			var newCombo = number.slice(0, index) + word + number.slice(index + word.length);

			if (numList.indexOf(newCombo) < 0){
				convertNum(subsets, newCombo, numList, takenList.slice(0));
			}

		}
	}

	if (endCheck == 1){
		numList.push(number);
	}

}





function isNum(text){
	//Takes in a string, and returns 1 if the characters of the strings are all numbers, and returns 0 otherwise.
	var nums = "1234567890";
	for(var index = 0; index < text.length; index++){
		if (nums.indexOf(text[index]) < 0){
			return 0;
		}
	}

	return 1
}





function colorCode(numList){
	//breaks the numList into two lists, each containing lists of 3 elements: A number or word, its position in the numList, and whether it is the end of a numWord.
	//Returns words and nums.	

	var words = [];
	var nums = [];
	var wrapper = [words, nums]; //Arranged this way so that I can easily place strings or nums into one or the other.
	var count = 0;

	for (var i = 0; i < numList.length; i++){
		var numWord = numList[i];
		var last = 0;
		var check = isNum(numWord[0]);

		for (var letter = 0; letter < numWord.length; letter++){

			if (!(isNum(numWord[letter]) == check)){
				var section = numWord.slice(last, letter);
				console.log(["check", check, "letter", letter, "last", last, "numWord", numWord]);
				wrapper[check].push([section, count, 0]); //If that last bit is 0, the section is not at the end.
				last = letter;
				check = isNum(numWord[letter]);
				console.log(["Addition", [section, count, 0], "New Last", last]);
				count += 1;
			}

			if (letter == numWord.length - 1){
				var section = numWord.slice(last);
				wrapper[check].push([section, count, 1]);
				console.log(["EndAddition", [section, count, 1]]);
				count += 1;
			}
		}
	}
	return [words, nums];


}





function applyToDoc(words, nums, container){
	//Arranges the strings relative to each other to be readable.
	//Returns nothing.
	//
	//
	//
	//ASSIGN IDS TO EACH NEW UNITDIV. KEEP THEM AS VARIABLES. USE VARIABLE TO ASSIGN PRES AS CHILDREN.
	var count = 0;	
	var endCheck = 1;
	var curId = "";

	while (count < words.length + nums.length){

		for (var word = 0; word < words.length; word++){

			if (words[word][1] == count){
				if (endCheck == 1){
					curId = "a" + count.toString();
					console.log(curId)
					var unitDiv = document.createElement("div");
					unitDiv.id = curId;
					unitDiv.className = "unitDivs";
					container.appendChild(unitDiv);
					endCheck = 0;
				}

				var parag = document.createElement("pre");
				document.getElementById(curId).appendChild(parag);
				parag.style.color = "green";
				parag.style.cssFloat = "left";
				parag.style.margin = "0px";
				parag.innerHTML = words[word][0];

				if (words[word][2] == 1){
					endCheck = 1;
				}
				count ++;
			}
		}

		for (var num = 0; num < nums.length; num++){

			if (nums[num][1] == count){

				if (endCheck == 1){
					curId = "a" + count.toString();
					console.log(curId);
					var unitDiv = document.createElement("div");
					unitDiv.id = curId;
					unitDiv.className = "unitDivs";
					container.appendChild(unitDiv);
					endCheck = 0;
				}

				var parag = document.createElement("pre");
				document.getElementById(curId).appendChild(parag);
				parag.style.color = "red";
				parag.style.cssFloat = "left";
				parag.style.margin = "0px";
				parag.innerHTML = nums[num][0];

				if (nums[num][2] == 1){
					endCheck = 1;
				}
				count ++;
			}
		}
	}
}





function phoneWord(){
	//Wrapper function that is called by the page
	var box = document.getElementById("outputBox");
	box.innerHTML = "";
	var input = document.getElementById("numInput");
	var phoneNumber = String(input.value);
	var keyList = Object.keys(numWordDict);
	var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	var numList = [];
	var subsets = makeAllSubsets(phoneNumber);
	subsets = reduceSubsets(subsets);
	var takenList = [];
	var newTakenList = [];


	for (var i = 0; i < phoneNumber.length; i++){
		var character = phoneNumber.charAt(i);

		if (!(character in nums)){
			alert("Please enter a valid phone number, using only numbers.");
			return;
		}
	}

	convertNum(subsets, phoneNumber, numList, takenList, newTakenList);
	var result = colorCode(numList);
	var words = result[0];
	var num = result[1];
	console.log(["FINAL words", words, "FINAL nums", num]);
	applyToDoc(words, num, box);
	//var newNumsString = numList.join("\n");
	//text.innerHTML = newNumsString;
	box.style.visibility = "visible";
	return;
}





function wordToNum(){
	// Converts a given word to its corresponding phone number through a letter:number dictionary
	var box = document.getElementById("outputBox");
	box.innerHTML = "";
	var input = document.getElementById("wordInput");
	var word = String(input.value);
	word = word.toUpperCase();
	var numLetDict = 	{"A": "2", "B": "2", "C": "2", "D": "3",
	       		"E": "3", "F": "3", "G": "4", "H": "4", 
			"I": "4", "J": "5", "K": "5", "L": "5", 
			"M": "6", "N": "6", "O": "6", "P": "7", 
			"Q": "7", "R": "7", "S": "7", "T": "8", 
			"U": "8", "V": "8", "W": "9", "X": "9", 
			"Y": "9", "Z": "9"}
	var newNum = "";

	for (var ind = 0; ind < word.length; ind++){
		var letter = word[ind];
		newNum = newNum.concat(numLetDict[letter]);
	}
	var parag = document.createElement("pre");
	parag.id = "wordTranslate";
	box.appendChild(parag);
	parag.style.cssFloat = "left";
	parag.style.color = "red";
	parag.innerHTML = newNum;
	box.style.visibility = "visible";
	return;
}
