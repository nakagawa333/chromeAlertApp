import {getTimerData} from "./getTimerData.js"

chrome.runtime.onMessage.addListener(function (req, sender, send) {

    //フロント側ページ読み込み時
    if (req["event"] === "onload") {
        let workData = getTimerData("work",chrome.storage.local)
        let restData = getTimerData("rest",chrome.storage.local)


        Promise.all([workData,restData]).then((values) => {
            let work = getTimerData("work",chrome.alarms)
            let rest = getTimerData("rest",chrome.alarms)

            Promise.all([work,rest]).then((values) => {
                let workObj = {}
                let restObj = {}
                //
                if(values[0]){
                    workObj = values[0]
                } else if(values[1]){
                    restObj = values[1]
                }

                let obj = {
                    "work":workObj,
                    "rest":restObj
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

        switch (req["state"]) {
            case "start":{
                const work = getTimerData("work",chrome.alarms)
                const rest = getTimerData("rest",chrome.alarms)

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
            }

            case "stop":{
                const work = getTimerData("work",chrome.alarms)
                const rest = getTimerData("rest",chrome.alarms)
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
            }

            case "reset":{
                chrome.alarms.clear("work")
                chrome.alarms.clear("rest")

                const work = getTimerData("work",chrome.storage.local)
                const rest = getTimerData("rest",chrome.storage.local)

                Promise.all([work,rest]).then((values) => {
                    //休憩時間
                    if(values[1]){
                        let restObj = values[1]["rest"]
                        restObj["restSubDiffer"] = restObj["restDiffer"]
                        restObj["isEvent"] = false
                        chrome.storage.local.set({"rest":restObj})
                    }

                    //作業時間
                    if(values[0]){
                        let workObj = values[0]["work"]
                        workObj["workSubDiffer"] = workObj["workDiffer"]
                        workObj["isEvent"] = false
                        chrome.storage.local.set({"work":workObj})
                        send(workObj["workDiffer"])
                    }

                })
                break;
            }

            case "restart":
                send("restart")
                break;
        }
    }
    return true
})