const express = require('express');
const env = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandle } = require('./middlewares/errorMiddleWare');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');
env.config();
const app = express();
connectDB();


app.use(express.json());
app.use('/api/users', userRoutes());
app.use('/api/chat', chatRoutes());
app.use('/api/message', messageRoutes());


const __dirname1 = path.resolve();
// ------------------------- deployment
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

app.use(notFound);
app.use(errorHandle);


const port = process.env.PORT;

const server = app.listen(port, console.log(('App is running on port ' + port).yellow.bold));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connect', (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(room);
    })

    socket.on('new message', (newMessageRevieved) => {
        let chat = newMessageRevieved.chat;
        if (!chat) return console.log('chat is undefind');
        chat.users.forEach(user => {
            if (user._id === newMessageRevieved.sender._id) return;
            socket.to(user._id).emit('message received', newMessageRevieved);
        })
    })

    socket.on('typing', (room) => {
        socket.in(room).emit('typing')
    });
    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing')
    });

    socket.off('setup', () => {
        console.log('User disconnected');
        socket.leave(userData._id)
    })


    // join call
    socket.on('join-call', (room, id) => {
        socket.join(room);
        socket.in(room).emit('user-connected', id);
    })

    socket.on('sound-off', (room) => {
        socket.in(room).emit('sound-off');
    })

    socket.on('play-video', (room) => {
        io.to(room).emit('play-video');
    })

    socket.on('play-video-one', (room) => {
        socket.in(room).emit('play-video-one');
    })


})