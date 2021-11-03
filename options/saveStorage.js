document.getElementById("save_button").addEventListener("click",(e) => {
    let workTimeVal = document.getElementById("work_time").value
    let restTimeVal = document.getElementById("rest_time").value

    const timeRegex = /^([0-9]+)(:([0-9]{2}))?$/
    if(!workTimeVal.match(timeRegex) || !restTimeVal.match(timeRegex)) return false

    const noticeCheck = document.getElementById("notice_check").checked
    const speakCheck = document.getElementById("speak_check").checked

    const voiceName = document.getElementById("voice_select").value
    const rateValue = Number(document.getElementById("rate_range").value)
    const pitchValue = Number(document.getElementById("pitch_range").value)

    let workDiffer = Number(workTimeVal) * 1000 * 60
    let restDiffer = Number(restTimeVal) * 1000 * 60
    
    let work = {
        "workDiffer":workDiffer,
        "workSubDiffer":workDiffer,
        "isEvent":false
    }

    let rest = {
        "restDiffer":restDiffer,
        "restSubDiffer":restDiffer,
        "isEvent":false
    }

    speackSettingObj = {
        "voiceName":voiceName,
        "rate":rateValue,
        "pitch":pitchValue
    }

    setObj = {
        "work":work,
        "rest":rest,
        "notification":noticeCheck,
        "speak":speakCheck,
        "speackSetting":speackSettingObj
    }

    getChromeStorage("optionSave",chrome.storage.local).then((res) => {
        let optionSave = res["optionSave"]
        if(!optionSave){
            delete setObj.work
            delete setObj.rest
        }

        setChromeStorage(setObj)
        .then((res) => {
            alert(res)

            if(optionSave){
                resGetStoChangedData("work",chrome.storage.local).then(result => {
                    let work = result["work"]
                    if(work){
                        let workDiffer = work["workDiffer"]
                        chrome.action.setBadgeText({
                            "text":(workDiffer / 60000).toString() + "分"
                        })
                    }                    
                })
            }
        })
        .catch((res) => {
            alert("失敗しました")
        })
    })
})

async function getChromeStorage(key,func){
    const res = await getStoChangedData(key,func)
    return res
}

async function setChromeStorage(keyObj){
    let result = await new Promise((res,rej) => {
        chrome.storage.local.set(keyObj,() => {
            if(chrome.runtime.lastError) return rej(chrome.runtime.lastError)
            return res("保存に成功しました")
        })
    })
    return result
}