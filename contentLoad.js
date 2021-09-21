document.addEventListener('DOMContentLoaded', function(){
    chrome.runtime.sendMessage({
        event:"contentLoad"

    },function(response){
        if(response !== "失敗しました"){
            let work = response["work"]
            let rest = response["rest"]

            let workIsEvent = work["isEvent"]
            let restIsEvent = rest["isEvent"]

            if(!workIsEvent && !restIsEvent){
                differSet(work["workDiffer"])
            } else if(workIsEvent){
                //作業時間作動中
                differSet(work["workSubDiffer"])
            } else if(restIsEvent){
                //休憩時間作動中
                differSet(rest["restSubDiffer"])
            }
        }
    })   
});