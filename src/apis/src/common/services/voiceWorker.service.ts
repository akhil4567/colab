import { config } from "../config/config";

const axios = require("axios");

const getWorkerToken = async (body: any) => {
  const workerTokenUrl = config.communication_url + "/communication/voice/worker/token";

  var axiosConfig = {
    method: "post",
    url: workerTokenUrl,
    headers: {
      Authorization: `Bearer ${config.communication_token}`,
      "Content-Type": "application/json",
    },
    data: body,
  };

  try {
    let workerTokenResponse: any = await axios(axiosConfig);
    return workerTokenResponse.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const createNewWorker = async (body: any) => {
  const newWorkerUrl = config.communication_url + "/communication/voice/create/worker";

  var axiosConfig = {
    method: "post",
    url: newWorkerUrl,
    headers: {
      Authorization: `Bearer ${config.communication_token}`,
      "Content-Type": "application/json",
    },
    data: body,
  };

  try {
    let workerTokenResponse: any = await axios(axiosConfig);
    return workerTokenResponse.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { getWorkerToken, createNewWorker };
