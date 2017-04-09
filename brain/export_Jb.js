((lib)=>{
    if(typeof module == undefined && typeof module.exports == undefined){
        window.Jbrain = lib;
    }
    else{
        module.exports = lib;
    }
})(Jbrain);