export const copyObject = (originalObject) => {
	if (originalObject) return JSON.parse(JSON.stringify(originalObject));
	return;
};

export const shuffleArray = (array) => {
	let currentIndex = array.length;

	while (currentIndex !== 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
};
