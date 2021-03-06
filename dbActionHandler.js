function handleDbEvents(collection, action, query, eventName, socket) {
    switch(action){
        case 'find':{
            collection.find(query).limit(100).toArray((err, res) =>{
            if(err) throw err;
             var newRews=[];
            if(res && res.length){
                res.map((obj)=>{
                    if(obj.date && (new Date(obj.date)-new Date()<0)){
                    newRews.push(obj);
                    }
                });
            }
            console.log("newRews", newRews);
            socket.emit(eventName, newRews);
            });
            break;
        }
        case 'insert': {
            var temp = [];
            collection.insert(query, (err, data)=>{
                temp.push(query)
                var temp1 = temp.map(function(info){
                info.date = new Date(info.date).toUTCString();
                var diff = Date.parse(new Date()) - Date.parse(new Date(info.date));
                if(diff >= 0) return info; else return;
                });
                socket.emit(eventName, temp1);
                var x = +new Date(query.date)
                var y =  Date.now();
                var z = y - x;
                console.log(z)
                sendStatus({
                    message: (z > 0)  ? "Message sent" : `Message scheduled to be sent on ${query.date}`,
                    clear: true
                });
            });
        }
    }
}


module.exports = {
   dbController :handleDbEvents
};