import { config } from "../config/config";

const axios = require('axios');
const videoUrl = config.communication_url+'/communication/video'

export interface IVideo{

  customerId?: string,
  customerName?: string,
  organizerId: string,
  organizerName: string,
  status: string,
  type: string,
  meetingStartTime?: Date,
  meetingEndTime?: Date,
  scheduleStartTime?:Date,
  scheduleEndTime?:Date,
  tenantId: string
}

export interface IVideoResponse{
  statusCode: number,
  message: string,
  data: {
    id:string
  }
}


const createVideoLink = async(body:IVideo)=>{
let videoResponse:any;
await axios.post(videoUrl, body)
.then(function (response:any) {
   videoResponse = response.data
})
.catch(function (error:any) {
  videoResponse = error
});
  return videoResponse
}

export default createVideoLink