// import {myAudio} from "./myAudio.js" 
// console.log(myAudio)
//import {onMessage} from "./onMessage.js"
import "./onInstalled.js"
import "./onMessage.js"
import "./onAlarm.js"
import "./setBadge.js"

let japanVoices = []
chrome.tts.getVoices(async (voices) => {
    for(const voice of voices){
        if(voice["lang"] === "ja-JP") japanVoices.push(voice)
    }
})

let ttsObj = {
    'lang': 'ja-JP',
    'rate': 1.5,
    "voiceName": "Google 日本語"
}