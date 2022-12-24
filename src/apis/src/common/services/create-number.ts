const axios = require('axios');
const messageUrl = process.env.COMMUNICATION_URL+'/number'

// This function is used to create entries in Number table of Communication DB
// params : body : Payload of Create Number API

const createNumber = async(body:any)=>{
  let numberAPIResponse:any;
  let token = process.env.COMMUNICATION_UNLEASHED_ACCOUNT_TOKEN
  let axiosConfig = {
    headers: {
        'Authorization': `Bearer ${token}` 
    }
  };
  await axios.post(messageUrl, body, axiosConfig)
  .then(function (response:any) {
    numberAPIResponse = response.data
  })
  .catch(function (error:any) {
    numberAPIResponse = error
  });
  return numberAPIResponse
}

export default createNumber