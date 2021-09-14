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
            if(newValue["workSubDiffer"] !== oldValue["workSubDiffer"]){
                if(oldValue["workSubDiffer"] === 0){
                    //作業時間が終了した場合
                    differSet(newValue["restDiffer"])
                } else {
                    differSet(newValue["workSubDiffer"])
                }
            } else if(newValue["restSubDiffer"] !== oldValue["restSubDiffer"]){
                if(oldValue["restSubDiffer"] === 0){
                    differSet(newValue["workDiffer"])
                } else {
                    differSet(newValue["restSubDiffer"])
                }
            }
    }
})