chrome.runtime.onMessage.addListener(function (req, sender, send) {
    if (req["event"] === "onload") {
        send("onload")
    }

    if (req["event"] === "click") {
        switch (req["state"]) {
            case "start":
                chrome.alarms.get("work",function(res){
                    if(!res){
                        chrome.alarms.create("work", {
                            when:Date.now() + 1000
                        });
                        send("スタート")
                    }
                })
                break;

            case "stop":
                //workValue.stop()
                break;

            case "reset":
                //alarmsイベント全削除
                chrome.alarms.clearAll(function(res){})

                //
                chrome.storage.local.get(['timer'], function(result) {
                    let timer = result["timer"]
                    if(timer){
                        timer["workSubDiffer"] = timer["workDiffer"]
                        timer["restSubDiffer"] = timer["restDiffer"]
                        console.log(timer)
                        chrome.storage.local.set({'timer':timer},function(){})
                    }
                });
                send("reset")
                break;

            case "restart":
                send("restart")
                break;
        }
    }
    return true
})