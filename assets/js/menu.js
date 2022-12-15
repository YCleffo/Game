// Создаем переменные

var menu1 = document.getElementById("menu1");
var menu2 = document.getElementById("menu2");
var menu3 = document.getElementById("menu3");
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");
var button4 = document.getElementById("button4");

var widget1 = document.getElementById("widget1");
var widget2 = document.getElementById("widget2");
var widget3 = document.getElementById("widget3");

var myAudio = document.getElementById("myAudio");

function togglePlay() {
    return myAudio.paused ? myAudio.play() : myAudio.pause();
};


var m = [0];
var k = [0];
var f = [0];
var score = 0;
var level = 0;

// Настроим переходы

button1.onclick = function() {
    clickSound.play();
    // Присвоение копий массивов

    map = userSlice(mapArray[level]);
    things = userSlice(thingsArray[level]);
    keys = userSlice(keysArray[level]);
    start = userSlice(startArray[level]);
    finish = userSlice(finishArray[level]);

    // Создание мира и расстановка предметов

    menu1.style.display = "none";
    CreateNewWorld(map);
    pawn.x = start[0][0];
    pawn.y = start[0][1];
    pawn.z = start[0][2];
    pawn.rx = start[0][3];
    pawn.rx = start[0][4];
    CreateSquares(things, "thing", false);
    CreateSquares(keys, "key", false);
    CreateSquares(finish, "finish", false);

    // Вывод виджетов на экран и их настройка

    widget1.style.display = "block";
    widget2.style.display = "block";
    widget1.innerHTML = "<p style='font-size:30px'>Монеты: 0 из " + things.length + " </p>";
    widget2.innerHTML = "<p style='font-size:30px'>Ключи:0</p>";
    widget3.innerHTML = "<p style='font-size:40px'>Найдите красный квадрат!</p>";

    // Запуск игры

    TimerGame = setInterval(repeatFunction, 10);
    canlock = true;
}

button2.onclick = function() {
    clickSound.play();
    menu1.style.display = "none";
    menu2.style.display = "block";
}

button3.onclick = function() {
    clickSound.play();
    menu1.style.display = "block";
    menu2.style.display = "none";
}

button4.onclick = function() {
    clickSound.play();
    menu1.style.display = "block";
    menu3.style.display = "none";
}

// Функция проверки взаимодействия
function interact(objects, string, num, soundObject) {
    for (i = 0; i < objects.length; i++) {
        let r = (objects[i][0] - pawn.x) ** 2 + (objects[i][1] - pawn.y) ** 2 + (objects[i][2] - pawn.z) ** 2;
        if (r < (objects[i][7] ** 2)) {
            soundObject.play();
            document.getElementById(string + i).style.display = "none";
            objects[i][0] = 1000000;
            objects[i][1] = 1000000;
            objects[i][2] = 1000000;
            document.getElementById(string + i).style.transform =
                "translate3d(1000000px,1000000px,1000000px)";
            num[0]++;
            widget1.innerHTML = "<p style='font-size:30px'>Монеты: " + m[0] + " из " + things.length + " </p>";
            widget2.innerHTML = "<p style='font-size:30px'>Ключи: " + k[0] + "</p>";
        };
    };
}



function finishInteract() {
    let r = (finish[0][0] - pawn.x) ** 2 + (finish[0][1] - pawn.y) ** 2 + (finish[0][2] - pawn.z) ** 2;
    if (r < (finish[0][7] ** 2)) {
        if (k[0] == 0) {
            widget3.style.display = "block";
            setTimeout(() => widget3.style.display = "none", 5000);
            mistakeSound.play();
        } else {
            clearWorld();
            clearInterval(TimerGame);
            document.exitPointerLock();
            score = score + m[0];
            k[0] = 0;
            m[0] = 0;
            menu1.style.display = "block";
            button1.innerHTML = "<p>Продолжить</p>";
            level++;
            if (level >= 2) {
                winSound.play();
                menu1.style.display = "none";
                menu3.style.display = "block";
                document.getElementById("result").innerHTML = "Вы набрали " + score + " очков";
                level = 0;
                score = 0;
                canlock = false;
                button1.innerHTML = "<p>Начать игру</p>";
            };
        };
    };
};

// Функция, повторяющаяся в игре

function repeatFunction() {
    update();
    interact(things, "thing", m, thingSound);
    interact(keys, "key", k, keySound);
    rotate(things, "thing", 0.5);
    rotate(keys, "key", 0.5);
    rotate(finish, "finish", 0.5);
    finishInteract();
}

function userSlice(array) {
    let NewArray = new Array();
    for (let i = 0; i < array.length; i++) {
        NewArray[i] = new Array();
        for (let j = 0; j < array[i].length; j++) {
            NewArray[i][j] = array[i][j];
        }
    }
    return NewArray;
}

function rotate(objects, string, wy) {
    for (i = 0; i < objects.length; i++) {
        objects[i][4] = objects[i][4] + wy;
        document.getElementById(string + i).style.transform = "translate3d(" +
            (600 - objects[i][6] / 2 + objects[i][0]) + "px," +
            (400 - objects[i][7] / 2 + objects[i][1]) + "px," +
            (objects[i][2]) + "px)" +
            "rotateX(" + objects[i][3] + "deg)" +
            "rotateY(" + objects[i][4] + "deg)" +
            "rotateZ(" + objects[i][5] + "deg)";
    };
}