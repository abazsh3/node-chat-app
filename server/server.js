const path = require('path');
let express = require('express');
let publicPath=path.join(__dirname,"../public");
let app =express();
let port = 3000;
app.use(express.static(publicPath));
app.listen(port,()=>{
   console.log(`app is running on port ${port}`)
});