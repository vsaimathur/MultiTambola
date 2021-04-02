const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;




app.use(cors());
const server = require("http").createServer(app);
const socket_io = require("socket.io");
const io = socket_io(server, {
    cors: {
        origin: "http://127.0.0.1:5000",
        methods: ["GET", "POST"],
        credentials: true
    }
});



io.on("connection", (socket) => {
    console.log("new socket id ", socket.id);
    socket.on("disconnect", () => {
        console.log("socket disconnected..")
    })
});

app.get("/", (req, res) => {
    res.send("This is start of Tambola Application!");
});

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});



// if(process.env.NODE_ENV = "Production") {
//     app.use(express.static("client/build"));
// }

