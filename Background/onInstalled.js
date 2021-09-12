chrome.runtime.onInstalled.addListener(details => {
    chrome.storage.local.get(['timer'], function(result) {

        if(!result["timer"]){
            let now = new Date()
            let nowTime = now.getTime()
            //作業時間
            let workLaster = new Date(nowTime)
            workLaster.setMinutes(now.getMinutes() + 1)
        
            let workDiffer = workLaster.getTime() - nowTime

            //休憩時間
            let restLater = new Date(nowTime)
            restLater.setMinutes(now.getMinutes() + 2)

            let restDiffer = restLater.getTime() - nowTime
            let timer = {
                "workDiffer":workDiffer,
                "restDiffer":restDiffer,
                "workSubDiffer":workDiffer,
                "restSubDiffer":restDiffer
            }
            chrome.storage.local.set({'timer':timer},function(){})
        }
    });
});