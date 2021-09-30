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

    document.getElementById("rate_range").addEventListener("change",(event) => {
        const rateValEle = document.getElementById("rate_value")
        rateValEle.textContent = event.target.value
    })

    document.getElementById("pitch_range").addEventListener("change",(event) => {
        const rateValEle = document.getElementById("pitch_value")
        rateValEle.textContent = event.target.value
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