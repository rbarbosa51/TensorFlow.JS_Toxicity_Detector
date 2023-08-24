window.addEventListener('load', () => {
  try{
    const btn = document.getElementById("talk");
    const content = document.getElementById("content");
    const SpeechRecog = window.SpeechRecognition|| window.webkitSpeechRecognition;
    const recog = new SpeechRecog();
    recog.onstart = function(){
        console.log('voice is activated, you can speak into the microphone');
      };
    recog.onresult = function(event) {
        console.log(event);
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        content.textContent = transcript;
        document.getElementById("content").value = transcript; 
    }
    
    btn.addEventListener('click',()=>{
        $('#content').empty()
        $('#prediction-list').empty()
        recog.start();
      });
}catch(e){
   //Error handling code example
   const errorMsg = 'Please enable your microphone!';
   alert(errorMsg);
   console.log(errorMsg);
}
})
window.onload=function(){
  }
const predictButton = document.getElementById('predict-button');
predictButton.addEventListener('click', getPred);

const threshold = 0.8;

async function getPred() {
  const sentences=document.getElementById("content").value; 
  const predictionList = document.getElementById('prediction-list');
  const model = await toxicity.load(threshold);
  const predictions = await model.classify(sentences);
  console.log(`sentences: ${sentences}`);
  
  predictions.forEach(p => {
      console.log(p);
      const label = p.label;
      const results = p.results;
      
      const percentage = (results[0].probabilities[0] * 100).toPrecision(4);
      const match = results[0].match;
      
      if (match) {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<b><li> ${label} | Match : ${match} | Confidence : ${percentage}</li></b><hr>`;
          predictionList.appendChild(listItem);
          
      } else {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<li> ${label} | Match : ${match} | Confidence : ${percentage}</li><hr>`;
          predictionList.appendChild(listItem);
          
      }
  })
}