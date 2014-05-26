//TODO: Make sure that if each numWord is the best possible one given the words already chosen.


function spaceNotTaken(index, length, takenList, newTakenList){
	//Determines whether indices of the number are used or not, and assings newTakenList to be the new takenList.
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
		var subset = text.slice(index, index + size);

		if (keyList.indexOf(subset) > -1){
			subsetList.push([subset, index]);
		}
	}

	return subsetList;
}





function makeAllSubsets(text){
	//creates all subsets of any size from the given text
	var subsetList = [];

	for (var size = 1; size <= text.length; size++){
		subsetList = subsetList.concat(makeSubsets(text, size));
	}

	return subsetList;
}




function convertNum(subsets, number, numList, takenList){
	//Better idea: for each recur, you hae a base case where you return nothing. The base case activates
	//if no words can be inserted. Each recur returns (next recur + new word + next recur)
	var tempTakenList = takenList.slice(0);
	var endCheck = 1;

	for (var i = 0; i < subsets.length; i++){ //for each subset
		var takenList = tempTakenList.slice(0);
		var pair = subsets[i];
		var num = pair[0];
		var index = pair[1];

		if (spaceNotTaken(index, num.length, takenList)){ //if the space for the words connected to the num has not been used
			endCheck = 0;

			for (var x = 0; x < numWordDict[num].length; x++){ //for each word connected to num
				var word = numWordDict[num][x]
				var newCombo = number.slice(0, index) + word + number.slice(index + word.length);

				if (numList.indexOf(newCombo) < 0){
					convertNum(subsets, newCombo, numList, takenList.slice(0));
				}
			}

		}
	}
	if (endCheck == 1){
		numList.push(number);
	}

}




//New functions: 
//convertNum takes subsets, numList, takenList, number
//assigns starting words to put into number
//other function takes words, continues along that path
//Only returns fully modified numWords.
//returns new numList, + all words that it used so that they aren't repeated.


/*function convertNum(subsets, number, numList, takenList){

for subsets:
	getNumWord(subset, subsets, takenList, numList);*/





function isNum(text){
	//Takes in a string, and returns 1 if the characters of the strings are all numbers, and returns 0 otherwise.
	var nums = "1234567890";
	for(index = 0; index < text.length; index++){
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
					curId = count.toString();
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
					curId = count.toString();
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
	var box = document.getElementById("outputBox");
	box.innerHTML = "";
	var input = document.getElementById("numInput");
	var phoneNumber = String(input.value);
	var keyList = Object.keys(numWordDict);
	var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	var numList = [];
	var subsets = makeAllSubsets(phoneNumber);
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

/*function wordToNum(){
	var box = document.getElementById("outputBox");
	box.innerHTML = "";
	var input = document.getElementById("wordInput");
	var word = String(input.value);
	word = word.toUpperCase();
	var keyList = Object.keys(numWordDict);

	for (var keyInd = 0; keyInd < keyList.length; keyInd++){
		//alert("WHAT DA FUQ?");
		var checkArray = numWordDict[keyList[keyInd]];
		for (var checkInd = 0; checkInd < checkArray.length; checkInd++){
			var check = checkArray[checkInd];
			if (check == word){
				var parag = document.createElement("pre");
				box.appendChild(parag);
				parag.style.cssFloat = "left";
				parag.style.color = "red";
				parag.innerHTML = keyList[keyInd].toString();
				box.style.visibility = "visible";
				return;
			}
		}
	}
}*/

function wordToNum(){
	var box = document.getElementById("outputBox");
	box.innerHTML = "";
	var input = document.getElementById("wordInput");
	var word = String(input.value);
	word = word.toUpperCase();
	numLetDict = 	{"A": "2", "B": "2", "C": "2", "D": "3",
	       		"E": "3", "F": "3", "G": "4", "H": "4", 
			"I": "4", "J": "5", "K": "5", "L": "5", 
			"M": "6", "N": "6", "O": "6", "P": "7", 
			"Q": "7", "R": "7", "S": "7", "T": "8", 
			"U": "8", "V": "8", "W": "9", "X": "9", 
			"Y": "9", "Z": "9"}
	newNum = "";
	for (ind = 0; ind < word.length; ind++){
		letter = word[ind];
		newNum = newNum.concat(numLetDict[letter]);
		console.log("SHIT ASS FUCK");
	}
	var parag = document.createElement("pre");
	box.appendChild(parag);
	parag.style.cssFloat = "left";
	parag.style.color = "red";
	parag.innerHTML = newNum;
	box.style.visibility = "visible";
	return;
}
