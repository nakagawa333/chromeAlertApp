var intervalId;
var nowTime;
var later;

window.onload = (e) => {
    sessionStorage.setItem("state",true)
    const buttonStart = document.getElementById("button_start")
    //start押下
    buttonStart.onclick = (e) => {
        if(!nowTime){
            const now = new Date()
            later = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours() + 1,now.getMinutes(),now.getSeconds())
            startTimer(1000,now,later)
        } else {
            startTimer(1000,nowTime,later)
        }
    }

    //stop押下
    const buttonStop = document.getElementById("button_stop")
    buttonStop.onclick = (e) => {
        clearTimeout(intervalId)
    }

    const buttonReset = document.getElementById("button_reset")
    //reset押下
    buttonReset.onclick = (e) => {
        clearTimeout(intervalId)
        nowTime = undefined
        setValue("00","00","01")
    }
}

function startTimer(timer,now,limit){
    intervalId = setTimeout(function main(){
        let differ = limit.getTime() - now.getTime()
        
        let sec = new String(Math.floor(differ/1000) % 60)
        let min = new String(Math.floor(differ/1000/60) % 60)
        let hour = new String(Math.floor(differ/1000/60/60))

        sec = sec.length === 1 ? "0" + sec : sec
        min = min.length === 1 ? "0" + min : min
        hour = hour.length === 1 ? "0" + hour : hour

        if(sec === "00" && min === "00" && hour === "00"){
            return false
        }

        setValue(sec,min,hour)
        now = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds() + 1)
        nowTime = now;

        intervalId = setTimeout(main,timer)
    },timer)
}