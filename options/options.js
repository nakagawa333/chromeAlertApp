checkAlarm(1000)

//一秒毎に
function checkAlarm(time){
    let work_time = document.getElementById("work_time")
    let rest_time = document.getElementById("rest_time")

    let timeout = setTimeout(function main(){
        chrome.storage.local.get("optionSave",(res) => {
            let alertDanger = document.getElementById("alert_danger")
            if(!res["optionSave"]){
                work_time.disabled = true
                rest_time.disabled = true

                if(!alertDanger){
                    let alertDiv = document.createElement("div")
                    alertDiv.classList.add("alert")
                    alertDiv.classList.add("alert-danger")
                    alertDiv.id = "alert_danger"
                    alertDiv.textContent = "作業時間と休憩時間を変更するためには、タイマーをリセットしてください。"
        
                    let settingCard = document.getElementById("setting_card")
                    settingCard.before(alertDiv)
                }

            } else {
                work_time.disabled = false
                rest_time.disabled = false
                if(alertDanger) alertDanger.remove()
            }
        })
        timeout = setTimeout(main,time)
    },time)
}

document.addEventListener("DOMContentLoaded",async (e) => {
    chrome.storage.local.get("optionSave",(res) => {
        let alertDanger = document.getElementById("alert_danger")

        if(!res["optionSave"]){
            work_time.disabled = true
            rest_time.disabled = true

            if(!alertDanger){
                let alertDiv = document.createElement("div")
                alertDiv.classList.add("alert")
                alertDiv.classList.add("alert-danger")
                alertDiv.id = "alert_danger"
                alertDiv.textContent = "作業時間と休憩時間を変更するためには、タイマーをリセットしてください。"
    
                let settingCard = document.getElementById("setting_card")
                settingCard.before(alertDiv)
            }

        } else {
            work_time.disabled = false
            rest_time.disabled = false
            if(alertDanger) alertDanger.remove()            
        }
    })

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
        if(Object.keys(res).length !== 0){
            let work = res["work"]
            workTime = work["workDiffer"] / 60000
            let workTimeEle = document.getElementById("work_time")
            workTimeEle.value = workTime
        }
    })

    //休憩時間
    resGetStoChangedData("rest",chrome.storage.local).then(res => {
        if(Object.keys(res).length !== 0){
            let rest = res["rest"]
            restTime = rest["restDiffer"] / 60000
            let restTimeEle = document.getElementById("rest_time")
            restTimeEle.value = restTime
        }
    })

    //通知
    resGetStoChangedData("notification",chrome.storage.local).then(res => {
        if(Object.keys(res).length !== 0){
            let noticeCheckEle = document.getElementById("notice_check")
            noticeCheckEle.checked = res["notification"]
        }
    })

    //音声
    resGetStoChangedData("speak",chrome.storage.local).then(res => {
        if(Object.keys(res).length !== 0){
            let speackCheckEle = document.getElementById("speak_check")
            speackCheckEle.checked = res["speak"]
        }
    })

    //音声設定
    resGetStoChangedData("speackSetting",chrome.storage.local).then(res => {
        if(Object.keys(res).length !== 0){
            let speackSetting = res["speackSetting"]
            let pitch = speackSetting["pitch"]
            let rate = speackSetting["rate"]
            let voiceName = speackSetting["voiceName"]

            let rateRange = document.getElementById("rate_range")
            let pitchRange = document.getElementById("pitch_range")
            let voiceSelect = document.getElementById("voice_select")

            let rateValue = document.getElementById("rate_value")
            let pitchValue = document.getElementById("pitch_value")

            rateRange.value = rate.toString()
            rateValue.textContent = rate.toString()
            pitchRange.value = pitch.toString()
            pitchValue.textContent = pitch.toString()

            voiceOptions = voiceSelect.children
            let index = -1;
            for(let i = 0; i < voiceOptions.length; i++){
                if(voiceOptions[i].innerText === voiceName){
                    index = i
                }
            }

            if(index !== -1){
                voiceSelect.selectedIndex = index
            }
        }
    })
    //ここからイベント

    //作業時間を変更した場合
    document.getElementById("work_time").addEventListener("change",(event) => {
        const val = event.target.value
        const timeAlertEle = document.getElementById("time_alert")
        val.match(timeRegex) ? timeAlertEle.style.display = "none" : timeAlertEle.style.display = "block"
    })

    //休憩時間を変更した場合
    document.getElementById("rest_time").addEventListener("change",(event) => {
        const val = event.target.value
        const timeAlertEle = document.getElementById("time_alert")
        val.match(timeRegex) ? timeAlertEle.style.display = "none" : timeAlertEle.style.display = "block"
    })

    //音声設定のRateを変更した場合
    document.getElementById("rate_range").addEventListener("change",(event) => {
        const rateValEle = document.getElementById("rate_value")
        rateValEle.textContent = event.target.value
    })

    //音声設定のpitchを変更した場合
    document.getElementById("pitch_range").addEventListener("change",(event) => {
        const pitchValEle = document.getElementById("pitch_value")
        pitchValEle.textContent = event.target.value
    })
    
    //再生ボタンを押した場合
    document.getElementById("play_button").addEventListener("click",(event) => {
        const voiceName = document.getElementById("voice_select").value
        const rateValue = Number(document.getElementById("rate_range").value)
        const pitchValue = Number(document.getElementById("pitch_range").value)
        ttsSpeak(voiceName,rateValue,pitchValue)
    })

    //音声一覧のセレクトボタンの値を変更した場合
    voiceSelect.addEventListener("change",(event) => {
        const voiceName = event.target.value
        const rateValue = Number(document.getElementById("rate_range").value)
        const pitchValue = Number(document.getElementById("pitch_range").value)
        ttsSpeak(voiceName,rateValue,pitchValue)
    })    
})

function ttsSpeak(voiceName,rateValue,pitchValue){
    const ttsOptions = {
        "rate":rateValue,
        "pitch":pitchValue,
        "voiceName":voiceName
    }
    chrome.tts.speak("作業終了",ttsOptions)
}