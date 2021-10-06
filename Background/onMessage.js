import {getTimerData} from "./getTimerData.js"
import {chromeActionSetBadgeText} from "./chromeActionSetBadgeText.js"
import { resGetStoChangedData } from "./resGetStoChangedData.js"


chrome.runtime.onMessage.addListener(function (req, sender, send) {
    //フロント側ページ読み込み時
    if (req["event"] === "contentLoad") {
        let workData = getTimerData("work",chrome.storage.local)
        let restData = getTimerData("rest",chrome.storage.local)

        let resObj = {}
        Promise.all([workData,restData]).then((values) => {
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
                    
                    chrome.storage.local.set({"stoChanged":true})
                    //まだ一度もタイマーを起動してない場合
                    if(!workObj.isEvent && !restObj.isEvent){

                        chrome.alarms.create("work", {
                            when:Date.now() + 1000
                        });

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

                                send("再スタート")
                            }
                        })

                    } else if(restObj.isEvent){
                        //休憩時間起動時
                        //ストップボタンが押されている場合
                        rest.then((e) => {
                            if(!e){
                                chrome.alarms.create("rest", {
                                    when:Date.now() + 1000
                                });
                                
                                send("再スタート")
                            }
                        })
                    }
                }).catch((e) => {
                    send(e)
                })

                break;
            }

            case "stop":{
                chrome.alarms.clear("work")
                chrome.alarms.clear("rest")
                break;
            }

            case "reset":{
                chrome.alarms.clear("work")
                chrome.alarms.clear("rest")

                const work = getTimerData("work",chrome.storage.local)
                const rest = getTimerData("rest",chrome.storage.local)

                Promise.all([work,rest]).then((values) => {
                    let restObj = {}
                    let workObj = {}

                    //休憩時間
                    if(values[1]){
                        restObj = values[1]["rest"]
                        restObj["restSubDiffer"] = restObj["restDiffer"]
                        restObj["isEvent"] = false
                    }

                    //作業時間
                    if(values[0]){
                        workObj = values[0]["work"]
                        workObj["workSubDiffer"] = workObj["workDiffer"]
                        workObj["isEvent"] = false
                    }
                    const obj = {
                        "rest":restObj,
                        "work":workObj
                    }

                    let workDiffer = workObj["workDiffer"]

                    chrome.storage.local.set({"stoChanged":false})
                    chrome.storage.local.set(obj)

                    let actionObj = {
                        text:(workDiffer / 60000).toString() + "分"
                    }
                    chrome.action.setBadgeText(actionObj)
                    send(workObj["workDiffer"])
                })
                
                chromeActionSetBadgeText(60000)
                const badgeBackColor = {
                    "color":"#FF0000"
                }

                chrome.action.setBadgeBackgroundColor(badgeBackColor)
                break;
            }

            case "restart":
                send("restart")
                break;
        }
    }
    return true
})