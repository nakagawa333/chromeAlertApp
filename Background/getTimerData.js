function getTimerData(key,getFuc) {
    return new Promise((res, rej) => {
        getFuc.get(key, function (result) {
            if (chrome.runtime.lastError) return rej(chrome.runtime.lastError);
            return res(result)
        });
    })
}

export {getTimerData}