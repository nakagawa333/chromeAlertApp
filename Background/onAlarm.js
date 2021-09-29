import { chromeActionSetBadgeText } from './chromeActionSetBadgeText.js'

function chrAlarmCreate(key,scheduledTime){
    chrome.alarms.create(key, {
        when:scheduledTime
    });
}

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

                const notiOptionsObj = {
                    type: "basic",
                    "message":"作業時間が終わりました。目を休めて休憩しましょう！",
                    "title":"作業時間が終わりました",
                    "iconUrl":"../image/yosshi.jpg"
                }
                chrome.notifications.create(notiOptionsObj)
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

                const notiOptionsObj = {
                    type: "basic",
                    "message":"休憩時間が終わりました。また、作業を頑張りましょう!",
                    "title":"休憩終了",
                    "iconUrl":"../image/yosshi.jpg"
                }
                chrome.notifications.create(notiOptionsObj)
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