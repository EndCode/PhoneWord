from string import*

def convertWords(srcFile, destFile):
	newDict = []
	numWordDict = {}
	wordNumConverter = {'A':'2', 'B':'2', 'C':'2', 'D':'3', 'E':'3', 'F':'3', 'G':'4', 'H':'4', 'I':'4', 'J':'5', 'K':'5', 'L':'5', 'M':'6', 'N':'6', 'O':'6', 'P':'7', 'Q':'7', 'R':'7', 'S':'7', 'T':'8', 'U':'8', 'V':'8', 'W':'9', 'X':'9', 'Y':'9', 'Z':'9'}
	readfile = open(srcFile, "r")

	dictFirst = readfile.readlines()

	for line in dictFirst:
		newDict.append(line.replace("\n", ""))

	for word in newDict:
		num = ""

		for letter in word:
			num += wordNumConverter[letter]
		
		if num not in numWordDict.keys():
			numWordDict[num] = []

		numWordDict[num].append(word)

	writeFile = open(destFile, "w")
	writeFile.write(str (numWordDict))
	'''
	for key in numWordDict.keys():
		wordList = ""

		for word in numWordDict[key]:
			wordList += ("'" + word + "'")
			if word != numWordDict[key][-1]:
				wordList += ", "

		writeFile.write ("var var" + str(key) + " = [" + wordList + "]" + "\n")
	'''
	writeFile.close()

convertWords("/Users/Luke/Desktop/webdev/other/words.txt", "/Users/Luke/Desktop/webdev/js/phoneDictVar.js")
