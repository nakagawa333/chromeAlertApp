chrome.storage.onChanged.addListener(function(changes,namespace){
    //時間が変更された場合
    const key = Object.keys(changes)[0]
    switch(key){
        case "differ":
            let secMinHourOBj = secMinHour(changes[key]["newValue"])
            setValue(secMinHourOBj["sec"],secMinHourOBj["min"],secMinHourOBj["hour"])
            break;
        
        case "timer":
            console.log(changes)
    }
})