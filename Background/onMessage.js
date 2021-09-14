import {getTimerData} from "./getTimerData.js"

chrome.runtime.onMessage.addListener(function (req, sender, send) {

    //フロント側ページ読み込み時
    if (req["event"] === "onload") {
        let key = "timer"
        let data = getTimerData(key,chrome.storage.local)
        data.then((res) => {
            let work = getTimerData("work",chrome.alarms)
            let rest = getTimerData("rest",chrome.alarms)

            Promise.all([work,rest]).then((values) => {
                let name = ""
                for(let i = 0; i < values.length; i++){
                    let obj = values[i]
                    if(obj){
                        name = obj.name
                    }
                }

                let obj = {
                    "timer":res[key],
                    "name":name
                }
                send(obj)
            }).catch((e) => {
                send("失敗しました")
            })

        }).catch((e) => {
            send("失敗しました")
        })
    }

    //ボタンクリック時
    if (req["event"] === "click") {
        let work = getTimerData("work",chrome.alarms)
        let rest = getTimerData("rest",chrome.alarms)

        switch (req["state"]) {
            case "start":
                Promise.all([work,rest]).then((values) => {
                    const result = values.filter((v) => v)
                    console.log(result)
                })
                work.then((res) => {
                    if(!res){
                        chrome.alarms.create("work", {
                            when:Date.now() + 1000
                        });
                        send("スタート")
                    }
                }).catch({

                })

                break;

            case "stop":
                Promise.all([work,rest]).then((values) => {
                    let name = ""
                    for(let i = 0; i < values.length; i++){
                        let obj = values[i]
                        if(obj){
                            name = obj.name
                        }
                    }

                    if(name !== ""){
                        chrome.alarms.clear(name,() => {})
                    }
                })
                break;

            case "reset":
                //alarmsイベント全削除
                chrome.alarms.clearAll(function(res){})

                let data = getTimerData("timer",chrome.storage.local)
                data.then((result) => {
                    let timer = result["timer"]
                    if(timer){
                        timer["workSubDiffer"] = timer["workDiffer"]
                        timer["restSubDiffer"] = timer["restDiffer"]
                        chrome.storage.local.set({'timer':timer},function(){})
                    }
                    send(timer["workDiffer"])
                }).catch({
                    
                })

                break;

            case "restart":
                send("restart")
                break;
        }
    }
    return true
})