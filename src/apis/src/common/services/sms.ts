const axios = require('axios');
const messageUrl = process.env.COMMUNICATION_URL+'/communication/message'


const sendMessage = async(body:any)=>{
  let messageResponse:any;
  await axios.post(messageUrl, body)
  .then(function (response:any) {
    messageResponse = response.data
  })
  .catch(function (error:any) {
    messageResponse = error
  });
  return messageResponse
}

export default sendMessage