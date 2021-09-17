import {getTimerData} from "./getTimerData.js"

chrome.runtime.onMessage.addListener(function (req, sender, send) {

    //フロント側ページ読み込み時
    if (req["event"] === "contentLoad") {
        let workData = getTimerData("work",chrome.storage.local)
        let restData = getTimerData("rest",chrome.storage.local)

        Promise.all([workData,restData]).then((values) => {
            let work = getTimerData("work",chrome.alarms)
            let rest = getTimerData("rest",chrome.alarms)
            let obj = {
                "work":values[0]["work"],
                "rest":values[1]["rest"]
            }
            send(obj)

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

                const workData = getTimerData("work",chrome.storage.local)
                const restData = getTimerData("rest",chrome.storage.local)

                Promise.all([workData,restData]).then((value) => {
                    let workObj = value[0]["work"]
                    let restObj = value[1]["rest"]

                    //まだ一度もタイマーを起動してない場合
                    if(!workObj.isEvent && !restObj.isEvent){

                        chrome.alarms.create("work", {
                            when:Date.now() + 1000
                        });

                        workObj["isEvent"] = true
                        chrome.storage.local.set({"work":workObj})
                        send("スタート")

                    } else if(workObj.isEvent){
                        //作業時間起動時
                        work.then((e) => {
                            if(!e){
                                //作業用タイマー起動時
                                chrome.alarms.create("work", {
                                    when:Date.now() + 1000
                                });
                            }
                        })

                        send("再スタート")
                    } else if(restObj.isEvent){
                        //休憩時間起動時
                        //ストップボタンが押されている場合
                        rest.then((e) => {
                            console.log(e)
                            if(!e){
                                chrome.alarms.create("rest", {
                                    when:Date.now() + 1000
                                });                                
                            }
                        })
                        send("再スタート")
                    }
                }).catch((e) => {
                    send(e)
                })

                break;
            }

            case "stop":{
                chrome.alarms.clear("work")
                chrome.alarms.clear("rest")
                // const work = getTimerData("work",chrome.alarms)
                // const rest = getTimerData("rest",chrome.alarms)
                // Promise.all([work,rest]).then((values) => {
                //     let chrAlarmArr = values.filter((e) => e)
                //     if(chrAlarmArr.length !== 0){
                //         let name = chrAlarmArr[0]["name"]
                //         chrome.storage.local.get(name,function(e){
                //             console.log(e)
                //         })
                //     }
                // })
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

                    chrome.storage.local.get("work",function(e){
                        console.log(e)
                    })

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