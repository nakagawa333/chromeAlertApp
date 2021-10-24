// import {myAudio} from "./myAudio.js" 
// console.log(myAudio)
//import {onMessage} from "./onMessage.js"
import "./onInstalled.js"
import "./onMessage.js"
import "./onAlarm.js"
import "./setBadge.js"

chrome.notifications.getAll((e) => {
    const keys = Object.keys(e)
    for(let key of keys){
        chrome.notifications.clear(key)
    }
})