import "@babel/polyfill";
import "./index.html";
import { mult, sum } from "./modules/calc";
import "./styles.scss";
import "./scss/_adaptive.scss";
import mp from "./assets/audio.mp3";

let SIZE = 4;
let stepCount = 0;
let rebuild = false;
let isPaused = false;
let storageTable;


function tableInit() {
    let container;
    if (!rebuild) {
        //Создание контейнера 
        container = document.createElement("div");
        container.classList.add("container");
        document.querySelector("body").append(container);
    } else {
        container = document.querySelector(".container");
    }
    //Создание таблицы
    let table = document.createElement("table");
    table.classList.add("game-table");
    table.setAttribute("draggable","false");
    let tbody = document.createElement("tbody");
    table.append(tbody);
    container.prepend(table);

    //Рандомизация координат пустой ячейки
    let emptyCellX = Math.floor(Math.random( ) * ((SIZE-1)+1));
    let emptyCellY = Math.floor(Math.random( ) * ((SIZE-1)+1));


    //Рандомизация чисел в ячейках
    let randomArr;
    while (true) {
        randomArr = shuffleArr(SIZE);   
        let pairCount = 0;
        for (let i = 0; i < randomArr.length; i++) {
            for (let j = i+1; j < randomArr.length; j++) {
                if (randomArr[i] > randomArr[j]) pairCount++;
            }
        }
        pairCount+=(emptyCellY+1);
        if (SIZE%2 == 0) {
            if (pairCount%2 == 0) {
                console.log(pairCount);
                break;
            }
        } else {
            if (!(pairCount%2 == 0)) {
                console.log(pairCount);
                break;
            }
        }
    }
    let count = 0;

    //Создание ячеек
    for (let i = 0; i < SIZE; i++) {
        let tr = document.createElement("tr");
        tbody.append(tr);
        for (let j = 0; j < SIZE; j++) {
            let cell = document.createElement("td");
            if (i == emptyCellY && j == emptyCellX) {
                cell.classList.add("cell");
                cell.classList.add("empty-cell");
            } else {
                cell.classList.add("cell");
                cell.classList.add("filled-cell");
                cell.innerText = randomArr[count];
                count++;
            } 
            tr.append(cell);
        }
    }

    //Нахождение ячеек для перемещения
    setDraggable();
    document.querySelectorAll(".cell").forEach(item => addEventListener("dragover", dragOver));
}


//Создание таймера
let timer;
let intervalId;
function timerInit() {
    stepCount = 0;
    timer = new Date(0);

    let timerContainer = document.createElement("div");
    timerContainer.classList.add("timer-container");

    let stepContainer = document.createElement("span");

    stepContainer.classList.add("span-count");
    stepContainer.innerText = "Moves: " + stepCount;
    timerContainer.append(stepContainer); 

    let timeContainer = document.createElement("span");
    timeContainer.classList.add("span-time");
    timeContainer.innerText = "Time: " + 
    ((timer.getMinutes() < 10) ? "0" + timer.getMinutes() : timer.getMinutes()) + ":" + 
    ((timer.getSeconds() < 10) ? "0" + timer.getSeconds() : timer.getSeconds());
    timerContainer.append(timeContainer); 

    document.querySelector(".container").prepend(timerContainer);

    intervalId = setInterval(() => {
        if (!isPaused) {
            timer.setSeconds(timer.getSeconds() + 1);
            timeContainer.innerText = "Time: " + 
            ((timer.getMinutes() < 10) ? "0" + timer.getMinutes() : timer.getMinutes()) + ":" + 
            ((timer.getSeconds() < 10) ? "0" + timer.getSeconds() : timer.getSeconds());
        }
    },1000);
}

//Перемешивание массива
function shuffleArr(size) {
    let arr = [];
    for (let i = 1; i < size*size; i++) {
        arr.push(i);
    }
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

//Сделать элементы доступными для перемещения
function setDraggable() {
    let cells = document.querySelectorAll(".cell");
    let count = 0;
    let cellsArr = [];
    let emptyCellCoords;
    for (let i = 0; i < SIZE; i++) {
        cellsArr.push([]);
        for (let j = 0; j < SIZE; j++) {
            if (cells[count].classList.contains("empty-cell")) emptyCellCoords = [i,j];
            cellsArr[i].push(cells[count]);
            count++
        }
    }
    if (cellsArr[emptyCellCoords[0]][emptyCellCoords[1]+1]) {
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]+1].classList.add("draggable");
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]+1].classList.add("clickable");
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]+1].setAttribute("draggable", "true");
    }
    if (cellsArr[emptyCellCoords[0]][emptyCellCoords[1]-1]) {
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]-1].classList.add("draggable");
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]-1].classList.add("clickable");
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]-1].setAttribute("draggable", "true");
    }
    if (cellsArr[emptyCellCoords[0]+1] && cellsArr[emptyCellCoords[0]+1][emptyCellCoords[1]]) {
        cellsArr[emptyCellCoords[0]+1][emptyCellCoords[1]].classList.add("draggable");
        cellsArr[emptyCellCoords[0]+1][emptyCellCoords[1]].classList.add("clickable");
        cellsArr[emptyCellCoords[0]+1][emptyCellCoords[1]].setAttribute("draggable", "true");
    }
    if (cellsArr[emptyCellCoords[0]-1] && cellsArr[emptyCellCoords[0]-1][emptyCellCoords[1]]) {
        cellsArr[emptyCellCoords[0]-1][emptyCellCoords[1]].classList.add("draggable");
        cellsArr[emptyCellCoords[0]-1][emptyCellCoords[1]].classList.add("clickable");
        cellsArr[emptyCellCoords[0]-1][emptyCellCoords[1]].setAttribute("draggable", "true");
    }

    let draggables = document.querySelectorAll(".draggable");
    draggables.forEach(item => {
        item.addEventListener("dragstart", dragStart);
        item.addEventListener("dragend", dragEnd);
    });
    let clickables = document.querySelectorAll(".clickable");
    clickables.forEach(item => {
        item.addEventListener("click", clickShift);
    });
}

//Добавление звука
function soundInit() {
    let sound = document.createElement("audio");
    sound.src = mp;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    sound.volume = 0.05;
    document.body.append(sound);
}


//Создание левой боковой панели
function leftPanelInit() {
    let leftPanel = document.createElement("div");
    leftPanel.classList.add("left-panel");

    let button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-restart");
    button.innerText = "Restart";
    leftPanel.append(button);

    button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-save");
    button.innerText = "Save";
    leftPanel.append(button);

    button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-pause");
    button.innerText = "Pause";
    leftPanel.append(button);

    button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-board");
    button.innerText = "Score board";
    leftPanel.append(button);

    let sound = document.createElement("label");
    sound.innerText = "Sound";
    sound.setAttribute("for", "checkbox");
    let check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    check.setAttribute("checked", "true");
    check.setAttribute("id", "checkbox");
    check.classList.add("checkbox");
    leftPanel.append(check);
    leftPanel.append(sound);

    document.querySelector(".container").append(leftPanel);
}

//Создание правой боковой панели
function rightPanelInit() {
    let panel = document.createElement("div");
    panel.classList.add("right-panel");

    for (let i = 3; i <= 8; i++) {
        let check = document.createElement("input");
        check.setAttribute("type", "radio");
        check.setAttribute("name", "radio");
        check.setAttribute("value", i);
        check.setAttribute("id", "radio" + i);
        if (i == 4) check.setAttribute("checked", "true");
        check.classList.add("radio");
        panel.append(check);

        let label = document.createElement("label");
        label.setAttribute("for", "radio" + i);
        label.innerText = i + " x " + i;
        panel.append(label);
    }

    let button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-rebuild");
    button.innerText = "Rebuild";
    panel.append(button);

    document.querySelector(".container").append(panel);
}

//Создание модального окна
function modalInit() {
    let modalContainer = document.createElement("div");
    modalContainer.classList.add("win-container");
    modalContainer.style.display = "none";

    let winWindow = document.createElement("div");
    winWindow.classList.add("win-window");
    winWindow.style.display = "none";
    modalContainer.append(winWindow);

    document.body.append(modalContainer);
}

//Таблица счета
function scoreShow() {
    let scoreArr = JSON.parse(localStorage.getItem("score"));
    let modalContainer = document.querySelector(".win-container");

    let scoreWindow = document.createElement("div");
    scoreWindow.classList.add("score-window");

    if (scoreArr[0]) {
        scoreWindow.innerText = "";
        scoreArr.sort(compareNumeric);
        for (let i = 0; i < 10; i++) {
            try {
                let text = document.createElement("span");
                text.classList.add("score-text");
                console.log(scoreArr[i]);
                text.innerText = (i+1) + ") " + scoreArr[i].time + " " + scoreArr[i].step;
                scoreWindow.append(text);
            }
            catch {
                break;
            }
        }
    } else {
        scoreWindow.innerText = "It is your first game!"
    }

    modalContainer.append(scoreWindow);
    modalContainer.style.display = "flex";

    function compareNumeric(a, b) {
        if (a.stepCount > b.stepCount) return 1;
        if (a.stepCount == b.stepCount) return 0;
        if (a.stepCount < b.stepCount) return -1;
      }
}

function modalClose(e) {
    if (e.target == this) {
        document.querySelector(".win-container").style.display = "none";
        if (document.querySelector(".score-window")) {
            document.querySelector(".score-window").remove();
        } else {
            document.querySelector(".win-window").style.display = "none";
            isPaused = false;
            rebuildFunc();
        }
    }
}

//Клик 
let clickFlag = true;
let dragFlag = true;
function clickShift() {
    if (!this.classList.contains("clickable")) return;
    if (!clickFlag) return;
    let cells = document.querySelectorAll(".cell");
    let count = 0;
    let emptyCellCoords;
    let cellCoords;

    clickFlag = false;
    dragFlag = false;
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (cells[count].classList.contains("empty-cell")) emptyCellCoords = [i,j];
            if (cells[count] == this) cellCoords = [i,j];
            count++;
        }
    }

    if (cellCoords[1] == (emptyCellCoords[1]+1)) {
        this.style.left = "-" + (this.offsetHeight+5) + "px";
    } 
    if (cellCoords[1] == (emptyCellCoords[1]-1)) {
        this.style.left = (this.offsetHeight+5) + "px";
    }
    if (cellCoords[0] == (emptyCellCoords[0]+1)) {
        this.style.top = "-" + (this.offsetWidth+5) + "px";
    }
    if (cellCoords[0] == (emptyCellCoords[0]-1)) {
        this.style.top = (this.offsetWidth+5) + "px";
    }

    if (document.querySelector(".checkbox").checked) {
        document.querySelector("audio").play();
    }

    setTimeout(() => {
        let temp;
        let emptyCell = document.querySelector(".empty-cell");
        if (this.previousElementSibling) {
            if (this.previousElementSibling == emptyCell) {
                emptyCell.replaceWith(this);
                this.after(emptyCell);
            } else {
                temp = this.previousElementSibling;
                emptyCell.replaceWith(this);
                temp.after(emptyCell);
            }
        } else {
            temp = this.parentElement;
            emptyCell.replaceWith(this);
            temp.prepend(emptyCell);
        }

        this.style.left = "0px";
        this.style.top = "0px";

        //Убираем все классы для перемещения и расставляем заново
        document.querySelectorAll(".draggable").forEach(item => {
            item.classList.remove("draggable");
            item.setAttribute("draggable","false");
        });
        document.querySelectorAll(".clickable").forEach(item => {
            item.classList.remove("clickable");
        });
        setDraggable();
        
        document.querySelector(".span-count").innerText = "Moves: " + (++stepCount);
        clickFlag = true;
        dragFlag = true;

        isWin();
    },350);
}

//Начало движения
function dragStart() {
    if (!dragFlag) return;
    clickFlag = false;
    this.classList.add("dragstart");
};

//Конец движения
function dragEnd() {
    if (!dragFlag) return;
    //Если над пустой ячейкой - меняем их местами
    if (dragOverElem.classList.contains("empty-cell")){
        let temp;
        let emptyCell = document.querySelector(".empty-cell");
        if (this.previousElementSibling) {
            if (this.previousElementSibling == emptyCell) {
                emptyCell.replaceWith(this);
                this.after(emptyCell);
            } else {
                temp = this.previousElementSibling;
                emptyCell.replaceWith(this);
                temp.after(emptyCell);
            }
        } else {
            temp = this.parentElement;
            emptyCell.replaceWith(this);
            temp.prepend(emptyCell);
        }

        //Убираем все классы для перемещения и расставляем заново
        
        document.querySelectorAll(".draggable").forEach(item => {
            item.classList.remove("draggable");
            item.setAttribute("draggable","false");
        });
        document.querySelectorAll(".clickable").forEach(item => {
            item.classList.remove("clickable");
        });
        setDraggable();
        
    } else {
        this.replaceWith(this);
    }
    this.classList.remove("dragstart");

    document.querySelector(".span-count").innerText = "Moves: " + (++stepCount);
    if (document.querySelector(".checkbox").checked) {
        document.querySelector("audio").play();
    }

    isWin();
    clickFlag = true;
};

//Движение над элементом
let dragOverElem;
function dragOver(e) {
    if (!dragFlag) return;
    dragOverElem = e.target;
}

//Проверка победы
function isWin() {
    let cellsArr = document.querySelectorAll(".filled-cell");
    let cells = [];
    for (let i = 0; i < cellsArr.length;i++) {
        cells.push(parseInt(cellsArr[i].innerText, 10));
    }
    let allCells = document.querySelectorAll(".cell");
    let emptyCell = document.querySelector(".empty-cell");
    if (isAscending(cells) && allCells[allCells.length-1] == emptyCell) {
        isPaused = true;
        //Вывод окна
        setTimeout(() => {
            document.querySelector(".win-window").innerText = ("Hooray! You solved the puzzle in " +
            ((timer.getMinutes() < 10) ? "0" + timer.getMinutes() : timer.getMinutes()) + ":" + 
            ((timer.getSeconds() < 10) ? "0" + timer.getSeconds() : timer.getSeconds()) + " and " + 
            stepCount + " moves!");
    
            document.querySelector(".win-container").style.display = "flex";
            document.querySelector(".win-window").style.display = "block";
    
            //Сохранение результата
            let scoreStat = {};
            scoreStat.time = document.querySelector(".span-time").innerText;
            scoreStat.step = document.querySelector(".span-count").innerText;
            scoreStat.stepCount = stepCount;
            let arr = JSON.parse(localStorage.getItem("score"));
            arr.push(scoreStat);
            localStorage.setItem("score", JSON.stringify(arr));
            console.log(JSON.parse(localStorage.getItem("score")));
        },300);
    }

    function isAscending(arr) {
        return arr.every(function (x, i) {
            return i === 0 || x >= arr[i - 1];
        });
    }
}

//Перестройка таблицы
function rebuildFunc() {
    if (isPaused) {
        pause();
    }
    clearInterval(intervalId);
    let table = document.querySelector(".game-table");
    let timerContainer = document.querySelector(".timer-container");
    table.remove();
    timerContainer.remove();

    rebuild = true;
    let radio = document.querySelectorAll(".radio");

    SIZE = Array.from(radio).find(item => item.checked).value;

    tableInit();
    timerInit();
}

//Пауза
function pause() {
    const pauseBtn = document.querySelector(".btn-pause");
    if (isPaused) {
        isPaused = false;
        pauseBtn.innerText = "Pause";
    } else {
        isPaused = true;
        pauseBtn.innerText = "Unpause";
    }

    const table = document.querySelector(".game-table");
    table.classList.toggle("table-paused");
    
}




//Старт программы
tableInit();
timerInit();
soundInit();
leftPanelInit();
rightPanelInit();
modalInit();

let rebuildBtn = document.querySelector(".btn-rebuild");
rebuildBtn.addEventListener("click", rebuildFunc);

let restartBtn = document.querySelector(".btn-restart");
restartBtn.addEventListener("click", rebuildFunc);

let pauseBtn = document.querySelector(".btn-pause");
pauseBtn.addEventListener("click", pause);

let boardBtn = document.querySelector(".btn-board");
boardBtn.addEventListener("click", scoreShow);

let winContainer = document.querySelector(".win-container");
winContainer.addEventListener("click", modalClose);


localStorage.clear();
if (!localStorage.score) {
    localStorage.setItem("score", JSON.stringify([]));
}
