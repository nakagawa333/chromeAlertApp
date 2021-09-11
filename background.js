chrome.runtime.onInstalled.addListener(details => {

    chrome.storage.sync.get(['timer'], function(result) {

        if(!result["timer"]){
            let now = new Date()
            //作業時間
            let workLaster = new Date(now.getTime())
            workLaster.setMinutes(now.getMinutes() + 1)
            //workValue = new Timer(now.getTime(), workLaster.getTime(), 1000)
        
            let workDiffer = workLaster.getTime() - now.getTime()

            //休憩時間
            let restLater = new Date(now.getTime())
            restLater.setMinutes(now.getMinutes() + 2)
            //restValue = new Timer(now.getTime(), restLater.getTime(), 1000)
            let restDiffer = restLater.getTime() - now.getTime()
            let timer = {
                "workDiffer":workDiffer,
                "restDiffer":restDiffer,
                "workSubDiffer":workDiffer,
                "restSubDiffer":restDiffer
            }
            chrome.storage.sync.set({'timer':timer},function(){})
        }
    });
});

chrome.runtime.onMessage.addListener(function (req, sender, send) {
    // if (req["event"] === "onload") {
    //     let timer = createTimeObj(workValue, restValue, workBool, restBool)
    //     send(timer)
    // }

    if (req["event"] === "click") {
        switch (req["state"]) {
            case "start":
                chrome.alarms.get("work",function(res){
                    if(!res){
                        chrome.alarms.create("work", {
                            when:Date.now() + 1000
                        });
                    } else {
                        console.log("必要ないね")
                    }
                })

                send("成功しました")
                break;

            case "stop":
                //workValue.stop()
                break;

            case "reset":
                //workValue.reset()
                chrome.alarms.clearAll()
                send("reset")
                break;

            case "restart":
                send("restart")
                break;
        }
    }
    return true
})

chrome.alarms.onAlarm.addListener(e => {
    if(e.name === "work"){
        chrome.storage.sync.get('timer', function(result) {
            let timer = result["timer"]
            if(timer){
                let workSubDiffer = timer["workSubDiffer"]
                if(0 < workSubDiffer){
                    workSubDiffer -= 1000
                    timer["workSubDiffer"] = workSubDiffer

                    chrome.alarms.create("work", {
                        when:Date.now() + 1000
                    });

                } else {
                    timer["workSubDiffer"] = timer["workDiffer"]
                    chrome.alarms.create("rest", {
                        when:Date.now() + 1000
                    });
                }
                chrome.storage.sync.set({'timer':timer},function(){})
            }
        });

    } else if(e.name === "rest"){
        chrome.storage.sync.get('timer', function(result) {
            let timer = result["timer"]
            if(timer){
                let restSubDiffer = timer["restSubDiffer"]
                if(0 < restSubDiffer){
                    restSubDiffer -= 1000
                    timer["restSubDiffer"] = restSubDiffer
        
                    chrome.alarms.create("rest", {
                        when:Date.now() + 1000
                    });
        
                } else {
                    timer["restSubDiffer"] = timer["restDiffer"]
                    chrome.alarms.create("work", {
                        when:Date.now() + 1000
                    });
                }
                chrome.storage.sync.set({'timer':timer},function(){})
            }
        });        
    }
})

function chromeAlertCreate(name,event,minutes){
    chrome.alarms.create(name, {
        event: minutes
    });    
}

function getTimerData(key) {
    return new Promise((res, rej) => {
        chrome.storage.sync.get(key, function (result) {
            if (chrome.runtime.lastError) return rej(chrome.runtime.lastError);
            return res(result)
        });
    })
}

class Timer {
    constructor(now, limit, time) {
        this.intervalId = 0;
        this.now = now;
        this.limit = limit;
        this.time = time
        this.differ = limit - now
        //differ 初期値を保存
        //基本的に値を変更できないようにする
        Object.defineProperty(
            this,
            "DIFFER", {
            value: this.limit - this.now
        }
        )
    }

    start() {
        const TIME = this.time
        let js = this
        if (js.intervalId !== 0) return false
        js.intervalId = setTimeout(function main() {
            let differ = js.differ
            chrome.storage.sync.set({ 'differ': differ }, function (result) {

            });

            //タイマー完了した場合
            if (differ === 0) {
                js.intervalId = 0;
                js.differ = js.DIFFER
                let audio = new Audio("./Audio/start.wav")
                audio.play()
                return false
            }

            // let timer = createTimeObj(workValue,restValue,workBool,restBool)
            // chrome.storage.sync.set({"timer":timer},function(result){

            // })

            js.differ = differ - TIME
            js.intervalId = setTimeout(main, TIME)
        }, TIME)
    }

    stop() {
        this.clear()
        // chrome.storage.sync.set({'differ': this.differ}, function(result) {

        // });
    }

    reset() {
        this.clear()
        this.differ = this.DIFFER - 1000
    }

    // restart(){
    //     this.clear()
    //     this.differ = this.DIFFER - 1000
    //     this.start()
    // }

    clear() {
        clearTimeout(this.intervalId)
        this.intervalId = 0
    }

    set setTimer(time) {
        this.time = time
    }
}


function createTimeObj(workValue, restValue, workBool, restBool) {
    let timer = {
        "workTime": {
            "bool": workBool,
            "value": workValue
        },

        "restTime": {
            "bool": restBool,
            "value": restValue
        }
    }
    return timer
}

