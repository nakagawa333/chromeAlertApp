window.onload = (e) => {
    const buattonStart = document.getElementById("button_start")

    let now = new Date()
    let later = new Date()
    later.setHours(now.getHours() + 1)
    let t = new Timer(now.getTime(),later.getTime(),1000)

    //start押下
    buattonStart.onclick = (e) => {
        if(t.intervalId === 0){
            t.differ = t.differ - 1000
            let audio = new myAudio("./Audio/start.wav")
            audio.audioLoad()
        }
        t.start()
    }

    //stop押下
    const buttonStop = document.getElementById("button_stop")
    buttonStop.onclick = (e) => {
        t.stop()
    }

    const buttonReset = document.getElementById("button_reset")
    //reset押下
    buttonReset.onclick = (e) => {
        t.reset()
        differSet(t)
    }

    const buttonRestart = document.getElementById("button_restart")
    buttonRestart.onclick = (e) => {
        differSet(t)
        t.restart()
    }
}

function differSet(t){
    const DIFFER = t.DIFFER
    let timeObj = secMinHour(DIFFER)

    let sec = timeObj["sec"]
    let min = timeObj["min"]
    let hour = timeObj["hour"]
    setValue(sec,min,hour)
}