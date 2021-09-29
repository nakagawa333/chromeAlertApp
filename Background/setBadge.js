const badgeBackColor = {
    "color":"#FF0000"
}

let actionObj = {
    text:"1分"
}

chrome.action.setBadgeText(actionObj)
chrome.action.setBadgeBackgroundColor(badgeBackColor)