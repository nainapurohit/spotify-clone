let currentAudioId = 0;
let currentAudio = new Audio();
currentAudio.addEventListener("loadedmetadata", () => {
	document
		.querySelector(".prog-bar")
		.setAttribute("max", `${currentAudio.duration}`);
});
currentAudio.addEventListener("timeupdate", () => {
	document.querySelector(".prog-bar").value = currentAudio.currentTime;
});

//===========================trending song section=======================
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
		trendingCard.id = element.id;
		trendingCard.innerHTML = `<img src="${element.image}" class="card-image"> 
                                <button
									type="button"
									class="play-button trending-songs-play-btn"
									src="${element.song}">
									▶
								</button> <h3>${element.heading}</h3> <p>${element.artist}</p>`;
		containerHeading.append(trendingCard);
	});
	return trendingSongsList;
}

//======================other sections cards===========================
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

//=================================Audio handling========================
function playSong(songsList, id) {
	let songName, source, img, artist;
	if (id < 1) id = songsList.length;
	if (id > songsList.length) id = 1;
	if (currentAudioId != id) {
		currentAudioId = id;
		songsList.forEach((song) => {
			if (song.id == id) {
				songName = song.heading;
				source = song.song;
				img = song.image;
				artist = song.artist;
			}
		});
		document.querySelector(".playbar-thumbnail").setAttribute("src", `${img}`);
		document.querySelector(".playbar-song-name").innerHTML = `${songName}`;
		document.querySelector(".playbar-artist-name").innerHTML = `${artist}`;
		currentAudio.pause();
		currentAudio.src = source;
		currentAudio.play();
		// if (clickedBtn) clickedBtn.innerText = "⏸";
		document.querySelector(".playbar-pause-button").innerText = "⏸";
		switchButton = 1;
	}
}

//================================MAIN=============================
async function main() {
	console.log("JavaScript starts");
	//trending-songs cards
	let songsList = await getTrendingSongs();
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

	//adding event listeners:
	let buttons = document.querySelectorAll(".trending-songs-play-btn");
	buttons.forEach((button) => {
		button.addEventListener("click", () =>
			playSong(songsList, button.parentElement.id),
		);
	});

	let volBar = document.querySelector(".vol-bar");
	volBar.addEventListener("input", () => (currentAudio.volume = volBar.value));

	document
		.querySelector(".prog-bar")
		.addEventListener(
			"input",
			() =>
				(currentAudio.currentTime = document.querySelector(".prog-bar").value),
		);

	document
		.querySelector(".playbar-prev-button")
		.addEventListener("click", () => {
			playSong(songsList, Number(currentAudioId) - 1);
		});

	document
		.querySelector(".playbar-next-button")
		.addEventListener("click", () => {
			playSong(songsList, Number(currentAudioId) + 1);
		});

	playPause = document.querySelector(".playbar-pause-button");
	playPause.addEventListener("click", () => {
		if (currentAudio.paused) {
			currentAudio.play();
			document.querySelector(".playbar-pause-button").innerText = "⏸";
		} else {
			currentAudio.pause();
			document.querySelector(".playbar-pause-button").innerText = "▶";
		}
	});
}

main();
