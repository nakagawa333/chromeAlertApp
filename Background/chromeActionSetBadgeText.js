export function chromeActionSetBadgeText(differ){
    let actionObj = {
        text:""
    }
    if(differ < 60000){
        actionObj["text"] = differ / 1000 + "秒"
    } else {
        actionObj["text"] = Math.floor(differ / 60000) + "分"
    }
    chrome.action.setBadgeText(actionObj)
}