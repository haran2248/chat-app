const express=require('express')
const http=require('http')
const path=require('path')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('../src/utils/messages')
const {removeUser,addUsers,getUser,getUsersInRoom}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const PORT=process.env.PORT||3000

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))
let count=0
io.on('connection',(socket)=>{
    console.log('New web socket connection')
    // socket.emit('countUpdated',count)
    // socket.on('increment',()=>{
    //     count++
    //     io.emit('countUpdated',count)
    // })

    socket.on('join',(options,callback)=>{
        const {error,user}=addUsers({id:socket.id,...options})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username+' has joined'))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()

    })
    socket.on('mess',(mess,callback)=>{
        console.log('Message',mess)
        const filter=new Filter()
        if(filter.isProfane(mess))
        {
            return callback('Profanity is not allowed')
        }
        const user=getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,mess))
        callback()
    })
    socket.on('sendLocation',(longitude,latitude,callback)=>{
    //    io.emit('longitude',longitude)
    //    io.emit('latitude',latitude)
       const User=getUser(socket.id)
       io.to(User.room).emit('locationShared',generateLocationMessage(User.username,'https://google.com/maps?q='+latitude+','+longitude))
       callback()
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(user.username+' has exited!'))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })
})

server.listen(PORT,()=>{
    console.log('Server up on Port'+PORT );
})