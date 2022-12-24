import express from "express";
import UserConnectionDao from "../daos/websocket.doa";

class WebSocketController {
  
  async createUserConnection(id:string,auth:{}) {
    const result = await UserConnectionDao.createUserConnectionInDb({
      id,
      auth,
    });
    return result;
  }

  async deleteUserConnection(id:string) {
    const result = await UserConnectionDao.deleteUserConnectionInDb({
      id
    });
    return result;
  }
}

export default new WebSocketController();
