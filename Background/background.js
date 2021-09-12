// import {myAudio} from "./myAudio.js" 
// console.log(myAudio)
//import {onMessage} from "./onMessage.js"
import "./onInstalled.js"
import "./onMessage.js"
import "./onAlarm.js"

//let audio = new Audio()

function getTimerData(key) {
    return new Promise((res, rej) => {
        chrome.storage.local.get(key, function (result) {
            if (chrome.runtime.lastError) return rej(chrome.runtime.lastError);
            return res(result)
        });
    })
}
