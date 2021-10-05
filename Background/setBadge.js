import { resGetStoChangedData } from "./resGetStoChangedData.js"

let actionObj = {
    text:"60分"
}

resGetStoChangedData("work",chrome.storage.local).then(res => {
    let work = res["work"]
    if(Object.keys(work).length !== 0){
        actionObj["text"] = (work["workDiffer"] / 60000).toString() + "分"
    }
    chrome.action.setBadgeText(actionObj)
})

const badgeBackColor = {
    "color":"#FF0000"
}

chrome.action.setBadgeBackgroundColor(badgeBackColor)