import express from 'express'
import InternalChatsController from '../controllers/internalChats.controller'
import authMiddleware from '../common/middlewares/authentication'
import { log } from '../common/classes/log.class'
const multer = require('multer')
const Handlebars = require('handlebars')

const router = express.Router()

/**
 *  All route start with '/internalChat' will have authMiddleware.
 */
router.use('/api/v1/account/internal-chat', authMiddleware)

const storage: any = multer.memoryStorage()
const imageFileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true)
  } else {
    cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false)
  }
}

const profileImageMulter = multer({
  storage: storage,
  fileFilter: imageFileFilter,
})

/**
 *  Get all Individual Chats of a User
 */
router.get(
  '/api/v1/account/internal-chat/individual-chat',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await InternalChatsController.getIndividualChats(req, res)
      return res.status(200).json({
        statusCode: 200,
        message: 'Get Individual chats',
        ...result,
      })
    } catch (error: any) {
      log.error(error)
      return res.status(500).json({ error: error.message })
    }
  },
)

/**
 *  Get all Group Chats of a User
 */
router.get(
  '/api/v1/account/internal-chat/group-chat',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await InternalChatsController.getGroupChats(req, res)
      return res.status(200).json({
        statusCode: 200,
        message: 'Get Individual chats',
        ...result,
      })
    } catch (error: any) {
      log.error(error)
      return res.status(500).json({ error: error.message })
    }
  },
)

/* create Individual Chat ---> */
router.post(
  '/api/v1/account/internal-chat/individual-chat/create/:chatUserId',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await InternalChatsController.createIndividualChat(
        req,
        res,
      )
      return res.status(200).json({
        statusCode: 200,
        message: 'Individual chat created!',
        data: result,
      })
    } catch (error: any) {
      log.error(error)
      return res
        .status(500)
        .json({ error: error.message, errorCode: 'UNL-CHAT-IC-POST1' })
    }
  },
)

/* get ChatMessages By ChatRoomId ---> */
router.get(
  '/api/v1/account/internal-chat/messages/:chatRoomId',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await InternalChatsController.getChatMessagesByRoomId(
        req,
        res,
      )
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Success!', data: result })
    } catch (error: any) {
      log.error(error)
      return res
        .status(500)
        .json({ error: error.message, errorCode: 'UNL-CHAT-MSG-GETbyID1' })
    }
  },
)

/* create group Chat ---> */
router.post(
  '/api/v1/account/internal-chat/group-chat/create',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await InternalChatsController.createGroupChat(req, res)
      return res.status(200).json({
        statusCode: 200,
        message: 'Group chat created!',
        data: result,
      })
    } catch (error: any) {
      log.error(error)
      return res
        .status(500)
        .json({ error: error.message, errorCode: 'UNL-CHAT-GC-POST1' })
    }
  },
)

/* Send Message ---> */
router.post(
  '/api/v1/account/internal-chat/send-message/:chatRoomId',
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await InternalChatsController.sendChatMessage(req, res)
      return res
        .status(200)
        .json({ statusCode: 200, message: 'Chat Message Sent!', data: result })
    } catch (error: any) {
      log.error(error)
      return res
        .status(500)
        .json({ error: error.message, errorCode: 'UNL-CHAT-SM-POST1' })
    }
  },
)

// router.put(
//   "/api/v1/account/internalChat/groupChat",
//   async (req: express.Request, res: express.Response) => {
//     try {
//       const result = await InternalChatsController.getGroupChats(req, res);
//       return res
//         .status(200)
//         .json({ statusCode: 200, message: "Get Individual chats", ...result });
//     } catch (error: any) {
//       log.error(error);
//       return res.status(500).json({ error: error.message });
//     }
//   }
// );

router.post(
  '/api/v1/account/internal-chat/group-chat-image',

  profileImageMulter.single('image'),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await InternalChatsController.uploadProfileImage(req, res)
      return res.status(200).json({
        statusCode: 200,
        message: 'Customer Profile Image uploaded successfully',
        data: result,
      })
    } catch (error: any) {
      log.error(error)
      return res.status(500).json({
        statusCode: 500,
        message: 'An error occurred',
        error: error.message,
      })
    }
  },
)

export { router as InternalChatRouter }
