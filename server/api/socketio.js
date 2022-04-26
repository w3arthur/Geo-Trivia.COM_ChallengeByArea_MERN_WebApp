
async function ioTransmitter(io, serverMessage, action){
    try{
        const successData = await action();
        if(successData)io.emit(serverMessage, successData);
    }catch(message){
        io.emit(serverMessage, {error: true, message: message});
        console.log(`-errored socket (${message})`);
    }

}

function receiver(socket, serverReceiveMessage, action){
    socket.on(serverReceiveMessage, (message) => { 
        action(message);
        console.log(`socket (${serverReceiveMessage}),received message (${typeof(message) === 'object' ?JSON.stringify(message) : message})`);
    });
}


module.exports = { ioTransmitter, receiver }