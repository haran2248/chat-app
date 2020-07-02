const socket=io()

// socket.on('countUpdated',(count)=>{
//     console.log('The count has updated',count)
// })

// socket.on('longitude',(lo)=>{
//     console.log(lo)
// })
// socket.on('latitude',(la)=>{
//     console.log(la)
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })
const message=document.querySelector('input')
const messageForm=document.querySelector('#form')
const send_location=document.querySelector('#send-location')
const messages=document.querySelector('#messages')
const MessageTemplate=document.querySelector('#message-template').innerHTML
const LocationTemplate=document.querySelector('#location-template').innerHTML
const sideBarTemplate=document.querySelector('#sidebar-template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll=()=>{
    const newMessage=messages.lastElementChild
    const newMessageStyles=getComputedStyle(newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMesageHeight=newMessage.offsetHeight+newMessageMargin

    const visibleHeight=messages.offsetHeight
    const containerHeight=messages.scrollHeight
    const ScrollOffset=messages.scrollTop+visibleHeight
    if(containerHeight-newMesageHeight<=ScrollOffset){
        messages.scrollTop=messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(MessageTemplate,{
        user:message.user,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('locationShared',(loc)=>{
    console.log(loc)
    const htmloc=Mustache.render(LocationTemplate,{
        username:loc.username,
        loc:loc.url,
        createdAt:moment(loc.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',htmloc)
    autoscroll()
})
socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sideBarTemplate,{
        room,
        users
    })
    console.log(users)
    document.querySelector('#sidebar').innerHTML=html
})
messageForm.addEventListener('submit',(e)=>{
 
    e.preventDefault()
    const mess=e.target.elements.MessageField.value
    socket.emit('mess',mess,(error)=>{
        message.value=''
        message.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message delivered')
    })
})
send_location.addEventListener('click',(e)=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by browser')
    }

    send_location.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        const long=position.coords.latitude
        const lat=position.coords.longitude
        socket.emit('sendLocation',lat,long,()=>{
            send_location.removeAttribute('disabled')
            console.log('Location shared')
        })
    })

})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})