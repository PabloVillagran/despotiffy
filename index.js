const http = require('https');
const fs = require('fs');


const register = (obj)=>{
    obj.items.forEach((item)=>{
        var content = item.track.name + ' - ' + item.track.artists[0].name + ' - ' + item.track.album.name + '\n';
        fs.appendFileSync('D:/home/tracks.txt', content);
    });
}

const limit = 50;
var offset = 0;
const TOKEN = 'accessToken';
const TRACKS_SIZE = 1100;

for(let i = 0; i<TRACKS_SIZE; i+= 50){
    const options = {
        hostname: "api.spotify.com",
        port: 443,
        path: "/v1/me/tracks?market=GT&limit="+limit+"&offset="+i,
        method: "GET",
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+TOKEN
        }
    }
    
    const req = http.request(options, (res)=>{
        if(res.statusCode == 200){
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                var obj = JSON.parse(body);
                register(obj);
            });
        }else{
            console.log('failed at '+ i);
        }
    });
    
    req.end();
}
