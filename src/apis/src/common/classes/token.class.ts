import jwt from "jsonwebtoken";
import { config } from "../config/config";

class Token {
    constructor() {
        
    }

    public generateInviteJwtToken(userId:string, tenantId: string): string {
      const secret : string = config.jwtSecretKey!
    
      const token = jwt.sign({id:userId.toString() , tenantId: tenantId.toString() }, secret, {
        
      });
    
      return token;
    }


    public decodeToken(signedToken:string) {
      const secret : string = config.jwtSecretKey!
    
      const decoded = jwt.verify(signedToken , secret);
    
      return decoded;
    }


    
    // Generate an Access Token for the given User ID
    public generateJwtToken(id : string ): string {
      // How long will the token be valid for
      // const expiresIn = '30 day';
      // // Which service issued the token
      // const issuer = config.get('authentication.token.issuer');
      // // Which service is the token intended for
      // const audience = config.get('authentication.token.audience');
      // // The signing key for signing the token
      const secret : string = config.jwtSecretKey!
    
      const token = jwt.sign({id:id.toString() }, secret, {
        // expiresIn: expiresIn,
        // audience: audience,
        // issuer: issuer,
      });
    
      return token;
    }
}



export const token = new Token();
