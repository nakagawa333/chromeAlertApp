chrome.alarms.onAlarm.addListener(e => {
    //console.log(e)
    let scheduledTime = e.scheduledTime
    if(e.name === "work"){
        chrome.storage.local.get('timer', function(result) {
            let timer = result["timer"]
            if(timer){
                let workSubDiffer = timer["workSubDiffer"]
                if(0 < workSubDiffer){
                    workSubDiffer -= 1000
                    timer["workSubDiffer"] = workSubDiffer

                    chrome.alarms.create("work", {
                        when:scheduledTime + 1000
                    });

                } else {
                    timer["workSubDiffer"] = timer["workDiffer"]
                    chrome.alarms.create("rest", {
                        when:scheduledTime + 1000
                    });
                }
                chrome.storage.local.set({'timer':timer},function(){})
            }
        });

    } else if(e.name === "rest"){
        chrome.storage.local.get('timer', function(result) {
            let timer = result["timer"]
            if(timer){
                let restSubDiffer = timer["restSubDiffer"]
                if(0 < restSubDiffer){
                    restSubDiffer -= 1000
                    timer["restSubDiffer"] = restSubDiffer
        
                    chrome.alarms.create("rest", {
                        when:scheduledTime + 1000
                    });
        
                } else {
                    timer["restSubDiffer"] = timer["restDiffer"]
                    chrome.alarms.create("work", {
                        when:scheduledTime + 1000
                    });
                }
                chrome.storage.local.set({'timer':timer},function(){})
            }
        });        
    }
})