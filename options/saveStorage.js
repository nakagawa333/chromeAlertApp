document.getElementById("save_button").addEventListener("click",(e) => {
    let workTimeVal = document.getElementById("work_time").value
    let restTimeVal = document.getElementById("rest_time").value

    const timeRegex = /^([0-9]+)(:([0-9]{2}))?$/
    if(!workTimeVal.match(timeRegex) || !restTimeVal.match(timeRegex)){
        return false
    }

    const noticeCheck = document.getElementById("notice_check").checked
    const speakCheck = document.getElementById("speak_check").checked

    const voiceName = document.getElementById("voice_select").value
    const rateValue = Number(document.getElementById("rate_range").value)
    const pitchValue = Number(document.getElementById("pitch_range").value)
    
    speackSettingObj = {
        "voiceName":voiceName,
        "rate":rateValue,
        "pitch":pitchValue
    }

    setObj = {
        "notification":noticeCheck,
        "speak":speakCheck,
        "speackSetting":speackSettingObj
    }

    setChromeStorage(setObj).then((res) => {
        alert(res)
    })
})

async function setChromeStorage(keyObj){
    let result = await new Promise((res,rej) => {
        chrome.storage.local.set(keyObj,() => {
            if(chrome.runtime.lastError) return rej(chrome.runtime.lastError)
            return res("保存に成功しました")
        })
    })
    return result
}