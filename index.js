
var roomSockets = {} // {roomNo : [socket1ID,socket2ID]}
var socketRoom = {} // {socketID : RoomID}
var socketNames = {} //{socketID : Name}
var socketNoTickets = {} // {socketID : noTickets}
var roomsAvailable = [] // [room1, room2, room3]
var randomRoomID = null;
var MAX_ROOMID_LEN = 999999;
var MIN_ROOMID_LEN = 100000;

var CLIENT_URL = process.env.CLIENT_URL || "localhost:3000"

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const server = require("http").createServer(app);
const socket_io = require("socket.io");
const io = socket_io(server, {
    cors: {
        origin: "http://127.0.0.1:5000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

//This funtion returns a list which contains the names of all the players in that room. [***Can be improved by creating a global variable]
const getRoomPlayers = (data) => {
    let roomPlayerNames = []

    if (!roomSockets[data.roomID]) return [];
    roomSockets[data.roomID].map((socketID) => {
        roomPlayerNames.push(socketNames[socketID]);
    })
    return roomPlayerNames;
}

//This function check if a given room exists in the global rooms list and returns accordingly.
const getRoomAvailableStatus = (roomID) => {
    for (let i = 0; i < roomsAvailable.length; i++) {
        if (roomsAvailable[i] === roomID.toString().trim()) return true;
    }
    return false;
}

io.on("connection", (socket) => {
    console.log("new socket created with ID : ", socket.id);

    //It takes host player info. ,creates a new room, joins this host in that room & 
    //emits the randomly generated ROOM_ID to the host player/socket only.
    socket.on("CREATE_ROOM_ID", (data) => {

        //random roomID generation
        randomRoomID = (Math.floor(Math.random() * (MAX_ROOMID_LEN-MIN_ROOMID_LEN+1))).toString();
        console.log(randomRoomID);  
        roomSockets[randomRoomID] = [socket.id]
        socketRoom[socket.id] = randomRoomID;
        socketNames[socket.id] = data.hostName;
        socketNoTickets[socket.id] = data.noTickets;
        roomsAvailable.push(randomRoomID);

        //joining the host socket to created room.
        socket.join(randomRoomID);

        //emits the generated roomID to host socket.
        io.to(socket.id).emit("ROOM_ID_GENERATED", {
            roomID: randomRoomID
        });

        //we again emit the (updated live rooms available list) to all the clients as new room is added to the list.
        // console.log(roomSockets,socketRoom,socketNames,socketNoTickets);
    })

    //Game Start Is Handled here
    socket.on("GAME_START_REQ", () => {
        if (roomSockets[socketRoom[socket.id]][0] === socket.id) {
            io.to(socketRoom[socket.id]).emit("GAME_START_ACK");
        }
    })

    //Join room request is handled here when a player clicks join button in Join Room Page
    //adding the newly joined players to a room & emitting (updated no. of players in room List) to newly joined client & already 
    //joined client if the room exists else JOIN_ACK 
    socket.on("JOIN_ROOM_REQ", (data) => {
        let roomAvailStatusCheck = getRoomAvailableStatus(data.roomID);
        if (data.roomID < MIN_ROOMID_LEN || data.roomID > MAX_ROOMID_LEN || !data.roomID || data.playerName.trim() === "" || !roomAvailStatusCheck) {

            //emitting failed room doesn't exist or not found status only to socket/ client that tried to join.
            io.to(socket.id).emit("JOIN_ACK_ROOM_PLAYER_NAMES", {
                status : 404
            });
        }
        else {
            if (roomSockets[data.roomID]) {
                roomSockets[data.roomID].push(socket.id);
            }
            socketNames[socket.id] = data.playerName;
            socketRoom[socket.id] = data.roomID;
            socketNoTickets[socket.id] = data.noTickets;
            console.log(roomSockets);
            socket.join(data.roomID)

            //emitting success of socket/client to join the room to all the players in the room.
            io.to(data.roomID).emit("JOIN_ACK_ROOM_PLAYER_NAMES", {
                status : 200,
                roomPlayerNames: getRoomPlayers(data)
            });
        }
        
    })

    socket.on("disconnect", () => {
        console.log(`socket with ID : ${socket.id} disconnected..`);
    })

});

app.get("/", (req, res) => {
    res.send("This is start of Tambola Application!");
});


// if(process.env.NODE_ENV = "Production") {
//     app.use(express.static("client/build"));
// }

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


//**TODO */

//need to disable input are submitting player info. to server in CreateNewRoom.js & JoinRoom.js [✔]
//need to check if entered room exists or not in JoinRoom.js page. [✔]
//need to write alternative approch for room exists check. [✔]
//need to write logic for handleGameStartButton in CreateNewRoom.js


//** Problems & Temp Sol'n: */

//Problem 1: There is problem with form submission of data
//Solution 1: temp sol'n => used onClick

//Problem 2: Write for Join Room logic from server to gameroom after learning .env files (JoinRoom.js) 
// Solution 1: Solved this problem temporarily by making client redirect using useHistory Hook


//Problem 3: Live Count of players Feature implementation for host to start the game
//Sub Problem 3a: Player Live Count (Learn useCallback & then write the necessary use effect statements) -> there is a problem with re-render
// as we're using only 1 useEffect to render  (In createRoomJS)
// Sub Problem 3b & other view Consideration: Also considered only sending new player name to clients that already joined but, they newly joined client wont receive the info. 
// about the clients/ players who joined before this new client/ player.
//Solution 1: Solved this problem by sending playerNames in each room to all the clients/ players in that room and then displaying the
// length of players list (will be updated whenever new player joins the room) in host page (createroom page) 

//Realised wrong design & Alternatives
// current Approach : sending all rooms available to all the connected client & emitting new rooms list again to all client whenever new room is added.
// Alternative approch : Join Room Request needs to be sent to server and check if room exists in server & need to be sent back to server [TODO**]

