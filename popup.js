//chromeストレージが変更された場合
chrome.storage.onChanged.addListener(function(changes,namespace){
    resGetStoChangedData("stoChanged",chrome.storage.local).then(res => {
        //キャンセル押下以外処理を実行
        if(res["stoChanged"]) setValue(changes)
    })

    function setValue(changes){
        //時間が変更された場合
        const key = Object.keys(changes)[0]
        const value = changes[key]
        const newValue = value["newValue"]
        const oldValue = value["oldValue"]

        switch(key){
            case "differ":
                let secMinHourOBj = getSecMinHour(changes[key]["newValue"])
                setValue(secMinHourOBj["sec"],secMinHourOBj["min"],secMinHourOBj["hour"])
                break;

            case "work":
                
                if(newValue["workSubDiffer"] !== oldValue["workSubDiffer"]){
                    if(oldValue["workSubDiffer"] === 0){
                        //作業時間が終了した場合
                        resGetStoChangedData("rest",chrome.storage.local).then(res => {
                            if(res) differSet(res["rest"]["restDiffer"])
                        })

                    } else {
                        differSet(newValue["workSubDiffer"])
                    }
                }
                break;

            case "rest":

                if(newValue["restSubDiffer"] !== oldValue["restSubDiffer"]){
                    if(oldValue["restSubDiffer"] === 0){
                        //休憩時間が終了した場合
                        resGetStoChangedData("work",chrome.storage.local).then(res => {
                            if(res) differSet(res["work"]["workDiffer"])
                        })
                        
                    } else {
                        differSet(newValue["restSubDiffer"])
                    }
                }
                break;
            
            case "timer":
                if(newValue["workSubDiffer"] !== oldValue["workSubDiffer"]){
                    oldValue["workSubDiffer"] === 0 ? differSet(newValue["restDiffer"]) : differSet(newValue["workSubDiffer"])
                } else if(newValue["restSubDiffer"] !== oldValue["restSubDiffer"]){
                    oldValue["restSubDiffer"] === 0 ?differSet(newValue["workDiffer"]) : differSet(newValue["restSubDiffer"])
                }
            }
        }
})