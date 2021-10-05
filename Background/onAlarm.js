import { chromeActionSetBadgeText } from './chromeActionSetBadgeText.js'
import { resGetStoChangedData } from "./resGetStoChangedData.js"

const speakObj = {}
resGetStoChangedData("speak",chrome.storage.local).then(res => {
    Object.assign(speakObj,res)
})

const speackSettingObj = {}
resGetStoChangedData("speackSetting",chrome.storage.local).then(res => {
    Object.assign(speackSettingObj,res)
})

const notificationObj = {}
resGetStoChangedData("notification",chrome.storage.local).then(res => {
    Object.assign(notificationObj,res)
})

chrome.alarms.onAlarm.addListener(e => {

    let scheduledTime = e.scheduledTime
    if(e.name === "work"){
        chrome.storage.local.get('work', (result) => {
            let work = result["work"]
            let workSubDiffer = work["workSubDiffer"]
            if(0 < workSubDiffer){
                workSubDiffer -= 1000
                work["workSubDiffer"] = workSubDiffer

                chrAlarmCreate("work",scheduledTime + 1000)
                work["isEvent"] = true
            } else {
                // 残り時間が0の場合 work
                work["workSubDiffer"] = work["workDiffer"]
                chrome.alarms.clear("work")

                chrAlarmCreate("rest",scheduledTime + 1000)
                work["isEvent"] = false

                console.log(speakObj["speak"])
                //音声
                if(speakObj["speak"]) {
                    chrome.tts.speak("作業終了!",speackSettingObj["speackSetting"]);
                }

                if(notificationObj["notification"]){
                    const notiSetttingObj = {
                        type: "basic",
                        "message":"作業時間が終わりました。目を休めて休憩しましょう！",
                        "title":"作業時間が終わりました",
                        "iconUrl":"../image/yosshi.jpg"
                    }
                    chrome.notifications.create(notiSetttingObj)
                }
            }

            chromeActionSetBadgeText(workSubDiffer)
            const badgeBackColor = {
                "color":"#FF0000"
            }
            chrome.action.setBadgeBackgroundColor(badgeBackColor)
            chrome.storage.local.set({'work':work})
        });

    } else if(e.name === "rest"){
        chrome.storage.local.get('rest', (result) => {
            let rest = result["rest"]
            let restSubDiffer = rest["restSubDiffer"]
            if(0 < restSubDiffer){
                restSubDiffer -= 1000
                rest["restSubDiffer"] = restSubDiffer
                chrAlarmCreate("rest",scheduledTime + 1000)

                rest["isEvent"] = true
    
            } else {
                // 残り時間が0の場合 rest
                //初期化
                rest["restSubDiffer"] = rest["restDiffer"]
                rest["isEvent"] = false
                chrome.alarms.clear("rest")
                chrAlarmCreate("work",scheduledTime + 1000)

                //音声
                if(speakObj["speak"]) {
                    chrome.tts.speak("休憩終了!",speackSettingObj["speackSetting"]);
                }

                if(notificationObj["notification"]){
                    const notiSetttingObj  = {
                        type: "basic",
                        "message":"休憩時間が終わりました。また、作業を頑張りましょう!",
                        "title":"休憩終了",
                        "iconUrl":"../image/yosshi.jpg"
                    }
                    chrome.notifications.create(notiSetttingObj)              
                }
            }
            chromeActionSetBadgeText(restSubDiffer)
            const badgeBackColor = {
                "color":"#00BB00"
            }
            chrome.action.setBadgeBackgroundColor(badgeBackColor)
            chrome.storage.local.set({'rest':rest})
        });
    }
})

function chrAlarmCreate(key,scheduledTime){
    chrome.alarms.create(key, {
        when:scheduledTime
    });
}