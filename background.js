chrome.runtime.onInstalled.addListener(() => {
    //localStorage.setItem("state",true)
})

// chrome.storage.sync.get(["first","last","sex"],function(value){
//     console.log(value)
// })

// chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
//     chrome.scripting.executeScript({
//         target: {tabId: tabId},
//         files: ["./foreground.js"]
//     })
// })