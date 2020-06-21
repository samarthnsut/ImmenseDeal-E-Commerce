const Chatbox= require('../modals/chatbox');
const db = require("./moongose");
const express =require('express')
const { profile } = require('console');
const cookieParser = require('cookie-parser')


module.exports.chatSocket = function(chatServer){
    let io = require('socket.io')(chatServer);

    io.sockets.on('connection', function(socket){
      console.log("new connection established")


    ///  checking for available chat room 
       socket.on('joinroom',async function(data){
          
    
          socket.join(data.chatboxID)
          console.log("chat box joined")

        
          let chatbox= await Chatbox.findById(data.chatboxID) 
          io.in(data.chatboxID).emit('user_joined',data)
            console.log("chatbox found",chatbox)
      })


     

    socket.on('send_message',function(data){
      io.in(data.chatroomID).emit('recive_msg',data)
    })
  })

   
}