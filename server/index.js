const express =  require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);

// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true,
}));
const io = new Server(server,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("A user connected with ID:", socket.id);

    socket.on("player1", (player1_data) => {
         io.emit("player1_data",player1_data);
    });
    socket.on("player2", (player2_data) => {
        io.emit("player2_data",player2_data);
   });

    socket.on("disconnect", () => {
        console.log("User disconnected with ID:", socket.id);
    });
});

const PORT = 4000;
app.use(express.json());

app.get("/", (req, res) => {
    res.send('hi');
});

server.listen( PORT ,() =>{
    console.log(`server is start on post ${PORT}`);
})