window.onload = (e) => {

    chrome.runtime.sendMessage({
        event:"onload"

    },function(response){
        console.log(response)
    })
    
    const buattonStart = document.getElementById("button_start")
    //start押下
    buattonStart.onclick = (e) => {

        chrome.runtime.sendMessage({
            event: "click",
            state: "start"
        }, function(response) {
            if(response === "スタート"){
                let startAudio = new myAudio("./Audio/start.wav")
                startAudio.audioLoad()
                console.log(startAudio.readyState)
            }
        });
    }

    //stop押下
    const buttonStop = document.getElementById("button_stop")
    buttonStop.onclick = (e) => {
        chrome.runtime.sendMessage({
            event: "click",
            state:"stop"
        }, function(response){

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
        chrome.storage.local.get(key, function(result) {
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