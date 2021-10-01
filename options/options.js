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
        const pitchValEle = document.getElementById("pitch_value")
        pitchValEle.textContent = event.target.value
    })

    document.getElementById("play_button").addEventListener("click",(event) => {
        const voiceName = document.getElementById("voice_select").value
        const rateValue = Number(document.getElementById("rate_range").value)
        const pitchValue = Number(document.getElementById("pitch_range").value)
        ttsSpeak(voiceName,rateValue,pitchValue)
    })

    voiceSelect.addEventListener("change",(event) => {
        const voiceName = event.target.value
        const rateValue = Number(document.getElementById("rate_range").value)
        const pitchValue = Number(document.getElementById("pitch_range").value)
        ttsSpeak(voiceName,rateValue,pitchValue)
    })
}

function ttsSpeak(voiceName,rateValue,pitchValue){
    const ttsOptions = {
        "rate":rateValue,
        "pitch":pitchValue,
        "voiceName":voiceName
    }
    chrome.tts.speak("こんにちは",ttsOptions)
}