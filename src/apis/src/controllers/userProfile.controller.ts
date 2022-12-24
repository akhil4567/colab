import express from "express";
import userProfileDao from "../daos/userProfile.dao";

class UserProfileController {
  
  async createUserProfile(req: express.Request, res: express.Response) {
    const result = await userProfileDao.createUserProfile({
      ...req.body,
      user: req.user,
    });
    return result;
  }

  async updateUserProfile(req: express.Request, res: express.Response) {
    const result = await userProfileDao.updateUserProfile({
      ...req.body,
      id:req.params.id,
      user: req.user,
    });
    return result;
  }
}

export default new UserProfileController();
