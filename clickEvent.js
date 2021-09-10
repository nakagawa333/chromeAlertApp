window.onload = (e) => {
    chrome.runtime.sendMessage({
        event:"onload"

    },function(response){
        let restTime = response["restTime"]
        console.log(response)
    })
    const buattonStart = document.getElementById("button_start")
    // chrome.storage.sync.get(["timer"],function(result){
    //     if(result["timer"]){
    //         let timer = result["timer"]
    //         let workTimeBool = timer.workTime.bool
    //         let restTimeBool = timer.restTime.bool

    //         if(!restTimeBool && !workTimeBool){
    //             differSet(timer.workTime.value.differ)

    //         } else if(restTimeBool && !workTimeBool){
    //             differSet(timer.restTime.value.differ)

    //         } else if(!restTimeBool && workTimeBool){
    //             differSet(timer.workTime.value.differ)

    //         }
    //     }
    // })
    //start押下
    buattonStart.onclick = (e) => {
        // if(t.intervalId === 0){
        //     t.differ = t.differ - 1000
        //     let audio = new myAudio("./Audio/start.wav")
        //     audio.audioLoad()
        // }

        chrome.runtime.sendMessage({
            event: "click",
            state: "start"
        }, function(response) {
            console.log("start",response)
        });
        //t.start()
    }

    //stop押下
    const buttonStop = document.getElementById("button_stop")
    buttonStop.onclick = (e) => {
        chrome.runtime.sendMessage({
            event: "click",
            state:"stop"
        }, function(response){
            console.log(response)
        })
    }

    const buttonReset = document.getElementById("button_reset")
    //reset押下
    buttonReset.onclick = (e) => {
        chrome.runtime.sendMessage({
            event: "click",
            state: "reset"
        }, function(response) {
            const diff = Number(response)
            differSet(diff)
        });
        // t.reset()
        // differSet(t)
    }

    // const buttonRestart = document.getElementById("button_restart")
    // buttonRestart.onclick = (e) => {
    //     chrome.runtime.sendMessage({
    //         event:"restart"
    //     },function(response){
    //         const diff = Number(response)
    //         differSet(diff)
    //     })
    //     // differSet(t)
    //     // t.restart()
    // }    
}

function getTimerData(key){
    return new Promise((res,rej) => {
        chrome.storage.sync.get(key, function(result) {
            if (chrome.runtime.lastError) {
                return rej(chrome.runtime.lastError);
            }
            return res(result)
        }); 
    })
}

function differSet(differ){
    const DIFFER = differ
    let timeObj = secMinHour(DIFFER)

    let sec = timeObj["sec"]
    let min = timeObj["min"]
    let hour = timeObj["hour"]
    setValue(sec,min,hour)
}