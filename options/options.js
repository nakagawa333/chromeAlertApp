
window.onload = async (e) => {
    if(!navigator.onLine) {
        alert("オフラインになっています。")
        return false
    }

    let workData = resGetStoChangedData("work",chrome.alarms)
    let restData = resGetStoChangedData("rest",chrome.alarms)

    let arr = []
    await Promise.all([workData,restData]).then((res) => {
        arr.push(res[0])
        arr.push(res[1])
    })

    let isArrBool = arr.every((val) => val === undefined)
    if(!isArrBool){
        let workTime = document.getElementById("work_time")
        workTime.disabled = true
        let restTime = document.getElementById("rest_time")
        restTime.disabled = true
    }
    
    const timeRegex = /^([0-9]+)(:([0-9]{2}))?$/
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

    //作業時間
    resGetStoChangedData("work",chrome.storage.local).then(res => {
        let work = res["work"]
        if(work){
            workTime = work["workDiffer"] / 60000
            let workTimeEle = document.getElementById("work_time")
            workTimeEle.value = workTime
        }
    })

    //休憩時間
    resGetStoChangedData("rest",chrome.storage.local).then(res => {
        let rest = res["rest"]
        if(rest){
            restTime = rest["restDiffer"] / 60000
            let restTimeEle = document.getElementById("rest_time")
            restTimeEle.value = restTime
        }
    })

    //通知
    resGetStoChangedData("notification",chrome.storage.local).then(res => {
        if(res !== undefined){
            let noticeCheckEle = document.getElementById("notice_check")
            noticeCheckEle.checked = res["notification"]
        }
    })

    resGetStoChangedData("speak",chrome.storage.local).then(res => {
        if(res !== undefined){
            let speackCheckEle = document.getElementById("speak_check")
            speackCheckEle.checked = res["speak"]
            console.log(speackCheckEle)
        }
    })
    //ここからイベント

    document.getElementById("work_time").addEventListener("change",(event) => {
        const val = event.target.value
        const timeAlertEle = document.getElementById("time_alert")
        val.match(timeRegex) ? timeAlertEle.style.display = "none" : timeAlertEle.style.display = "block"
    })

    document.getElementById("rest_time").addEventListener("change",(event) => {
        const val = event.target.value
        const timeAlertEle = document.getElementById("time_alert")
        val.match(timeRegex) ? timeAlertEle.style.display = "none" : timeAlertEle.style.display = "block"
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