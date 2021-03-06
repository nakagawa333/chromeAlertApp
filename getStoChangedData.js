function getStoChangedData(key,func){
    return new Promise((res,rej) => {
        func.get(key,function(result){
            if (chrome.runtime.lastError) return rej(chrome.runtime.lastError);
            return res(result)
        })
    })
}

async function resGetStoChangedData(key,func){
    const result = await getStoChangedData(key,func)
    return result
}

