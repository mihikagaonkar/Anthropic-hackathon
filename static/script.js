document.getElementById("textForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const inputText = document.getElementById("inputText").value;
    const readingLevel = document.getElementById("readingLevel").value;
  
    const res = await fetch("/process", {
      method: "POST",
      body: new URLSearchParams({ inputText, readingLevel })
    });
  
    const data = await res.json();
    document.getElementById("outputText").innerText = data.simplified;
  });
  
  document.getElementById("fileInput").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function() {
      document.getElementById("inputText").value = reader.result;
    };
    if (e.target.files[0]) reader.readAsText(e.target.files[0]);
  });
  
  let isSpeaking = false;
  let utterance;
  
  function speakText() {
    const output = document.getElementById("outputText").textContent.trim();
    const speakButton = document.querySelector("button[onclick='speakText()']");
  
    if (!output) return;
  
    // If already speaking, stop it
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      speakButton.textContent = "🔊 Read Aloud";
      return;
    }
  
    // Start speaking
    utterance = new SpeechSynthesisUtterance(output);
    isSpeaking = true;
    speakButton.textContent = "⏹️ Stop";
  
    utterance.onend = () => {
      isSpeaking = false;
      speakButton.textContent = "🔊 Read Aloud";
    };
  
    speechSynthesis.speak(utterance);
  }
  
  
  async function translateText() {
    const text = document.getElementById("outputText").innerText;
    const lang = document.getElementById("lang").value;
  
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    const translated = data[0].map(item => item[0]).join("");
    document.getElementById("outputText").innerText = translated;
  }
  