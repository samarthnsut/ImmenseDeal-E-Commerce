class chatEngine{
    constructor(chatBoxId, cid){
       console.log("this is chat id",cid)
        this.chatBoxId= $(`#${chatBoxId}`)
        this.chatID=cid
        this.socket = io.connect('http://localhost:3000')
        if(cid){
            this.connectionhandler();
        }
    }

    connectionhandler(){
        let self = this
        this.socket.on('connect',function(){
            console.log("connection established using sockets")

            self.socket.emit('joinroom',{
               chatboxID: self.chatID
            });

    
          self.socket.on('user_joined',function(data){
              console.log("data of user : ",data)

                $('#send-msg').click(function(){
                    
                let msg= $('#chat-msg').val()
                console.log("inside click here is msg",msg)
                    if(msg!=' ')
                    {
                        self.socket.emit('send_msg',{
                            message: msg,
                            chatroomID: chatID
                        })
                    }
                })

                self.socket.on('recive_msg',function(data){
                    console.log("recived msg",data)
                    let nmsg=$('<li>')

                    let type='seller'

                    nmsg.append($('<span>',{
                        'html': data.message
                    }))

                    nmsg.addClass=(type);
                    $('#chat-list').append(nmsg)
                })
         
          })
        })

        
    }
}