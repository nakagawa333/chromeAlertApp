function sleep(time){
    let waitTime = time * 1000;
    return new Promise((res,rej) => {
        setTimeout(() => {
            res()
        },waitTime)
    })
}

export {sleep}