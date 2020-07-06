class chatEngine{
    constructor(chatBoxId, cid, user){
        
       console.log("this is chat id",cid)
        this.chatBoxId= $(`#${chatBoxId}`)
        this.chatID=cid
        this.user=user
        this.socket = io.connect('https://immense-inlet-15409.herokuapp.com/')
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
            })

           self.socket.on('display',function(data){
             console.log("this is populated data in display",data)
             for(let messg of data.messagelist)
             {
                let nmsg=$('<li>')
                let type='other-msg'
                if(String(self.user)===String(messg.fromUser))
                { 
                    type='self-msg'
                }
                nmsg.append($('<span>',{
                    'html': messg.msgcontent
                }))
                nmsg.addClass(type);
                $('#chat-list').append(nmsg)
             }
           })

                 let msgform=$('#msg-form-data');
                 msgform.submit(function(e){
                    e.preventDefault();
                    //submitting form 
                    console.log("trying to view form data",msgform)
                    $.ajax({
                        type: 'post',
                        url:   `/createmsg/${self.chatID}`,
                        data: msgform.serialize(),
                        success: function(data){
                           console.log(data)
                           createMessage(data)
                        },error: function(err){
                            console.log(err.responseText)
                        }
                    });
                    $("#msg-form-data")[0].reset();
                    $('#sebd-msg').val = ''
                    let createMessage = function(data){
                        let msg = data.data.msg;
                        if(msg!=' ')
                        {
                            self.socket.emit('send_msg',{
                                message: msg,
                                chatroomID: self.chatID
                            })
                        }
                    }
                   
                       
                 })   
                    self.socket.on('recive_msg',function(data){
                        console.log("recived msg",data)
                        let nmsg = $('<li>')
    
                        let type='other-msg'
                         console.log("self user :",self.user)
                         console.log("message user",data.message.fromUser)
                        if(String(self.user)===String(data.message.fromUser))
                         {
                            console.log("inside a if recived here", data)
                             type='self-msg'
                         }
    
                        nmsg.append($('<span>',{
                            'html': ' '+ data.message.msgcontent+' '
                        }))
    
                        nmsg.addClass(type);
                        console.log("this is created msg",nmsg)
                     
                        $('#chat-list').append(nmsg)
                    })
          
        })

        
    }
}