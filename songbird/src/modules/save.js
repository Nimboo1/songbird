import "@babel/polyfill";
import "./index.html";
import "./styles.scss";
import "./scss/_adaptive.scss";
import birdsData from "./modules/birds.js"


const header = document.querySelector(".header");
const intro = document.querySelector(".intro");
const quiz = document.querySelector(".quiz");
const footer = document.querySelector(".footer");
const winAudio = document.querySelector(".win-sound");
const loseAudio = document.querySelector(".lose-sound");
const quizLink = document.querySelector(".nav__item:first-child");
const quizBtn = document.querySelector(".intro__button");
let answers = document.querySelectorAll(".answer-block__item");
const nextBtn = document.querySelector(".quiz-footer__button");
const score = document.querySelector(".quiz-footer__score");

const quizImg = document.querySelector(".bird-quiz__img");
const infoImg = document.querySelector(".selected-bird__img");
const birdContent = document.querySelector(".selected-bird__content");
const birdInfo = document.querySelector(".selected-bird__info");
const birdTitle = document.querySelectorAll(".quiz__title");
const birdInfoSub = document.querySelector(".selected-bird__subtitle");

let categories = document.querySelectorAll(".quiz__category-name");
const win = document.querySelector(".win");
let birdsGroup;
let trueBird;
let points;
let pointsSum = 0;


quizLink.addEventListener("click", quizStart);
quizBtn.addEventListener("click", quizStart);

winAudio.volume = 0.05;
loseAudio.volume = 0.05;
loseAudio.playbackRate = 2;

function quizStart() {

    quizShow();
    reset();
    randomBirds();  

    function quizShow() {
        header.classList.add("header_dark");
        header.classList.remove("header_dark-gallery");
        intro.classList.add("intro_hidden");
        footer.classList.add("footer_hidden");
        quiz.classList.remove("quiz_hidden");
        gallery.classList.remove("gallery_visible");
        gallery.classList.add("gallery_hidden");
        setTimeout(() => quiz.classList.add("quiz_visible"), 50);
        pointsSum = 0;
        score.innerText = "Счёт: 0";
    }
}

function reset() {
    flag = true;
    points = 5;
    answers.forEach((item) => {
        item.addEventListener("click", birdInfoShow);
        item.addEventListener("click", answerCheck);
        item.classList.remove("answer-block__item_false");
        item.classList.remove("answer-block__item_true");
    });

    birdContent.classList.add("selected-bird__content_hidden");
    nextBtn.classList.add("quiz-footer__button_unactive");
    nextBtn.removeEventListener("click", nextQuest);
    quizImg.setAttribute("src", "assets/logo.png");
    infoImg.setAttribute("src", "assets/logo.png");
    birdTitle.forEach(item => item.innerText = "****");
    birdInfoSub.innerText = "Птица 1";
    birdInfo.innerText = "Прослушайте плеер и выберете птицу.";
}

function randomBirds() {
    let categoryActive = Array.from(categories).findIndex(  
        (item) => item.classList.contains("quiz__category-name_active")
    );

    birdsGroup = birdsData[categoryActive];
    trueBird = birdsGroup[Math.floor(Math.random() * 6)];
    birdsGroup = shuffleArray(birdsGroup);
    answers.forEach((item, index) => item.innerText = birdsGroup[index].name);

    setAudio(audio, trueBird.audio, 0);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}

function setAudio(audio, birdAudio, num) {
    audio.setAttribute("src", birdAudio);
    audio.addEventListener('loadedmetadata', {handleEvent: audioOnLoad, audio: audio, num: num});

    audio.addEventListener("ended", {handleEvent: audioResetEvent, audio: audio, num: num});

    audioReset(audio, num);
}

function audioOnLoad(event) {
    let audio = this.audio;
    let num = this.num;
    audio.volume = volumeBar[num].value/100;
    timeBar[num].setAttribute("max", Math.floor(audio.duration));

    durationMax = new Date(audio.duration*1000);
    let minutes = (durationMax.getMinutes() < 10) ? "0" + durationMax.getMinutes() : ""+durationMax.getMinutes();
    let seconds = (durationMax.getSeconds() < 10) ? "0" + durationMax.getSeconds() : ""+durationMax.getSeconds();
    if (num == 0) {
        time[1].innerText = minutes + ":" + seconds;
    } else {
        time[3].innerText = minutes + ":" + seconds;
    } 
}

function audioReset(audio, num) {
    duration[num] = undefined;
    audio.currentTime = 0;
    clearTimeout(interval[num]);
    interval[num] = undefined;
    console.log(num);
    time[num+num].innerText = "00:00";
    timeBar[num].setAttribute("value", 0);
    timeBar[num].value = 0;
    isPlay[num] = false;
    audioSvg[num].setAttribute("viewBox", "-200 0 1200 1000");
    audioImg[num].setAttribute("d",
    "M96.51 11.97c-31.23 8.05-53.26 32.76-63.42 71.27-3.45 12.84-3.64 29.7-3.64 416.71s.19 403.87 3.64 416.71c16.09 60.74 61.69 86.03 120.9 67.25 9-2.87 53.65-25.1 116.49-58.24 56.14-29.51 221.29-116.3 367.28-192.93 145.99-76.64 271.29-143.31 278.38-148.1 39.28-25.68 59.59-63.04 53.26-97.52-4.79-26.63-24.33-53.07-52.88-71.65C892 399.37 172.58 22.32 154.95 16.38c-18.97-6.33-43.3-8.24-58.44-4.41z");
}

function audioResetEvent(event) {
    let audio = this.audio;
    let num = this.num;
    duration[num] = undefined;
    audio.currentTime = 0;
    clearTimeout(interval[num]);
    interval[num] = undefined;
    console.log(num);
    time[num+num].innerText = "00:00";
    timeBar[num].setAttribute("value", 0);
    timeBar[num].value = 0;
    isPlay[num] = false;
    audioSvg[num].setAttribute("viewBox", "-200 0 1200 1000");
    audioImg[num].setAttribute("d",
    "M96.51 11.97c-31.23 8.05-53.26 32.76-63.42 71.27-3.45 12.84-3.64 29.7-3.64 416.71s.19 403.87 3.64 416.71c16.09 60.74 61.69 86.03 120.9 67.25 9-2.87 53.65-25.1 116.49-58.24 56.14-29.51 221.29-116.3 367.28-192.93 145.99-76.64 271.29-143.31 278.38-148.1 39.28-25.68 59.59-63.04 53.26-97.52-4.79-26.63-24.33-53.07-52.88-71.65C892 399.37 172.58 22.32 154.95 16.38c-18.97-6.33-43.3-8.24-58.44-4.41z");
}


let flag = true;
let bird;

function birdInfoShow() {
    bird = birdsGroup.find((item) => item.name == this.innerText);

    infoImg.setAttribute("src", bird.image);
    birdTitle[1].innerText = bird.name;
    birdInfoSub.innerText = bird.species;
    birdInfo.innerText = bird.description;

    setAudio(selectedAudio, bird.audio, 1);

    birdContent.classList.remove("selected-bird__content_hidden");
}

function answerCheck() {

    if (this.innerText != trueBird.name) {
        loseAudio.pause();
        loseAudio.currentTime = 0.0;
        loseAudio.play();
        setTimeout(() => this.classList.add("answer-block__item_false"), 100);
        this.removeEventListener("click", answerCheck);
        points--;
       
    } else {
        birdShow();
        winAudio.play();
        setTimeout(() => this.classList.add("answer-block__item_true"), 100);
        answers.forEach((item) => item.removeEventListener("click", answerCheck));

        pointsSum+=points;
        score.innerText = "Счёт: " + pointsSum;

        let categoryActive = Array.from(categories).findIndex(  
            (item) => item.classList.contains("quiz__category-name_active")
        );
        if (categoryActive == 5) {
            winShow();
        } else {
            nextBtn.classList.remove("quiz-footer__button_unactive");
            nextBtn.addEventListener("click", nextQuest);
        }

        function winShow() {
            const winText = document.querySelector(".win__text");
            const winBtn = document.querySelector(".win__button");

            winText.innerText = "Вы прошли викторину и набрали " + pointsSum + " из 30 возможных баллов";
            if (pointsSum === 30) {
                winBtn.innerText = "Вернуться на главную";
                winBtn.removeEventListener("click", tryNewGame);
                winBtn.addEventListener("click", moveToMain);
            } else {
                winBtn.innerText = "Попробовать ещё раз";
                winBtn.removeEventListener("click", moveToMain);
                winBtn.addEventListener("click", tryNewGame);
                
            }
            quiz.classList.add("quiz_hidden");
            win.classList.remove("win_hidden");



            function moveToMain() {
                location.reload(true);
            }

            function tryNewGame() {
                pointsSum = 0;
                score.innerText = "Счёт: 0";
                categories[categoryActive].classList.remove("quiz__category-name_active");
                categories[0].classList.add("quiz__category-name_active");

                quiz.classList.remove("quiz_hidden");
                win.classList.add("win_hidden");
                reset();
                randomBirds();
            }
        }
    }

    function birdShow() {
        quizImg.setAttribute("src", bird.image);
        birdTitle[0].innerText = bird.name;
    }
}

function nextQuest() {

    reset();

    let categoryActive = Array.from(categories).findIndex(  
        (item) => item.classList.contains("quiz__category-name_active")
    );
    categories[categoryActive].classList.remove("quiz__category-name_active");
    categories[categoryActive+1].classList.add("quiz__category-name_active");

    randomBirds();
}


/*Плеер*/

const audioBtn = document.querySelectorAll(".audio__button");
const audioSvg = document.querySelectorAll(".audio__button svg");
const audioImg = document.querySelectorAll(".audio__button path");
const audio = document.querySelector(".audio");
const selectedAudio = document.querySelector(".selected-bird__audio");
const timeBar = document.querySelectorAll(".audio-timebar");
const volumeBar = document.querySelectorAll(".volume .audio__timebar");
const time = document.querySelectorAll(".audio__time div");
let interval = [];
let durationMax;
let duration = [];

timeBar[0].addEventListener("change", {handleEvent: timeBarChange, audio: audio, num: 0});
timeBar[1].addEventListener("change", {handleEvent: timeBarChange, audio: selectedAudio, num: 1});
audioBtn[0].addEventListener("click", {handleEvent: play, audio: audio, num: 0});
audioBtn[1].addEventListener("click", {handleEvent: play, audio: selectedAudio, num: 1});

let isPlay = [];
isPlay[0] = false;
isPlay[1] = false;

function play(event) {
    let num = this.num;
    let audio = this.audio;
    if (isPlay[num]) {
        audio.pause();
        audioSvg[num].setAttribute("viewBox", "-200 0 1200 1000");
        audioImg[num].setAttribute("d",
            "M96.51 11.97c-31.23 8.05-53.26 32.76-63.42 71.27-3.45 12.84-3.64 29.7-3.64 416.71s.19 403.87 3.64 416.71c16.09 60.74 61.69 86.03 120.9 67.25 9-2.87 53.65-25.1 116.49-58.24 56.14-29.51 221.29-116.3 367.28-192.93 145.99-76.64 271.29-143.31 278.38-148.1 39.28-25.68 59.59-63.04 53.26-97.52-4.79-26.63-24.33-53.07-52.88-71.65C892 399.37 172.58 22.32 154.95 16.38c-18.97-6.33-43.3-8.24-58.44-4.41z");
        isPlay[num] = false;
        
    } else {
        audio.play();
        isPlay[num] = true;
        if (!interval[num]) {
            if (!duration[num]) {
                duration[num] = new Date(0);
            }
            interval[num] = setInterval(() => {
                if (isPlay[num]) {
                    if (!(timeBar[num].value == timeBar[num].getAttribute("max"))) {
                        timeBar[num].value = (+timeBar[num].value + 1);
                        duration[num].setSeconds(duration[num].getSeconds() + 1);
                    }
                    let minutes = (duration[num].getMinutes() < 10) ? "0" + duration[num].getMinutes() : ""+duration[num].getMinutes();
                    let seconds = (duration[num].getSeconds() < 10) ? "0" + duration[num].getSeconds() : ""+duration[num].getSeconds();
                    if (num == 0) {
                        time[0].innerText = minutes + ":" + seconds;
                    } else {
                        time[2].innerText = minutes + ":" + seconds;
                    }
                }
            }, 1000);
        }

        audioSvg[num].setAttribute("viewBox", "0 0 47.607 47.607");
        audioImg[num].setAttribute("d", 
            "M17.991 40.976a6.631 6.631 0 01-13.262 0V6.631a6.631 6.631 0 0113.262 0v34.345zM42.877 40.976a6.631 6.631 0 01-13.262 0V6.631a6.631 6.631 0 0113.262 0v34.345z");
    }
}

function timeBarChange(event) {
    let audio = this.audio;
    let num = this.num;
    if (!duration[num]) {
        duration[num] = new Date(0);
    }
    audio.currentTime = (+timeBar[num].value);
    duration[num].setMinutes(0);
    duration[num].setSeconds(+timeBar[num].value);
}


volumeBar[0].addEventListener("change", {handleEvent: volumeChange, audio: audio, num: 0});
volumeBar[1].addEventListener("change", {handleEvent: volumeChange, audio: selectedAudio, num: 1});

function volumeChange(event) {
    let audio = this.audio;
    let num = this.num;
    audio.volume = volumeBar[num].value/100;
}



/*Галлерея*/
const galleryImg = document.querySelectorAll(".selected-bird__img")[1];
const galleryBirdInfo = document.querySelectorAll(".selected-bird__info")[1];
const galleryBirdTitle = document.querySelectorAll(".quiz__title")[3];
const galleryBirdInfoSub = document.querySelectorAll(".selected-bird__subtitle")[1];
const gallery = document.querySelector(".gallery");
const galleryAudio = document.querySelector(".gallery__audio");

const btnLeft = document.querySelector(".left");
const btnRight= document.querySelector(".right");
const galleryBtn = document.querySelector(".nav__item:nth-child(2)");

const count = 0;
const count2 = 0;

galleryBtn.addEventListener("click", galleryShow);

function galleryShow() {
    header.classList.add("header_dark-gallery");
    header.classList.remove("header_dark");
    intro.classList.add("intro_hidden");
    footer.classList.add("footer_hidden");
    quiz.classList.add("quiz_hidden");
    quiz.classList.remove("quiz_visible");
    gallery.classList.remove("gallery_hidden");

    setTimeout(() => gallery.classList.add("gallery_visible"), 50);
    setGalleryBird(0, 0);
}

function setGalleryBird(num, num2) {
    galleryAudio.setAttribute("src", birdsData[num][num2].audio);
    galleryImg.setAttribute("src", birdsData[num][num2].image);
    galleryBirdInfo.innerText = birdsData[num][num2].description;
    galleryBirdTitle.innerText = birdsData[num][num2].name;
    galleryBirdInfoSub.innerText = birdsData[num][num2].species;
}