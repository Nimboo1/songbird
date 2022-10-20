import "@babel/polyfill";
import "./index.html";
import { mult, sum } from "./modules/calc";
import "./styles.scss";
import "./scss/_adaptive.scss";
import mp from "./assets/audio.mp3";

let SIZE = 4;
let stepCount = 0;
let rebuild = false;


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
    let randomArr = shuffleArr(SIZE);
    let count = 0;

    //Создание ячеек
    for (let i = 0; i < SIZE; i++) {
        let tr = document.createElement("tr");
        tbody.append(tr);
        for (let j = 0; j < SIZE; j++) {
            let cell = document.createElement("td");
            if (i == emptyCellX && j == emptyCellY) {
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
function timerInit() {
    stepCount = 0;
    let timer = new Date(0);

    let timerContainer = document.createElement("div");
    timerContainer.classList.add("timer-container");

    let stepContainer = document.createElement("span");
    stepContainer.classList.add("span-time");
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

    setInterval(() => {
        timer.setSeconds(timer.getSeconds() + 1);
        timeContainer.innerText = "Time: " + 
        ((timer.getMinutes() < 10) ? "0" + timer.getMinutes() : timer.getMinutes()) + ":" + 
        ((timer.getSeconds() < 10) ? "0" + timer.getSeconds() : timer.getSeconds());
        timerContainer.append(timeContainer); 
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
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]+1].setAttribute("draggable", "true");
    }
    if (cellsArr[emptyCellCoords[0]][emptyCellCoords[1]-1]) {
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]-1].classList.add("draggable");
        cellsArr[emptyCellCoords[0]][emptyCellCoords[1]-1].setAttribute("draggable", "true");
    }
    if (cellsArr[emptyCellCoords[0]+1] && cellsArr[emptyCellCoords[0]+1][emptyCellCoords[1]]) {
        cellsArr[emptyCellCoords[0]+1][emptyCellCoords[1]].classList.add("draggable");
        cellsArr[emptyCellCoords[0]+1][emptyCellCoords[1]].setAttribute("draggable", "true");
    }
    if (cellsArr[emptyCellCoords[0]-1] && cellsArr[emptyCellCoords[0]-1][emptyCellCoords[1]]) {
        cellsArr[emptyCellCoords[0]-1][emptyCellCoords[1]].classList.add("draggable");
        cellsArr[emptyCellCoords[0]-1][emptyCellCoords[1]].setAttribute("draggable", "true");
    }

    let draggables = document.querySelectorAll(".draggable");
    draggables.forEach(item => {
        item.addEventListener("dragstart", dragStart);
        item.addEventListener("dragend", dragEnd);
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

//Начало движения
function dragStart() {
    this.classList.add("dragstart");
};

//Конец движения
function dragEnd() {
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
        setDraggable();
    }
    this.classList.remove("dragstart");

    document.querySelector(".span-count").innerText = "Moves: " + (++stepCount);
    if (document.querySelector(".checkbox").checked) {
        document.querySelector("audio").play();
    }
};

//Движение над элементом
let dragOverElem;
function dragOver(e) {
    dragOverElem = e.target;
}

//Перестройка таблицы
function rebuildFunc() {
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




//Старт программы
tableInit();
timerInit();
soundInit();
leftPanelInit();
rightPanelInit();

let rebuildBtn = document.querySelector(".btn-rebuild");
rebuildBtn.addEventListener("click", rebuildFunc);
