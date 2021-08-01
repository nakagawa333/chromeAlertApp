function audioLoad(path){
    let audio = new Audio(path)
    if(audio.readyState === 4){
        audio.play()
    } else {
        audio.addEventListener("canplaythrough",(e) => {
            audio.removeEventListener("canplaythrough",arguments.callee)
            audio.play()
        })
    }
}