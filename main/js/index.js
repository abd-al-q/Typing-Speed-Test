import { theArrays } from "./arrays.js";

let diffLabels = document.querySelectorAll(".diff-inputs label");
let modeLabels = document.querySelectorAll(".mode-inputs label");
let startDiv = document.querySelector(".start");
let startBtn = document.querySelector(".start-btn");
let time = document.querySelector(".timing");
let textArea = document.querySelector(`.test-text`);
let fakePlace = document.querySelector(`.fake-place`);
let display = document.querySelector(`.display`);
let stopTime = Boolean(
  textArea.innerText.length === fakePlace.innerText.length,
);

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
      ele.innerText = parseInt(ele.innerText) - 1;
      if (ele.innerText <= 0) {
        clearInterval(sixInterval);
        // textArea.blur();
      }
    }, 1000);
  } else {
    let openInterval = setInterval(() => {
      ele.innerText =
        parseInt(ele.innerText) < 9
          ? `0${parseInt(ele.innerText) + 1}`
          : parseInt(ele.innerText) + 1;
      if (stopTime) clearInterval(openInterval);
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
    setTimeout(() => {
      startDiv.style.display = "none";
      timer(time);

      if (timeSat === "minute") {
        for (let i = 60; i <= 0; i--) {
          if (parseInt(time.innerText) === 0) {
            console.log("time is up");
          }
        }
      } else if (timeSat === "open") {
        if (textArea.value.split("").length === origintext.length) {
          textArea.blur();
        }
      }

      // for (let i = 60; i <= 0; i--) {
      //   if (timeSat === "minute") {
      //     if (parseInt(time.innerText) === 0) {
      //       console.log("time is up");
      //     }
      //   } else if (timeSat === "open") {
      //     if (textArea.value.split("").length === origintext.length) {
      //       textArea.blur();
      //     }
      //   }
      // }
    }, 300);
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
let falseChars = [];
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
      falseChars.push(j);
    } else {
      continue;
    }
  }

  chars.forEach((char, i) => {
    if (falseChars.includes(i)) {
      char.classList.add("false-char");
    }
  });

  console.log(falseChars);
  console.log(chars);

  fakePlace.innerText = rewritefake.join("");
  // display.innerText = rewriteDisplay.join("");
  // textArea.value = rewriteText.join("");
});

setChecked(diffLabels);
setChecked(modeLabels);
detTextArray(diffLabels);
setDifficulty(modeLabels);
