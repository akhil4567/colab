
import '../services/passport';
import passport from 'passport';
import websocketController from '../../controllers/websocket.controller';
import { log } from '../classes/log.class';
import InternalChatDao from "../../../src/daos/internalChat.dao";

// interface IMessageObj{
//       message:string,
//       roomId:string,
//       fileLink:string,

// }
export default class WebSocket {

    constructor(app:any,server:any,sessionMiddleware:any) {

      let io = require("socket.io")(server, {cors: {origin: "*"}});
      const wrapMiddlewareForSocketIo = (middleware:any) => (socket:any, next:any) => middleware(socket.request, {}, next);
      io.use(wrapMiddlewareForSocketIo(passport.initialize()));
      io.use(wrapMiddlewareForSocketIo(sessionMiddleware));
      io.use(wrapMiddlewareForSocketIo(passport.authenticate(["authJwt"])))
      .on("connection", async function(socket: any) {
        try {
          const result = await websocketController.createUserConnection(socket.id, socket.request.session.passport.user );
          socket.join(socket.request.session.passport.user.id);
          log.info(socket);
        } catch (error: any) {
            log.error(error)
            socket.disconnect(true)
        }
       
       /*
       join room method
       */
      socket.on("joinRoom",async function (roomId:any) {
        
        socket.join(roomId)
      })
      /*
       emit message to room room method
       */
       socket.on("emitMessage",async function (data:string) {
        
        // db call
        const req =JSON.parse(data)
        const result = await InternalChatDao.sendChatMessage({
          user: socket.request.session.passport.user,
          message: req.message,
          chatRoomId: req.roomId,
          documentLink: req?.documentLink || null,
        });
        io.to(req.roomId).emit("newMessage",data)
        //add notification
        
      })
      /*
       disconnection method
       */
      socket.on("disconnect",async function(){
          log.warn("data",socket)
          try {
            const result = await websocketController.deleteUserConnection(socket.id );
          } catch (error: any) {
              log.error(error)
          }
        })
        app.set("socketio", io);
      })
    }
}
