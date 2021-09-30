window.onload = (e) => {
    const voiceSelect = document.getElementById("voice_select")
    chrome.tts.getVoices(async (voices) => {
        for(const voice of voices){
            if(voice["lang"] === "ja-JP") {
                let optionElem = document.createElement("option")
                optionElem.innerHTML = voice["voiceName"]
                voiceSelect.appendChild(optionElem)
            }
        }
    })

    voiceSelect.addEventListener("change",(event) => {
        const voiceName = event.target.value
        const ttsOptions = {
            "rate":1,
            "pitch":1,
            "voiceName":voiceName
        }

        chrome.tts.speak("こんにちは",ttsOptions)
    })
}