document.addEventListener('DOMContentLoaded', function(){
    chrome.runtime.sendMessage({
        event:"contentLoad"

    },function(response){
        console.log("response",response)
        if(response !== "失敗しました"){
            let work = response["work"]
            let rest = response["rest"]

            let workIsEvent = work["isEvent"]
            let restIsEvent = rest["isEvent"]

            if(!workIsEvent && !restIsEvent){
                differSet(work["workDiffer"])
            } else if(workIsEvent){
                
                differSet(work["workSubDiffer"])
            } else if(restIsEvent){
                differSet(rest["restSubDiffer"])
            }
        }
    })
},false);