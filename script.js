//trending song section
async function getTrendingSongs() {
	let trendingSongsJson = await fetch("trendingSongs.json");
	let trendingSongsList = await trendingSongsJson.json();

	//find container
	let containerHeading = document.getElementsByClassName(
		"trending-songs-cards",
	)[0];
	if (!containerHeading) {
		console.error(
			"CRITICAL ERROR: JavaScript cannot find '.trending-songs-cards' in the HTML!",
		);
		return;
	}

	//loop
	trendingSongsList.forEach((element) => {
		console.log(`Adding song #: ${element.heading}`);
		let trendingCard = document.createElement("div");
		trendingCard.className = element.class;
		trendingCard.innerHTML = `<img src="${element.image}" class="card-image"> 
                                <button
									type="button"
									class="play-button"
									src="${element.song}">
									▶
								</button> <h3>${element.heading}</h3> <p>${element.artist}</p>`;
		containerHeading.append(trendingCard);
	});
}

//other sections cards
async function displayCards(
	cardsJsonLink,
	containerClass,
	imageClass,
	pElement,
) {
	//get resources
	let cardsJson = await fetch(cardsJsonLink);
	let cardsList = await cardsJson.json();
	console.log(`${cardsJsonLink} was loaded`);
	let container = document.getElementsByClassName(containerClass)[0];
	if (!container) {
		console.error(
			`CRITICAL ERROR: JavaScript cannot find ${containerClass} in the HTML!`,
		);
		return;
	}
	//loop dom for each card
	cardsList.forEach((element) => {
		console.log(`Adding card #: ${element.id}`);
		let Card = document.createElement("div");
		Card.className = "card";
		Card.innerHTML = `<img src="${element.image}" class=${imageClass}> 
                                <button
									type="button"
									class="play-button">
									▶
								</button> <h3>${element.name}</h3> <p>${pElement}</p>`;
		container.append(Card);
	});
}

async function main() {
	console.log("JavaScript starts");
	//trending-songs cards
	await getTrendingSongs();
	//popular-artists cards
	await displayCards(
		"popularArtists.json",
		"popular-artists-cards",
		"circular-card-image",
		"Artist",
	);
	//popular-radio cards
	await displayCards(
		"popularRadio.json",
		"popular-radio-cards",
		"card-image",
		"Radio",
	);
	console.log("all cards successfully loaded");
}

main();
