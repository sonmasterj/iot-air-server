const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const authMiddleware = require('./middleware/authMiddleware')
const jwtService = require('./services/jwtService')
const cors = require('cors')
// const { randomUUID } = require('crypto')
const rateLimit = require('express-rate-limit').default
const loginLimit = rateLimit({
    windowMs:1000,
    max:1,
    standardHeaders: true,
    message:JSON.stringify({message:'Too many request login!'}) ,
	legacyHeaders: false
})
const calibLimit = rateLimit({
    windowMs:1000,
    max:1,
    standardHeaders: true,
    message:JSON.stringify({message:'Too many request login!'}) ,
	legacyHeaders: false
})
const PORT = 8000
let config={
    type:'',
    target:-1
}
let app = express()
app.disable('x-powered-by');
app.use(cors())
app.use(bodyParser.json({limit: '10kb'}))
app.use('/',express.static('public'))


// const server = require("http").Server(app);
// const io = require('socket.io')(server,{
//     cors: {
//         origin: '*',
//     }
// })
// let allClient=[]
// io.use((socket,next)=>{
//     if(allClient.length===1){
//         return next(new Error('Maximum connection!Please retry later!'))
//     }
//     next()
// })
// io.on('connection',(socket)=>{
//     console.log("a user connected:",socket.id)
//     allClient.push(socket.id)
//     socket.on('disconnect',()=>{
//         console.log('user disconnected:',socket.id)
//         if(allClient[0]===socket.id)
//         {
//             allClient = []
//             console.log('reset user id')
//         }
        
//     })
// })
app.post('/login',loginLimit,(req,res,next)=>{
    let {username,password}= req.body
    if(username!=='iot_demo' && password!=='iotdemo2022@123'){
        return res.json({
            code:'001'
        })
    }
    let token = jwtService.sign({
        id:'fksdf2312',
        role:1
    })
    // let tokenLong = jwtService.sign({
    //     id:'dfasdf32',
    //     role:1
    // },true)
    // console.log(tokenLong)
    res.json({
        code:'000',
        token:token
    })

})
app.post('/calib',loginLimit,authMiddleware(),(req,res,next)=>{
    // console.log('calib')
    let {type,target}= req.body
    if(!type || !target){
        return res.json({
            code:'002'
        })
    }
    let arr=['so2','co','no2']
    if(!arr.includes(type)){
        return res.json({
            code:'002'
        })
    }
    res.json({
        code:'000'
    })
    config={type,target}
})
app.get('/calib',calibLimit,authMiddleware(),(req,res,next)=>{
    res.json({
        code:'000',
        type:config.type,
        target:config.target
    })
})
app.get('/reset',loginLimit,authMiddleware(),(req,res,next)=>{
    // let {type}= req.body
    res.json({
        code:'000'
    })
    config={
        type:'',
        target:-1
    }
})
app.use(function (err, req, res, next) {
    // console.trace(err)
    return res.status(401).json({
        message: err.message
    })
})
app.listen(PORT, '0.0.0.0', () => {
    console.log(`app is listening on port ${PORT}`)
    
})