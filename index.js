
var roomSockets = {}; // {roomNo : [socket1ID,socket2ID]}
var socketRoom = {}; // {socketID : RoomID}
var socketNames = {}; //{socketID : Name}
var socketTickets = {}; // {socketID : ticketsArr} -> ticketsArr => [ticket1, ticket2, ...]
var roomsAvailable = []; // [room1, room2, room3]
var randomRoomID = null;
var MAX_ROOMID_LEN = 999999;
var MIN_ROOMID_LEN = 100000;
var roomBoard = {}; // {roomNumber : [0,0,0,0, .... 90 times for board]}
var roomSequence = {}; // {roomNumber : [87,32, ...... 90 numbers for sequence]}
var roomLastSequenceNumberReq = {}; // {roomNumber : seqNumberLast Requested}
var MAX_CHECK_LIMIT = 3; // limit for a socket / player to request for checking a win condition.
var socketWinConditionsCheckLimitCount = {};
var roomLastWinConditionUpdated = {}; // {roomNo : winConditionKey that last become unAvailable (i.e someone won it)};
var socketPoints = {}; // {socketid : points}
/*{ socket : winConditionsCheckLimit } -> winConditionsCheckLimit => {
    earlyFive: 0,
    topRow: 0,
    middleRow: 0,
    lastRow: 0,
    fullHousie: 0
}*/
var roomWinConditionsAvailableStatus = {};
/*{roomNumber : winConditionsAvailableStatus} -> winConditionsAvailableStatus => {
    earlyFive: true,
    topRow: true,
    middleRow: true,
    lastRow: true,
    fullHousie: true
}
*/

var ticketModel = [[0, 0, 0, 0, 1, 1, 1, 1, 1],
[0, 0, 0, 0, 1, 1, 1, 1, 1],
[0, 0, 0, 0, 1, 1, 1, 1, 1]]; //model for generating tickets

var prepBoard = [[1, 2, 3, 4, 5, 6, 7, 8, 9],
[10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
[20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
[30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
[40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
[50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
[60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
[70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
[80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]]; //this is used for generating random sequences in coloum of tickets

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
const { generateKeyPair } = require("crypto")
const io = socket_io(server, {
    cors: {
        origin: "http://127.0.0.1:5000",
        methods: ["GET", "POST"],
        credentials: true
    }
});


//This function check if a given room exists in the global rooms list and returns accordingly.
const getRoomAvailableStatus = (roomID) => {
    for (let i = 0; i < roomsAvailable.length; i++) {
        if (roomsAvailable[i] === roomID.toString().trim()) return true;
    }
    return false;
}

//This funtion returns a list which contains the names of all the players in that room. [***Can be improved by creating a global variable]
const getRoomPlayers = (roomID) => {
    let roomPlayerNames = []

    if (!roomSockets[roomID]) return [];
    roomSockets[roomID].map((socketID) => {
        roomPlayerNames.push(socketNames[socketID]);
    })
    return roomPlayerNames;
}

//Ticket Generation Logic

const shuffle = (arr) => {
    let tempArr = [...arr];
    for (let i = tempArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
    }
    return tempArr;
}

const newTicketGen = () => {
    let ticket = [...ticketModel];
    for (let i = 0; i < 3; i++) ticket[i] = shuffle(ticket[i]);

    for (let i = 0; i < 9; i++) {
        let tempArr = shuffle(prepBoard[i]).slice(0, 3).sort();
        for (j = 0; j < 3; j++) {
            ticket[j][i] *= tempArr[j];
        }
    }
    return ticket;
}

const genTickets = (no) => {
    let tickets = []
    for (let i = 0; i < no; i++) {
        tickets.push(newTicketGen());
    }
    return tickets;
}


// const getLiveNumGen = (socket) => {

//     if (!roomBoard[socketRoom[socket.id]]) {
//         roomBoard[socketRoom[socket.id]] = new Array(91).fill(0);
//     }
//     if (!roomSequence[socketRoom[socket.id]]) {
//         roomSequence[socketRoom[socket.id]] = [];
//     }
//     let tryNum = (1 + Math.round(Math.random() * 100)) % 91;
//     while (roomBoard[socketRoom[socket.id]][tryNum]) {
//         let tryNum = (1 + Math.round(Math.random() * 100)) % 91;
//     }
//     roomBoard[socketRoom[socket.id]][tryNum] = 1;
//     roomSequence[socketRoom[socket.id]].push(tryNum);
//     return tryNum;
// }

const genSequenceBoard = (socket) => {
    let count = 0;

    //initializing roomBoard, but will update this board live when host in purticular room requests for a number.
    if (!roomBoard[socketRoom[socket.id]]) {
        roomBoard[socketRoom[socket.id]] = new Array(91).fill(0);
    }

    //initializing roomSequence, generating entire sequence of numbers from 1 to 90, in some random order any storing according to room.
    if (!roomSequence[socketRoom[socket.id]]) {
        roomSequence[socketRoom[socket.id]] = [];
    }
    let tempBoard = new Array(91).fill(0);
    while (count < 90) {
        let tryNum = (1 + Math.round(Math.random() * 100)) % 91;
        while (tempBoard[tryNum] || !tryNum) {
            tryNum = (1 + Math.round(Math.random() * 100)) % 91;
        }
        tempBoard[tryNum] = 1;
        roomSequence[socketRoom[socket.id]].push(tryNum);
        count++;
    }
    console.log(roomSequence[socketRoom[socket.id]]);
}

//Ticket Check Logics

const EarlyFiveCheck = (ticketData, roomNo) => {
    let ticketsStatus = [];
    let cnt = 0;
    for (let i = 0; i < ticketData.length; i++) {
        for (let j = 0; j < ticketData[i].length; j++) {
            for (let k = 0; k < ticketData[i][j].length; k++) {
                if (roomBoard[roomNo][ticketData[i][j][k]]) cnt++;
            }
        }
        if (cnt >= 5) {
            ticketsStatus.push(true);
        } else {
            ticketsStatus.push(false);
        }
        cnt = 0;
    }
    return ticketsStatus.some((val) => val === true);
}

const TopRowCheck = (ticketData, roomNo) => {
    let ticketsStatus = [];
    let cnt = 0;
    for (let i = 0; i < ticketData.length; i++) {
        // checking only for 1 row.
        for (let k = 0; k < ticketData[i][0].length; k++) {
            if (roomBoard[roomNo][ticketData[i][0][k]]) cnt++;
        }
        if (cnt === 5) {
            ticketsStatus.push(true);
        } else {
            ticketsStatus.push(false);
        }
        cnt = 0;
    }
    return ticketsStatus.some((val) => val === true);
}

const MiddleRowCheck = (ticketData, roomNo) => {
    let ticketsStatus = [];
    let cnt = 0;
    for (let i = 0; i < ticketData.length; i++) {
        // checking only for 1 row.
        for (let k = 0; k < ticketData[i][1].length; k++) {
            if (roomBoard[roomNo][ticketData[i][1][k]]) cnt++;
        }
        if (cnt === 5) {
            ticketsStatus.push(true);
        } else {
            ticketsStatus.push(false);
        }
        cnt = 0;
    }
    return ticketsStatus.some((val) => val === true);
}

const LastRowCheck = (ticketData, roomNo) => {
    let ticketsStatus = [];
    let cnt = 0;
    for (let i = 0; i < ticketData.length; i++) {
        // checking only for 1 row.
        for (let k = 0; k < ticketData[i][2].length; k++) {
            if (roomBoard[roomNo][ticketData[i][2][k]]) cnt++;
        }
        if (cnt === 5) {
            ticketsStatus.push(true);
        } else {
            ticketsStatus.push(false);
        }
        cnt = 0;
    }
    return ticketsStatus.some((val) => val === true);
}

const FullHousieCheck = (ticketData, roomNo) => {
    let ticketsStatus = [];
    let cnt = 0;
    for (let i = 0; i < ticketData.length; i++) {
        for (let j = 0; j < ticketData[i].length; j++) {
            for (let k = 0; k < ticketData[i][j].length; k++) {
                if (roomBoard[roomNo][ticketData[i][j][k]]) cnt++;
            }
        }
        if (cnt === 15) {
            ticketsStatus.push(true);
        } else {
            ticketsStatus.push(false);
        }
        cnt = 0;
    }
    return ticketsStatus.some((val) => val === true);
}

const checkWinConditions = (winConditionsCheckReq, ticketData, socket) => {
    let winConditionsAckStatus = { ...winConditionsCheckReq };
    let roomNo = socketRoom[socket.id];
    Object.keys(winConditionsCheckReq).map((key) => {
        let tempStatusVar;
        if (roomWinConditionsAvailableStatus[roomNo][key] === true) {
            if (winConditionsCheckReq[key]) {
                if (socketWinConditionsCheckLimitCount[socket.id][key] < MAX_CHECK_LIMIT) {
                    if (key === "earlyFive") {
                        tempStatusVar = EarlyFiveCheck(ticketData, roomNo);
                        if (tempStatusVar) {
                            roomWinConditionsAvailableStatus[roomNo][key] = socket.id;
                            socketPoints[socket.id] += 5;
                            roomLastWinConditionUpdated[roomNo] = key;
                        }
                        winConditionsAckStatus[key] = tempStatusVar;

                    }
                    else if (key === "topRow") {
                        tempStatusVar = TopRowCheck(ticketData, roomNo);
                        if (tempStatusVar) {
                            roomWinConditionsAvailableStatus[roomNo][key] = socket.id;
                            socketPoints[socket.id] += 5;
                            roomLastWinConditionUpdated[roomNo] = key;
                        }
                        winConditionsAckStatus[key] = tempStatusVar;
                    }
                    else if (key === "middleRow") {
                        tempStatusVar = MiddleRowCheck(ticketData, roomNo);
                        if (tempStatusVar) {
                            roomWinConditionsAvailableStatus[roomNo][key] = socket.id;
                            socketPoints[socket.id] += 5;
                            roomLastWinConditionUpdated[roomNo] = key;
                        }
                        winConditionsAckStatus[key] = tempStatusVar;
                    }
                    else if (key === "lastRow") {
                        tempStatusVar = LastRowCheck(ticketData, roomNo);
                        if (tempStatusVar) {
                            roomWinConditionsAvailableStatus[roomNo][key] = socket.id;
                            socketPoints[socket.id] += 5;
                            roomLastWinConditionUpdated[roomNo] = key;
                        }
                        winConditionsAckStatus[key] = tempStatusVar;
                    }
                    else if (key === "fullHousie") {
                        tempStatusVar = FullHousieCheck(ticketData, roomNo);
                        if (tempStatusVar) {
                            roomWinConditionsAvailableStatus[roomNo][key] = socket.id;
                            socketPoints[socket.id] += 25;
                            roomLastWinConditionUpdated[roomNo] = key;
                        }
                        winConditionsAckStatus[key] = tempStatusVar;
                    }
                } else {
                    winConditionsAckStatus[key] = false;
                }

                socketWinConditionsCheckLimitCount[socket.id][key] += 1;
            }
        }
    });

    return winConditionsAckStatus;
}

const getWinConditionsAvailableStatusNames = (roomID) => {
    let roomWinConditionsAvailableStatusNames = { ...roomWinConditionsAvailableStatus[roomID] };
    Object.keys(roomWinConditionsAvailableStatusNames).forEach((key) => {
        if (socketNames[roomWinConditionsAvailableStatusNames[key]]) {
            roomWinConditionsAvailableStatusNames = { ...roomWinConditionsAvailableStatusNames, [key]: socketNames[roomWinConditionsAvailableStatusNames[key]] }
        }
    });
    return roomWinConditionsAvailableStatusNames;
}

const getFinalPodiumPlayersPoints = () => {
    return Object.keys(socketNames).map((socketID, index) => {
        return [socketNames[socketID], socketPoints[socketID]];
    });
}

io.on("connection", (socket) => {
    console.log("new socket created with ID : ", socket.id);

    //It takes host player info. ,creates a new room, joins this host in that room & 
    //emits the randomly generated ROOM_ID to the host player/socket only.
    socket.on("CREATE_ROOM_ID", (data) => {

        //random roomID generation
        randomRoomID = (Math.floor(Math.random() * (MAX_ROOMID_LEN - MIN_ROOMID_LEN + 1))).toString();
        console.log(randomRoomID);
        roomSockets[randomRoomID] = [socket.id]
        socketRoom[socket.id] = randomRoomID;
        socketNames[socket.id] = data.hostName;

        //ticket generation for host socket in room.
        socketTickets[socket.id] = genTickets(data.noTickets);

        //initializing the default points for the player / socket.
        socketPoints[socket.id] = 5;
        //initializing room winConditions State.
        roomWinConditionsAvailableStatus[randomRoomID] = {
            earlyFive: true,
            topRow: true,
            middleRow: true,
            lastRow: true,
            fullHousie: true
        };

        //initializing limitChecker for checking winCondition by player / socket / client.
        socketWinConditionsCheckLimitCount[socket.id] = {
            earlyFive: 0,
            topRow: 0,
            middleRow: 0,
            lastRow: 0,
            fullHousie: 0
        };
        roomsAvailable.push(randomRoomID);

        //joining the host socket to created room.
        socket.join(randomRoomID);

        //emits the generated roomID to host socket.
        io.to(socket.id).emit("ROOM_ID_GENERATED", {
            roomID: randomRoomID
        });

        //we again emit the (updated live rooms available list) to all the clients as new room is added to the list.
        // console.log(roomSockets,socketRoom,socketNames,socketTickets);
    })

    //Join room request is handled here when a player clicks join button in Join Room Page
    //adding the newly joined players to a room & emitting (updated no. of players in room List) to newly joined client & already 
    //joined client if the room exists else JOIN_ACK 
    socket.on("JOIN_ROOM_REQ", (data) => {
        let roomAvailStatusCheck = getRoomAvailableStatus(data.roomID);
        if (!data.roomID || data.playerName.trim() === "" || !roomAvailStatusCheck) {

            //emitting failed room doesn't exist or not found status only to socket/ client that tried to join.
            io.to(socket.id).emit("JOIN_ROOM_FAILED");
        }
        else {
            if (roomSockets[data.roomID]) {
                roomSockets[data.roomID].push(socket.id);
            }
            socketNames[socket.id] = data.playerName;
            socketRoom[socket.id] = data.roomID;
            socketTickets[socket.id] = genTickets(data.noTickets);

            //initializing the default points for the player / socket.
            socketPoints[socket.id] = 5;

            //initializing room winConditions State.
            roomWinConditionsAvailableStatus[randomRoomID] = {
                earlyFive: true,
                topRow: true,
                middleRow: true,
                lastRow: true,
                fullHousie: true
            };


            //initializing limitChecker for checking winCondition by player / socket / client.    
            socketWinConditionsCheckLimitCount[socket.id] = {
                earlyFive: 0,
                topRow: 0,
                middleRow: 0,
                lastRow: 0,
                fullHousie: 0
            };
            console.log(roomSockets);
            socket.join(data.roomID)

            io.to(socket.id).emit("JOIN_ROOM_ACK");
            console.log(getRoomPlayers(data.roomID));
            //emitting success of socket/client to join the room to all the players in the room by sending updated playernames in room list.
            io.to(data.roomID).emit("ROOM_PLAYER_NAMES", {
                roomPlayerNames: getRoomPlayers(data.roomID)
            });
        }

    })


    //We use this to check if client is host(0) / joined the room(1) / didn't yet join the room(2).
    socket.on("PLAYER_CHECK_REQ", () => {
        try {
            if (!socketRoom[socket.id]) {
                io.to(socket.id).emit("PLAYER_CHECK_ACK", {
                    status: 2
                })
            } else {
                io.to(socket.id).emit("PLAYER_CHECK_ACK", {
                    status: roomSockets[socketRoom[socket.id]][0] === socket.id ? 0 : 1
                })
            }
        } catch (err) {
            console.log("Socket Didn't Join Any room or room don't exist");
        }
    })
    //Game Start Is Handled here
    socket.on("GAME_START_REQ", () => {
        genSequenceBoard(socket);
        if (roomSockets[socketRoom[socket.id]][0] === socket.id) {
            io.to(socketRoom[socket.id]).emit("GAME_START_ACK");
        }
    })

    socket.on("LIVE_NUM_GEN_REQ", (data) => {
        // try {

            //recoding the last sequnece number requested by client in a purticular room.
            roomLastSequenceNumberReq[socketRoom[socket.id]] = data.sequenceNumber;
            //making curNumGen on board as 1 from 0 for a purticular room. (so that ticket Checking will become easy in time complexity)
            roomBoard[socketRoom[socket.id]][roomSequence[socketRoom[socket.id]][data.sequenceNumber]] = 1;
            io.to(socketRoom[socket.id]).emit("LIVE_NUM_GEN_ACK", {
                curNumGen: roomSequence[socketRoom[socket.id]][data.sequenceNumber],
                prevNumGen: roomSequence[socketRoom[socket.id]][data.sequenceNumber - 1]
            })
            io.to(socketRoom[socket.id]).emit("BOARD_DATA_ACK", {
                liveBoardData: roomBoard[socketRoom[socket.id]]
            })

        // } catch (err) {
        //     console.log("Room Sequnece/Board Not yet generated!");
        // }
    })

    socket.on("GET_TICKETS_REQ", () => {
        io.to(socket.id).emit("GET_TICKETS_ACK", {
            tickets: socketTickets[socket.id]
        })
    })

    socket.on("BOARD_DATA_REQ", () => {
        socketPoints[socket.id] -= 5;
        io.to(socket.id).emit("BOARD_DATA_ACK", {
            liveBoardData: roomBoard[socketRoom[socket.id]]
        })
        io.to(socket.id).emit("PLAYER_POINTS_ACK", {
            points: socketPoints[socket.id]
        })
    })

    //[***NOT YET USED AS MID CLIENT JOIN FEATURE IS NOT IMPLEMENTED YET] 
    //this feature is for letting the client who joined in the middle of game to let know about the current winConditionsAvailable 
    // socket.on("WIN_CONDITIONS_AVAILABLE_STATUS_REQ", () => {
    //     console.log("01");
    //     io.to(socket.id).emit("WIN_CONDITIONS_AVAILABLE_STATUS", {
    //         curWinConditionsAvailable : roomWinConditionsAvailableStatus[socketRoom[socket.id]]
    //     })
    // })

    socket.on("WIN_CONDITIONS_CHECK_REQ", (data) => {
        // try {
            io.to(socket.id).emit("WIN_CONDITIONS_CHECK_ACK", {
                winConditionsAck: checkWinConditions(data.winConditionsCheckReq, data.ticketData, socket),
                winConditionsCheckLimitCount: socketWinConditionsCheckLimitCount[socket.id]
            });

            console.log(socketPoints[socket.id]);
            // emitting the no. of points the player currently has with him.
            io.to(socket.id).emit("PLAYER_POINTS_ACK", {
                points: socketPoints[socket.id]
            })

            //calculating & sending the win available status, with names of players who won the condition if anyone won.
            io.to(socketRoom[socket.id]).emit("WIN_CONDITIONS_AVAILABLE_STATUS", {
                curWinConditionsAvailable: getWinConditionsAvailableStatusNames(socketRoom[socket.id]),
                lastWinConditionUpdated: roomLastWinConditionUpdated[socketRoom[socket.id]]
            })
        // } catch (err) {
        //     console.log("Socket/ client didn't join any room yet");
        // }
    });

    socket.on("GET_FINAL_PLAYERS_POINTS_REQ", () => {
        io.to(socketRoom[socket.id]).emit("GET_FINAL_PLAYERS_POINTS_ACK", {
            finalPlayersPoints : getFinalPodiumPlayersPoints()
        })
    })

    socket.on("disconnect", () => {

        try {
            console.log(socket.id);
            delete socketNames[socket.id];
            delete socketTickets[socket.id];
            delete socketWinConditionsCheckLimitCount[socket.id];
            delete socketPoints[socket.id];

            //removing socket from roomSockets list.
            console.log(roomSockets);
            for (let i = 0; i < roomSockets[socketRoom[socket.id]].length; i++) {
                if (roomSockets[socketRoom[socket.id]][i] === socket.id) {
                    //The left socket is a host, hence auto timer button should be switched on if anyone is available in that room.
                    if (i === 0) {
                        console.log("host-left");
                        io.to(socketRoom[socket.id]).emit("HOST_LEFT");
                    }
                    roomSockets[socketRoom[socket.id]].splice(i, 1);
                }
            }

            //If no player is present in the room
            if (roomSockets[socketRoom[socket.id]].length === 0) {
                delete roomBoard[socketRoom[socket.id]];
                delete roomSequence[socketRoom[socket.id]];
                delete roomLastSequenceNumberReq[socketRoom[socket.id]];
                delete roomSockets[socketRoom[socket.id]];
                // not deleting roomWinConditionsAvailableStatus for a room just to preserve the gameState of room for future use
                // delete roomWinConditionsAvailableStatus[socketRoom[socket.id]];
                roomsAvailable.filter((roomID) => roomID !== socketRoom[socket.id]);
            }

            //deleting socketRoom at last as it's used very frequently to delete all the remaining things.
            delete socketRoom[socket.id]

            console.log(`socket with ID : ${socket.id} disconnected..`);
        } catch (err) {
            console.log(err);
        }
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
//need to also further improve the design of logic implemented in createNewRoom & JoinRoom componets by creating context for 
//roomPlayerNames, LiveRoomCount. [✔]
//need to write logic for handleGameStartButton in CreateNewRoom.js[✔]
//need to check for some state problem in ticket counts receiving in Ticket.js File [✔]
//need to write logic for ticketGen[✔]
//need to change the design for Tickets.js & Ticket.js[✔]
//Header needs to be written using material-ui or react-bootstrap.[✔]
//Decided for writing entire front-end with Material-UI.
//written logic for ticket validation and checking of availablity of winConditions.[✔]
//need to write Color Changing Logic for cells in tambola tickets.[✔]
//win conditions check -> limit no. of times.[✔]
//win conditions player name display next to condition.[✔]
//after winner declared -> redirect to another page and show podium. [✔] 
//need to do some front end work for game room and podium page.[✔]
//client leave remove all data belonging to him.[✔]
//host leave -> auto number gen.[✔]
//need to implement point system.[✔]
//need to implement show board modal with point deduction.[✔]
//need to make players aware if someone won a winCondition by sound or something with bang.[✔]
//fixed bang update popup which contains info about all winConditions. [✔]
//fixed icon money amount next to show board icon.[✔]
//Improved UI of podium room.[✔]
// resolve big about the last number in board.
//need to fix footer issue in mobile (sometimes also pc) (todo later)
//player / host leave -> game restore (todo later)


//** Problems & Temp Sol'n: */


//Socket.IO Transports problem (took so much time)

//UseEffect for socket and umount return learning & using

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

// Silly Mistake:

// UseEffect Render Problems based on changed dependency variables
// EVENT NAME mismatch problems.