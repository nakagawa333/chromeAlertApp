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
            let sec = new String(Math.floor(differ/1000) % 60)
            let min = new String(Math.floor(differ/1000/60) % 60)
            let hour = new String(Math.floor(differ/100060/60))
    
            sec = sec.length === 1 ? "0" + sec : sec
            min = min.length === 1 ? "0" + min : min
            hour = hour.length === 1 ? "0" + hour : hour
    
            //タイマー完了した場合
            if(differ === 0) {
                js.intervalId = 0;
                 
                return false
            }
    
            setValue(sec,min,hour)
            js.differ = differ - TIME
    
            js.intervalId = setTimeout(main,TIME)
        },TIME)
    }

    stop(){
        this.clear()
    }

    reset(){
        this.clear()
        this.differ = this.DIFFER
    }

    restart(){
        this.clear()
        this.differ = this.DIFFER
        this.start()
    }

    clear(){
        clearTimeout(this.intervalId)
        this.intervalId = 0
    }

    set setTimer(time){
        this.time = time
    }
}