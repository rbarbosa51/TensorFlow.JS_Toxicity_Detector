/**
* Wait till the tensorflow core and model are downloaded from CDN before proceedin
* 
*/
window.addEventListener("load", () => {
  //Animate Background
  const body = document.querySelector("body");
  let angle = 0;
  setInterval(() => {
    angle = (angle + 1) % 360;
    body.style.setProperty(
      "background-image",
      `linear-gradient(${angle}deg, #fddede, #ccf9f9)`,
    );
  }, 25);
  //Interact with the app's UI
  const content = document.getElementById("content");
  const predictButton = document.getElementById("predictButton");
  predictButton.addEventListener("click", getPred);
  predictButton.disabled = true;
  const talkButton = document.getElementById("talk");
  const predictionList = document.getElementById("predictionList");
  const waiting = document.getElementById("wait");
  waiting.style.display = "none";
  try {
    //Speech Recognition
    const SpeechRecog =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecog();
    recog.onstart = function () {
      console.log("Debug -> Microphone active");
    };
    recog.onresult = function (event) {
      console.log(event);
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      content.textContent = transcript;
      content.value = transcript;
    };
    //Enable
    talkButton.addEventListener("click", () => {
      content.innerText = "";
      predictionList.innerText = "";
      predictButton.disabled = false;
      recog.start();
    });
  } catch (e) {
    //show error message in alert and console log.
    const errorMsg = e.message;
    alert(errorMsg);
    console.log(errorMsg);
  }
});

//The threshold of 0.8. The value was derrived from docuemntation
const threshold = 0.8;
/**
 * getPred() gets triggered by the predict button. It runs the toxicity model against the value of content.
 */
async function getPred() {
  const waiting = document.getElementById("wait");
  waiting.style.display = "flex";
  const content = document.getElementById("content");
  const predictionList = document.getElementById("predictionList");
  const sentence = content.value;
  // eslint-disable-next-line
  const model = await toxicity.load(threshold);
  const predictions = await model.classify(sentence);
  
  //Populate the list components with results
  predictions.forEach((p) => {
    const label = p.label;
    const results = p.results;
    const percentage = (results[0].probabilities[0] * 100).toPrecision(4);
    const match = results[0].match;
    if (match) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<b><div>${label} </div><div>Match : ${match}</div><div>Confidence: ${percentage}</div></b>`;
      predictionList.appendChild(listItem);
    } else {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<div>${label} </div><div>Match : ${match}</div><div>Confidence: ${percentage}</div>`;
      predictionList.appendChild(listItem);
    }
  });
  waiting.style.display = "none";
}
