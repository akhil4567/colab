import CryptoJS from "crypto-js";
import { config } from "../config/config";

class CryptoCypher {
  constructor() {}

  /**
   * Encrypt the the token.
   *
   * @param token A string to encrypt
   * @returns Encrypted value of the given string with token Secret.
   */

  public encryptRefreshToken(token: string): string {
    const cipherToken = CryptoJS.AES.encrypt(
      token,
      config.tokenSecretKey!
    ).toString();

    return cipherToken;
  }

  /**
   * Decrypt the token.
   * 
   * @param cipherToken encrypted token value
   * @returns  Decrypted token value using tokenSecret used for encryption.
   */

  public decryptRefreshToken(cipherToken: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherToken, config.tokenSecretKey!);
    const originalToken = bytes.toString(CryptoJS.enc.Utf8);

    return originalToken;
  }
}

export const cryptoCypher = new CryptoCypher();
