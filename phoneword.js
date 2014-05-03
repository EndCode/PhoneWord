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
	var tempTakenList = takenList.slice(0);

	for (var i = 0; i < subsets.length; i++){ //for each subset
		var takenList = tempTakenList.slice(0);
		var pair = subsets[i];
		var num = pair[0];
		var index = pair[1];

		if (spaceNotTaken(index, num.length, takenList)){ //if the space for the words connected to the num has not been used

			for (var x = 0; x < numWordDict[num].length; x++){ //for each word connected to num
				var word = numWordDict[num][x]
				var newCombo = number.slice(0, index) + word + number.slice(index + word.length);

				if (numList.indexOf(newCombo) < 0){
					numList.push(newCombo);
					convertNum(subsets, newCombo, numList, takenList.slice(0));
				}
			}
		}
	}
}

function phoneWord(){
	var box = document.getElementById("outputBox");
	var text = document.getElementById("outputPre");
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
	console.log(numList);
	var newNumsString = numList.join("\n");
	text.innerHTML = newNumsString;
	box.style.visibility = "visible";
	return;
}
