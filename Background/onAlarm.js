chrome.alarms.onAlarm.addListener(e => {
    //console.log(e)
    let scheduledTime = e.scheduledTime
    if(e.name === "work"){
        chrome.storage.local.get('work', function(result) {
            let work = result["work"]
            if(work){
                let workSubDiffer = work["workSubDiffer"]
                if(0 < workSubDiffer){
                    workSubDiffer -= 1000
                    work["workSubDiffer"] = workSubDiffer
        
                    chrome.alarms.create("work", {
                        when:scheduledTime + 1000
                    });

                } else {
                    work["workSubDiffer"] = work["workDiffer"]
                    chrome.alarms.clear("work",function(){})
                    chrome.alarms.create("rest", {
                        when:scheduledTime + 1000
                    });
                    work["isEvent"] = false
                }
                chrome.storage.local.set({'work':work},function(){})
            }
        });

    } else if(e.name === "rest"){
        chrome.storage.local.get('rest', function(result) {
            let rest = result["rest"]
            if(rest){
                let restSubDiffer = rest["restSubDiffer"]
                if(0 < restSubDiffer){
                    restSubDiffer -= 1000
                    rest["restSubDiffer"] = restSubDiffer
        
                    chrome.alarms.create("rest", {
                        when:scheduledTime + 1000
                    });

                    rest["isEvent"] = true
        
                } else {
                    //初期化
                    rest["restSubDiffer"] = rest["restDiffer"]
                    rest["isEvent"] = false
                    chrome.alarms.clear("rest",function(){})
                    chrome.alarms.create("work", {
                        when:scheduledTime + 1000
                    });
                }
                chrome.storage.local.set({'rest':rest},function(){})
            }
        });
    }
})