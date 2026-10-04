import { theArrays } from "./arrays.js";

let diffLabels = document.querySelectorAll(".diff-inputs label");
let modeLabels = document.querySelectorAll(".mode-inputs label");
let startDiv = document.querySelector(".start");
let startBtn = document.querySelector(".start-btn");
let time = document.querySelector(".timing");
let textArea = document.querySelector(`.test-text`);
let fakePlace = document.querySelector(`.fake-place`);
let display = document.querySelector(`.display`);
let overtime = false;
let controls = document.querySelectorAll(".control span");
let wpm = document.querySelectorAll(".wpm span");
let accuracy = document.querySelectorAll(".accuracy span");
let characters = document.querySelector(".characters span");
let score = document.querySelector(".highest span");
let timeToken = 1;

if (!window.localStorage.getItem("highestScore")) {
  window.localStorage.setItem("highestScore", "0");
}
score.innerText = window.localStorage.getItem("highestScore");

// $("document").ready(function () {
//   $(".cmplate-state").hide();
// });

controls.forEach((control) => {
  control.style.cssText = `color: ${control.dataset.color};`;
});

function getRandom() {
  return Math.floor(Math.random() * 10);
}

function setChecked(labels) {
  labels.forEach((label) => {
    label.addEventListener("click", (ele) => {
      if (startDiv.style.display !== "none") {
        labels.forEach((rem) => {
          rem.classList.remove("checked");
        });
        ele.currentTarget.classList.add("checked");
      } else {
        ele.currentTarget.focus.style = "color: red;";
      }
    });
  });
}

function detTextArray(labels) {
  labels.forEach((label) => {
    label.addEventListener("click", (ele) => {
      if (startDiv.style.display !== "none") {
        let array =
          theArrays[ele.currentTarget.innerText.toLowerCase() + "Array"];
        let passage = array[getRandom()];
        fakePlace.innerText = passage;
        origintext = fakePlace.innerText.split("");
      }
    });
  });
}

let timeSat = "minute";

function setDifficulty(lables) {
  lables.forEach((lable) => {
    lable.addEventListener("click", (ele) => {
      let time = document.querySelector(".timing");
      if (ele.currentTarget.innerText === "Timed (60s)") {
        time.innerText = "60";
        timeSat = "minute";
      } else {
        time.innerText = "00";
        timeSat = "open";
      }
    });
  });
}

function timer(ele) {
  if (ele.innerText === "60") {
    let sixInterval = setInterval(() => {
      let stopTime = Boolean(
        textArea.value.length === fakePlace.innerText.length,
      );
      ele.innerText = parseInt(ele.innerText) - 1;
      timeToken = 60 - parseInt(ele.innerText);
      console.log(timeToken);
      if (ele.innerText <= 0 || stopTime) {
        clearInterval(sixInterval);
        // console.log("Time's up!");
        overtime = true;
        textArea.blur();
        if (stopTime) {
        } else if (ele.innerText <= 0) {
          timeToken = 60;
          console.log(timeToken);
        }
        let compState = document.querySelector(".cmplate-state");
        compState.style.display = "flex";
      }
    }, 1000);
  } else {
    let openInterval = setInterval(() => {
      let stopTime = Boolean(
        textArea.value.length === fakePlace.innerText.length,
      );

      ele.innerText =
        parseInt(ele.innerText) < 9
          ? `0${parseInt(ele.innerText) + 1}`
          : parseInt(ele.innerText) + 1;
      timeToken = parseInt(ele.innerText);
      console.log(timeToken);
      if (stopTime) {
        clearInterval(openInterval);
        // console.log("Time's up!");
        overtime = true;
        textArea.blur();
        let compState = document.querySelector(".cmplate-state");
        compState.style.display = "flex";
      }
    }, 1000);
  }
}

let diffCond = false;
let modeCond = false;

startBtn.addEventListener("click", () => {
  diffLabels.forEach((ele) => {
    if (ele.classList.contains("checked")) {
      diffCond = true;
    }
  });
  modeLabels.forEach((ele) => {
    if (ele.classList.contains("checked")) {
      modeCond = true;
    }
  });

  if (diffCond && modeCond) {
    startDiv.style.display = "none";
    timer(time);
  } else {
    let p = document.querySelector(".start p");

    p.style.color = "red";

    setTimeout(() => {
      p.style.color = "white";
    }, 1500);
  }
});

function addSpan(span) {
  let chSpan = document.createElement("span");
  let txtSpan = document.createTextNode(`${span}`);

  chSpan.classList.add("char");

  chSpan.appendChild(txtSpan);
  display.appendChild(chSpan);
}

let origindisplay = display.innerText.split("");
let origintext = fakePlace.innerText.split("");
let falseChars = new Set();
textArea.addEventListener("input", () => {
  if (textArea.value.length > origintext.length) {
    textArea.value = textArea.value.slice(0, origintext.length);
  }

  let rewriteText = textArea.value.split("");
  let rewritefake = [...origintext];
  let rewriteDisplay = [...origindisplay];

  for (let i = 0; i < rewritefake.length; i++) {
    if (rewriteText[i] && rewriteText[i] !== "") {
      rewritefake[i] = rewriteText[i];
    }
  }

  display.innerHTML = "";
  rewriteText.forEach((char) => {
    addSpan(char);
  });

  let chars = document.querySelectorAll(".char");

  let charsArray = [...chars];

  for (let j = 0; j < charsArray.length; j++) {
    if (charsArray[j].innerText !== origintext[j] && origintext[j] !== " ") {
      falseChars.add(j);
    }
  }

  chars.forEach((char, i) => {
    if (falseChars.has(i)) {
      char.classList.add("false-char");
    }
  });

  console.log(falseChars);
  console.log(chars);

  fakePlace.innerText = rewritefake.join("");
});

textArea.addEventListener("input", () => {
  if (diffCond && modeCond) {
    let completedCheck = setInterval(() => {
      const totalChars = textArea.value.length;
      const correctChars = totalChars - falseChars.size;
      const wpmValue = `${Math.round(totalChars / (timeToken / 60))}`;
      const accuracyValue = totalChars
        ? `${Math.floor((correctChars / totalChars) * 100)}`
        : "0";

      wpm.forEach((ele) => {
        ele.innerText = wpmValue;
      });
      accuracy.forEach((ele) => {
        ele.innerText = accuracyValue;
      });
      characters.innerText = `${totalChars}/${falseChars.size}`;

      window.localStorage.highestScore =
        wpmValue > window.localStorage.highestScore
          ? wpmValue
          : window.localStorage.highestScore;
      score.innerText = window.localStorage.getItem("highestScore");

      accuracy.forEach((ele) => {
        if (ele.innerText === "100") {
          ele.style.color = "hsl(140, 63%, 57%)";
        }
      });
      if (overtime) {
        clearInterval(completedCheck);
      }
    }, 1000);
  }
});

setChecked(diffLabels);
setChecked(modeLabels);
detTextArray(diffLabels);
setDifficulty(modeLabels);
