import {getTimerData} from "./getTimerData.js"

chrome.runtime.onInstalled.addListener(details => {

    chrome.alarms.clearAll(function(res){})

    let data = getTimerData("timer",chrome.storage.local)
    data.then((result) => {
        let timer = result["timer"]
        if(timer){
            timer["workSubDiffer"] = timer["workDiffer"]
            timer["restSubDiffer"] = timer["restDiffer"]
            chrome.storage.local.set({'timer':timer},function(){})
        }
    }).catch({
        
    })

    chrome.storage.local.get(["work","rest"],function(result){
        const now = new Date()
        const nowTime = now.getTime()

        if(!result["work"]){
            let workLaster = new Date(nowTime)
            workLaster.setMinutes(now.getMinutes() + 1)
        
            let workDiffer = workLaster.getTime() - nowTime
            let work = {
                "workDiffer":workDiffer,
                "workSubDiffer":workDiffer,
                "isEvent":false
            }
            chrome.storage.local.set({'work':work},function(){})
        }

        if(!result["rest"]){
            let restLater = new Date(nowTime)
            restLater.setMinutes(now.getMinutes() + 2)

            let restDiffer = restLater.getTime() - nowTime
            let rest = {
                "restDiffer":restDiffer,
                "restSubDiffer":restDiffer,
                "isEvent":false
            }
            chrome.storage.local.set({'rest':rest},function(){})
        }
    })
    
    // chrome.storage.local.get(['timer'], function(result) {

    //     if(!result["timer"]){
    //         let now = new Date()
    //         let nowTime = now.getTime()
    //         //作業時間
    //         let workLaster = new Date(nowTime)
    //         workLaster.setMinutes(now.getMinutes() + 1)
        
    //         let workDiffer = workLaster.getTime() - nowTime

    //         //休憩時間
    //         let restLater = new Date(nowTime)
    //         restLater.setMinutes(now.getMinutes() + 2)

    //         let restDiffer = restLater.getTime() - nowTime
    //         let timer = {
    //             "workDiffer":workDiffer,
    //             "restDiffer":restDiffer,
    //             "workSubDiffer":workDiffer,
    //             "restSubDiffer":restDiffer
    //         }
    //         chrome.storage.local.set({'timer':timer},function(){})
    //     }
    // });
});