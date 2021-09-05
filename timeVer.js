var Ver = function(){
    this._val = 0
}

Ver.prototype.setValue = function(val){
    switch(val){
        //初期値
        case 0:
            this._val = 1
            break

        //作業
        case 1:
            this._val = 2
            break

        //休憩
        case 2:
            this._val = 1
            break
            
    }
}

Ver.prototype.getValue = function(){
    return this._val
}
