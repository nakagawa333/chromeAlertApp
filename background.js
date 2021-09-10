let workValue;
let restValue;

let workBool = false;
let restBool = false;

chrome.runtime.onInstalled.addListener(details => {
    let now = new Date()
    //作業時間
    let workLaster = new Date()
    workLaster.setMinutes(now.getMinutes() + 1)
    workValue = new Timer(now.getTime(),workLaster.getTime(),1000)
    
    //休憩時間
    let restLater = new Date()
    restLater.setMinutes(now.getMinutes() + 2)
    restValue = new Timer(now.getTime(),restLater.getTime(),1000)
    // chrome.storage.sync.get(['timer'], function(result) {
    //     //初期、もしくはリセット時
    //     if(!result['timer']){
    //         let now = new Date()
    //         //作業時間
    //         let workLaster = new Date()
    //         workLaster.setMinutes(now.getMinutes() + 1)
    //         workValue = new Timer(now.getTime(),workLaster.getTime(),1000)
            
    //         //休憩時間
    //         let restLater = new Date()
    //         restLater.setMinutes(now.getMinutes() + 2)
    //         restValue = new Timer(now.getTime(),restLater.getTime(),1000)
    
    //         let timer = createTimeObj(workValue,restValue,workBool,restBool)
    
    //         chrome.storage.sync.set({'timer':timer}, function(result) {
    //             console.log("result",result)
    //         });
    
    //     } else {
    //         let timer = result["timer"]
    //         let workTime = timer["workTime"]["value"]
    //         let restTime = timer["restTime"]["value"]
    
    //         workValue = new Timer(workTime.now,workTime.limit,workTime.time)
    //         restValue = new Timer(restTime.now,restTime.limit,restTime.now)
    //     }
    // });
});

chrome.runtime.onMessage.addListener(function(req,sender,send){
    console.log(req["event"])
    if(req["event"] === "onload"){
        let timer = createTimeObj(workValue,restValue,workBool,restBool)
        send(timer)
    }
    
    if(req["event"] === "click"){
        switch(req["state"]){
            case "start":
                workValue.start()
                // if(!workBool && !restBool){
                //     workBool = true
                //     workValue.start()
                // } else if(workBool && !restBool){

                // }

                send("成功しました")
                break;
            
            case "stop":
                workValue.stop()
                break;
            
            case "reset":
                workValue.reset()
                send(workValue.DIFFER.toString())
                break;
            
            case "restart":
                workValue.restart()
                send(workValue.DIFFER.toString())
                break;
        }
    }
    return true
})

function getTimerData(key){
    return new Promise((res,rej) => {
        chrome.storage.sync.get(key, function(result) {
            if (chrome.runtime.lastError) return rej(chrome.runtime.lastError);
            return res(result)
        });
    })
}

class Timer{
    constructor(now,limit,time){
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
                value : this.limit - this.now
            }
        )
    }

    start(){
        const TIME = this.time
        let js = this
        if(js.intervalId !== 0) return false
        js.intervalId = setTimeout(function main(){
            let differ = js.differ
            console.log("differ",differ)
            chrome.storage.sync.set({'differ':differ}, function(result) {

            });

            //タイマー完了した場合
            if(differ === 0) {
                js.intervalId = 0;
                js.differ = js.DIFFER
                return false
            }

            // let timer = createTimeObj(workValue,restValue,workBool,restBool)
            // chrome.storage.sync.set({"timer":timer},function(result){

            // })

            js.differ = differ - TIME
            js.intervalId = setTimeout(main,TIME)
        },TIME)
    }

    stop(){
        this.clear()
        // chrome.storage.sync.set({'differ': this.differ}, function(result) {

        // });
    }

    reset(){
        this.clear()
        this.differ = this.DIFFER - 1000
    }

    // restart(){
    //     this.clear()
    //     this.differ = this.DIFFER - 1000
    //     this.start()
    // }

    clear(){
        clearTimeout(this.intervalId)
        this.intervalId = 0
    }

    set setTimer(time){
        this.time = time
    }
}


function createTimeObj(workValue,restValue,workBool,restBool){
    let timer = {
        "workTime": {
            "bool":workBool,
            "value":workValue
        },

        "restTime": {
            "bool":restBool,
            "value":restValue
        }
    }
    return timer
}
