const users=[]
const usersInRoom=[]

const addUsers=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username||!room){
        return{
            error:'Username and room are required'
        }
    }


const existingUser=users.find((user)=>{
    return user.room===room && user.username===username
})

if(existingUser){
    return{
        error:'Username in use'
    }
}
const user={id,username,room}
users.push(user)
return {user}
}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}
const getUser=(id)=>{
   return users.find((user)=>user.id===id) 
}
const getUsersInRoom=(room)=>{
    
        return users.filter((user)=>user.room===room)
    }

// addUsers({
//     id:22,
//     username:'Hari',
//     room:'320R'
// })
// console.log(users)
// const getUserD=getUser(22)
// console.log(getUserD)

// //const removedUser=removeUser(22)
// //console.log(removedUser)
// const res=addUsers({
//     id:33,
//     username:'Krishna',
//     room:'320'
// })
// console.log(getUsersInRoom('320r'))

// console.log(users)
module.exports={
    addUsers,
    getUser,
    getUsersInRoom,
    removeUser
}