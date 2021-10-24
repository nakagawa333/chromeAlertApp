chrome.runtime.onInstalled.addListener(function(details){
    chrome.alarms.clearAll()
    //1時間
    //let workDiffer = 60000 * 60

    let workDiffer = 60000 * 1
    let work = {
        "workDiffer":workDiffer,
        "workSubDiffer":workDiffer,
        "isEvent":false
    }

    //5分
    let restDiffer = 60000 * 2
    let rest = {
        "restDiffer":restDiffer,
        "restSubDiffer":restDiffer,
        "isEvent":false
    }

    chrome.storage.local.set({"notification":true})
    chrome.storage.local.set({"speak":false})

    let speakSettingObj = 
    {
        "pitch": 1.0,
        "rate": 1.0,
        "voiceName": "Microsoft Ayumi - Japanese (Japan)"
    }

    chrome.storage.local.set({"speackSetting":speakSettingObj})

    chrome.storage.local.set({'work':work})
    chrome.storage.local.set({'rest':rest})
    chrome.storage.local.set({"stoChanged":true})
});