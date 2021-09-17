function getSecMinHour(differ){
    let sec = new String(Math.floor(differ/1000) % 60)
    let min = new String(Math.floor(differ/1000/60) % 60)
    let hour = new String(Math.floor(differ/3600000))

    sec = sec.length === 1 ? "0" + sec : sec
    min = min.length === 1 ? "0" + min : min
    hour = hour.length === 1 ? "0" + hour : hour
    return {"sec":sec,"min":min,"hour":hour}
}