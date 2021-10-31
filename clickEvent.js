window.onload = (e) => {    
    const buattonStart = document.getElementById("button_start")
    //start押下
    buattonStart.onclick = (e) => {
        chrome.runtime.sendMessage({
            event: "click",
            state: "start"
        }, function(response) {
            //音声出力廃止
            // if(response === "スタート"){
            //     let startAudio = new myAudio("./Audio/start.wav")
            //     startAudio.audioLoad()
            // }
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
            if(typeof response === "number"){
                differSet(response)
            }
        });
    }
}

function differSet(differ){
    const DIFFER = differ
    let timeObj = getSecMinHour(DIFFER)

    let sec = timeObj["sec"]
    let min = timeObj["min"]
    let hour = timeObj["hour"]
    setValue(sec,min,hour)
}