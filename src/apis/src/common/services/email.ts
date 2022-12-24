import { config } from "../config/config";

const axios = require("axios");
const emailUrl = config.communication_url + "/communication/outbound_email";

export interface IEmail {
  customers: Array<object>;
  emailSubject: string;
  emailBody: string;
  clientUserId?: string;
  tenantId: string;
}

export interface IEmailResponse {
  status: number;
  data: object;
 
}

const sendEmail = async (body: IEmail) => {
  var axiosConfig = {
    method: "post",
    url: emailUrl,
    headers: {
      Authorization: `Bearer ${config.communication_token}`,
      "Content-Type": "application/json",
    },
    data: body,
  };

  try {
    let EmailResponse : IEmailResponse = await axios(axiosConfig);

    return EmailResponse.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default sendEmail;
