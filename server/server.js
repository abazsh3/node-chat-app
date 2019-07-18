const path = require('path');
let express = require('express');
let publicPath=path.join(__dirname,"../public");
let app =express();

app.use(express.static(publicPath));
app.listen(process.env.PORT || 3000, function(){
    console.log('listening on', process.env.PORT || 3000);
});