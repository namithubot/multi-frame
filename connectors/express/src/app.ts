import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  // ...
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"]
  }
  
});

io.of('multi-frame').on("connection", (socket: Socket) => {
  socket.on('update-entity', (args) => {
    console.log('Update received');
    console.log(args);
	  socket.broadcast.emit('entity-updated', args);
  });
});

httpServer.listen(3000, '0.0.0.0');