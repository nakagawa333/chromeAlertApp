function getStoChangedData(key,func){
    return new Promise((res,rej) => {
        func.get(key,function(result){
            if (chrome.runtime.lastError) return rej(chrome.runtime.lastError);
            return res(result)
        })
    })
}

chrome.storage.onChanged.addListener(function(changes,namespace){
    let obj = {};
    async function resGetStoChangedData(key,func){
        const result = await getStoChangedData(key,func)
        return result
    }

    const chromeKey = "stoChanged"
    resGetStoChangedData(chromeKey,chrome.storage.local).then(res => {
        if(res[chromeKey]){
            setValue(changes)
        }
    }).catch((e) => {
        console.log(e)
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
                        chrome.storage.local.get("rest",(res) => {
                            if(res){
                                const reset = res["rest"]
                                const restDiffer = reset["restDiffer"]
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
                                const work = res["work"]
                                const workDiffer = work["workDiffer"]
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
        }
    
})