chrome.storage.onChanged.addListener(function(changes,namespace){
    //時間が変更された場合
    const key = Object.keys(changes)[0]
    const value = changes[key]
    const newValue = value["newValue"]
    const oldValue = value["oldValue"]
    switch(key){
        case "differ":
            let secMinHourOBj = secMinHour(changes[key]["newValue"])
            setValue(secMinHourOBj["sec"],secMinHourOBj["min"],secMinHourOBj["hour"])
            break;

        case "work":
            
            if(newValue["workSubDiffer"] !== oldValue["workSubDiffer"]){
                if(oldValue["workSubDiffer"] === 0){
                    //作業時間が終了した場合
                    chrome.storage.local.get("rest",(res) => {
                        if(res){
                            const restDiffer = res["restDiffer"]
                            differSet(restDiffer)
                        }
                    })
                } else {
                    differSet(newValue["workSubDiffer"])
                }
            }
            break;

        case "rest":

            if(newValue["restSubDiffer"] !== oldValue["restSubDiffer"]){
                if(oldValue["restSubDiffer"] === 0){
                    chrome.storage.local.get("work",(res) => {
                        if(res){
                            const workDiffer = res["workDiffer"]
                            differSet(workDiffer)
                        }
                    })
                } else {
                    differSet(newValue["restSubDiffer"])
                }
            }
            break;
        
        case "timer":

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