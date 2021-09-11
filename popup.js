chrome.storage.onChanged.addListener(function(changes,namespace){
    //時間が変更された場合
    const key = Object.keys(changes)[0]
    switch(key){
        case "differ":
            let secMinHourOBj = secMinHour(changes[key]["newValue"])
            setValue(secMinHourOBj["sec"],secMinHourOBj["min"],secMinHourOBj["hour"])
            break;
        
        case "timer":
            let timer = changes[key]
            let newValue = timer["newValue"]
            let oldValue = timer["oldValue"]
            if(newValue["workSubDiffer"] !== newValue["workDiffer"]){
                //作業タイマー作動時
                differSet(newValue["workSubDiffer"])
            } else if(newValue["workSubDiffer"] === newValue["workDiffer"]){
                //作業タイマーが終了した場合
                differSet(newValue["restSubDiffer"])
            } else if(newValue["restSubDiffer"] !== newValue["restDiffer"]){
                differSet(newValue["restSubDiffer"])
            } else if(newValue["restSubDiffer"] === newValue["restDiffer"]){
                differSet(newValue["restSubDiffer"])
            }
    }
})