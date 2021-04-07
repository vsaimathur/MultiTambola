
var roomSockets = {} // {roomNo : [socket1ID,socket2ID]}
var socketRoom = {} // {socketID : RoomID}
var socketNames = {} //{socketID : Name}
var socketNoTickets = {} // {socketID : noTickets}
var randomRoomID = null;

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

//This funtion returns a list which contains the names of all the players in that room.
const getRoomPlayers = (data) => {
    let roomPlayerNames = []
    
    if(!roomSockets[data.roomID]) return [];
    roomSockets[data.roomID].map((socketID) => {
        roomPlayerNames.push(socketNames[socketID]);
    })
    return roomPlayerNames;
}

io.on("connection", (socket) => {
    console.log("new socket created with ID : ", socket.id);

    //It takes host player info. ,creates a new room, joins this host in that room & 
    //emits the randomly generated ROOM_ID to the host player/socket only.
    socket.on("CREATE_ROOM_ID", (data) => {
        randomRoomID = ((Math.floor(Math.random() * 1000000) + 1000000) % 1000000).toString();
        roomSockets[randomRoomID] = [socket.id]
        socketRoom[socket.id] = randomRoomID;
        socketNames[socket.id] = data.hostName;
        socketNoTickets[socket.id] = data.noTickets;
        socket.join(randomRoomID);
        io.to(socket.id).emit("ROOM_ID_GENERATED", {
            roomID: randomRoomID
        });
        // console.log(roomSockets,socketRoom,socketNames,socketNoTickets);
    })

    //Game Start Is Handled here
    socket.on("GAME_START", () => {
        console.log("Game Started!");
    })

    //Join room request is handled here when a player clicks join button in Join Room Page
    //adding the newly joined players to a room & emitting (updated no. of players in room List) to newly joined client & already 
    //joined client 
    socket.on("JOIN_ROOM_REQ", (data) => {
        if (roomSockets[data.roomID]) {
            roomSockets[data.roomID].push(socket.id);
        }
        socketNames[socket.id] = data.playerName;
        socketRoom[socket.id] = data.roomID;
        socketNoTickets[socket.id] = data.noTickets;
        console.log(roomSockets);
        socket.join(data.roomID)
        io.to(data.roomID).emit("ROOM_PLAYER_NAMES", {
            roomPlayerNames : getRoomPlayers(data)
        });
        socket.emit("JOIN_ROOM_ACK");
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

//need to write logic for handleGameStartButton in CreateNewRoom.js
//need to disable input are submitting player info. to server in CreateNewRoom.js & JoinRoom.js
//need to check if entered room exists or not in JoinRoom.js page.

//** Problems & Temp Sol'n: */

//Problem 1: There is problem with form submission of data
//Solution 1: temp sol'n => used onClick

//Problem 2: Write for Join Room logic from server to gameroom after learning .env files (JoinRoom.js) 
// Solution 1: Solved this problem temporarily by making client redirect using useHistory Hook
    

//Probelm 3: Live Count of players Feature implementation for host to start the game
//Sub Problem 3a: Player Live Count (Learn useCallback & then write the necessary use effect statements) -> there is a problem with re-render
// as we're using only 1 useEffect to render  (In createRoomJS)
// Sub Problem 3b & other view Consideration: Also considered only sending new player name to clients that already joined but, they newly joined client wont receive the info. 
// about the clients/ players who joined before this new client/ player.
//Solution 1: Solved this problem by sending playerNames in each room to all the clients/ players in that room and then displaying the
// length of players list (will be updated whenever new player joins the room) in host page (createroom page) 



