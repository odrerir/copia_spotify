const songName = document.getElementById("song-name");
const artistName = document.getElementById("artist-name");
const cover = document.getElementById("cover");
const song = document.getElementById("audio");
const play = document.getElementById("play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("suffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");
const likeButton = document.getElementById("like");

let isPlaying = false;
let isShuffled = false;
let isRepeated = false;

const aBanda = { 
    songName: "A Banda", 
    artistName: "Chico Buarque", 
    cover: "images/Chico-Buarque-de-Hollanda.jpg",
    song: "music/A Banda - Chico Buarque.mp3" ,
    like: false,
};

const obladiOblada = {
    songName: "Ob-La-Di, Ob-La-Da", 
    artistName: "The Beatles", 
    cover: "images/beatles.jpg",
    song: "music/Ob-La-Di-Ob-La-Da - The Beatles.mp3",
    like: true,
};

const poisonHeart = {
    songName: "Poison Heart", 
    artistName: "The Ramones", 
    cover: "images/ramones.png",
    song: "music/Poison Heart - The Ramones.mp3",
    like: false,
};
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [aBanda, obladiOblada, poisonHeart];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong() {
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseSong();
    } else {
        playSong();
    }
}

function likedButtonRender(){
    if (sortedPlaylist[index].like === false){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.remove("light-color");
        likeButton.classList.add("button-active");
    }
    else{
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.add("light-color");
        likeButton.classList.remove("button-active");
    }
}

function initializeSong() {
    songName.textContent = sortedPlaylist[index].songName;
    artistName.textContent = sortedPlaylist[index].artistName;
    cover.src = sortedPlaylist[index].cover;
    song.src = sortedPlaylist[index].song;
    likedButtonRender();
}

function previousSong() {
    index--;
    if (index < 0 && index != null) {
        index = sortedPlaylist.length - 1;
    }
    initializeSong();
    playSong();
}

function nextSong() {
    index++;
    if (index >= sortedPlaylist.length && index != null) {
        index = 0;
    }
    initializeSong();
    playSong();
}

function shuffleArray(preShuffleArray) {
    let size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex--;
    }
}

function shuffleButtonClicked() {
    if(isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add("button-active");
    }
    else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove("button-active");
    }
}

function repeatButtonClicked() {
    if(isRepeated === false) {
        isRepeated = true;
        repeatButton.classList.add("button-active");
    }
    else {
        isRepeated = false;
        repeatButton.classList.remove("button-active");
    }
}

function nextOrRepeat() {
    if(isRepeated === false) {
        nextSong();
    }
    else {
        playSong();
    }
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`);
    songTime.innerText = toMMSS(song.currentTime);
}

function toMMSS(originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600)/60);
    let secs = Math.floor(originalNumber - hours* 3600 - min * 60); 

    return `${min.toString().padStart(2,'0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTime(){
    totalTime.innerText = toMMSS(song.duration);
}

function likedButtonClicked(){
    if(sortedPlaylist[index].like === false){
        sortedPlaylist[index].like = true;
    }
    else {
        sortedPlaylist[index].like = false;
    }
    likedButtonRender();
    localStorage.setItem(
        'playlist', 
        JSON.stringify(originalPlaylist)
    );
}

initializeSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime)
progressContainer.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click",repeatButtonClicked);
likeButton.addEventListener("click", likedButtonClicked)