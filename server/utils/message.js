const moment = require('moment');
let generateMessage =(from,text)=>{
    return {from,
            text,
            createdAt: moment().valueOf()
            };
};
let generateMessage2=(from,text)=>{
    return{
        "from":from,
        "text":text
    }
};
module.exports={generateMessage,generateMessage2};