window.onload = (e) => {
    const buattonStart = document.getElementById("button_start")
    
    const now = new Date()
    const later = new Date()
    //later.setHours(now.getHours() + 1)
    later.setMinutes(now.getMinutes() + 1)
    later.setSeconds(now.getSeconds() - 1)

    const t = new Timer(now.getTime(),later.getTime(),1000)

    //start押下
    buattonStart.onclick = (e) => {
        let audio = new myAudio("./Audio/start.wav")
        audio.audioLoad()
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
    }

    const buttonRestart = document.getElementById("button_restart")
    buttonRestart.onclick = (e) => {
        t.restart()
    }
}