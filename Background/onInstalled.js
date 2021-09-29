import {getTimerData} from "./getTimerData.js"

chrome.runtime.onInstalled.addListener(async function(details){
    chrome.alarms.clearAll(function(res){})
    const now = new Date()
    const nowTime = now.getTime()

    let workLaster = new Date(nowTime)
    workLaster.setMinutes(now.getMinutes() + 1)

    let workDiffer = workLaster.getTime() - nowTime
    let work = {
        "workDiffer":workDiffer,
        "workSubDiffer":workDiffer,
        "isEvent":false
    }

    let restLater = new Date(nowTime)
    restLater.setMinutes(now.getMinutes() + 1)
    restLater.setSeconds(now.getSeconds() + 15)

    let restDiffer = restLater.getTime() - nowTime
    let rest = {
        "restDiffer":restDiffer,
        "restSubDiffer":restDiffer,
        "isEvent":false
    }

    await chrome.storage.local.set({'work':work},function(){})
    await chrome.storage.local.set({'rest':rest},function(){})
    await chrome.storage.local.set({"stoChanged":true})
});