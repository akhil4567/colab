import { baseTemplateEmail } from "./base-template.email"
const temp = `
<!-- Content Start -->
<div>
<div style=" top: 416px;padding: 27px;text-align: center;font-family: 'Poppins',sans-serif !important;margin: auto;color: #354052;opacity: 100%;line-height: 52px;font-size: 36px;font-weight: 700;">
    Verify your e-mail to finish signing up
</div>
<div style="padding: 10px;top: 549px;text-align: center;font-family: 'Poppins',sans-serif !important;margin: auto;color: #354052;opacity: 100%;line-height: 26px;font-size: 18px;">
    Thank you for choosing to reframe engage <br/><br/> Please confirm that {{userEmail}} is your email address by clicking the button below

    <div style="font-weight:bold; line-height: 80px;  padding-bottom: 58px;">This Verification Link will expire within {{emailConfirmExpiry}} days</div>
</div>
<div><a href={{confirmMailLink}}>
    <button style="font-family: 'Poppins',sans-serif !important;width: 500px;height: 65px;top: 762px;cursor: pointer;background-color: #2A3278;color: #FFFFFF;line-height: 25px;font-size: 24px;text-align: center;border-radius: 4px; font-weight:600"> Verify </button>
    </a>
</div>
<div style=" top: 893px;padding-top: 58px;text-align: center;font-family: 'Source Sans Pro',sans-serif !important;margin: auto;color: #354052;opacity: 50%;line-height: 32px;font-size: 22px;">If the link above is not working, <a href="{{confirmMailLink}}" style="color:#2D91D1; text-decoration:underline ; cursor:pointer;">click here</a></div>
<div style=" top: 937px;text-align: center;font-family: 'Source Sans Pro',sans-serif !important;margin: auto;color: #354052;line-height: 35px;font-size: 24px;font-weight: bold;">Already activated? <a href="{{loginLink}}" style="color:#2D91D1; text-decoration: none; cursor:pointer;">Sign In</a></div>
</div>
<!-- Content End -->
`;
export const verifyEmail = baseTemplateEmail.replace('{{contentBody}}', temp);