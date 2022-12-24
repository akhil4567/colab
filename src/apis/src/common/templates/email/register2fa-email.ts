import { baseTemplateEmail } from "./base-template.email"
const temp = `
<!-- Content Start -->
<div>
    <div style=" text-align: center;top: 416px;padding: 27px;text-align: center;font-family: 'Poppins',sans-serif !important;margin: auto;color: #354052;opacity: 100%;line-height: 52px;font-size: 36px;font-weight: 700;">
        Complete registration Two factor authentication
    </div>
    <div style=" text-align: center;padding: 10px;top: 549px;text-align: center;font-family: 'Poppins',sans-serif !important;margin: auto;color: #354052;opacity: 100%;line-height: 26px;font-size: 18px;font-weight: 500;">
        Please enter below confirmation code in the window where you started creating your account with Reframe Engage
        <div style="text-align: center;font-weight:bold; line-height: 80px; ">
            This code will expire within {{otpValidity}} min
        </div>
    </div>
    <div style="text-align: center;font-size: 72px;line-height: 52px;  font-family: 'Poppins',sans-serif !important;  font-weight: 700;color:#354052; padding-bottom:37px">
        {{otp}}
    </div>
    <div>
        <button style="text-align: center;font-family: 'Poppins',sans-serif !important;width: 500px;height: 65px;top: 762px;cursor: pointer;background-color: #2A3278;color: #FFFFFF;line-height: 25px;font-size: 24px;text-align: center;border-radius: 4px; font-weight:600"> Continue</button>
    </div>
    <div style="text-align: center; top: 893px;padding-top: 58px;text-align: center;font-family: 'Source Sans Pro',sans-serif !important;margin: auto;color: #354052;opacity: 50%;line-height: 32px;font-size: 22px;">If the link above is not working, <a href="{{surveyLink}}" style="color:#2D91D1; text-decoration:underline ; cursor:pointer;">click here</a></div>
    <div style=" text-align: center;top: 937px;text-align: center;font-family: 'Source Sans Pro',sans-serif !important;margin: auto;color: #354052;line-height: 35px;font-size: 24px;font-weight: bold;line-height: 32px;">Already activated? <a href="{{surveyLink}}" style="color:#2D91D1; text-decoration:underline ; cursor:pointer;text-decoration: none;">Sign In</a></div>
</div>
<!-- Content End -->
`;
export const register2faEmail = baseTemplateEmail.replace('{{contentBody}}', temp);