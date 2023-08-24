window.addEventListener("load", () => {
  const content = document.getElementById("content");
  const predictButton = document.getElementById("predict-button");
  predictButton.addEventListener("click", getPred);
  const btn = document.getElementById("talk");
  const predictionList = document.getElementById("prediction-list");
  try {
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

    btn.addEventListener("click", () => {
      content.innerText = "";
      predictionList.innerText = "";
      recog.start();
    });
  } catch (e) {
    //Error handling code example
    const errorMsg = "Please enable your microphone!";
    alert(errorMsg);
    console.log(errorMsg);
  }
});

//Add a feature
const threshold = 0.8;

async function getPred() {
  const content = document.getElementById("content");
  const predictionList = document.getElementById("prediction-list");
  const sentence = content.value;
  // eslint-disable-next-line
  const model = await toxicity.load(threshold);
  const predictions = await model.classify(sentence);
  console.log(`Debug-> sentence: ${sentence}`);

  predictions.forEach((p) => {
    console.log(p);
    const label = p.label;
    const results = p.results;

    const percentage = (results[0].probabilities[0] * 100).toPrecision(4);
    const match = results[0].match;

    if (match) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<b><li> ${label} | Match : ${match} | Confidence : ${percentage}</li></b><hr>`;
      predictionList.appendChild(listItem);
    } else {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<li> ${label} | Match : ${match} | Confidence : ${percentage}</li><hr>`;
      predictionList.appendChild(listItem);
    }
  });
}
