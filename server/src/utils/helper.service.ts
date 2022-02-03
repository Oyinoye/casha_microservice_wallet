import { OtpRepository } from "../repository/otp-repository";
const otpGenerator = require('otp-generator');
const crypto = require('crypto');


// get Initialization Vector
var iv = Buffer.from(process.env.IV);

// create string to be used as salt in encryption and decryption
var ivstring = iv.toString('hex').slice(0, 16);

// Function to find SHA1 Hash of password key
function sha1(input) {
    return crypto.createHash('sha1').update(input).digest();
}

//Function to get secret key for encryption and decryption using the password
function password_derive_bytes(password, salt, iterations, len) {
    var key = Buffer.from(password + salt);
    for (var i = 0; i < iterations; i++) {
        key = sha1(key);
    }
    if (key.length < len) {
        var hx = password_derive_bytes(password, salt, iterations - 1, 20);
        for (var counter = 1; key.length < len; ++counter) {
            key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
        }
    }
    return Buffer.alloc(len, key);
}

// Function to encode the object
export async function encode(string) {
    var key = password_derive_bytes(process.env.CRYPT_PASSWORD, '', 100, 32);
    // Initialize Cipher Object to encrypt using AES-256 Algorithm 
    var cipher = crypto.createCipheriv('aes-256-cbc', key, ivstring);
    var part1 = cipher.update(string, 'utf8');
    var part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
}

// Function to decode the object
export async function decode(string) {
    var key = password_derive_bytes(process.env.CRYPT_PASSWORD, '', 100, 32);
    // Initialize decipher Object to decrypt using AES-256 Algorithm
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, ivstring);
    var decrypted = decipher.update(string, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
}

export async function generateOtp(payload: any) {

    //Generate OTP 
    const otp = otpGenerator.generate(payload.size, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    // add 10 seconds to the to start the validity time count
    let timestamp = new Date();
    timestamp.setSeconds(timestamp.getSeconds() + 10);
    console.log(timestamp);
    // set OTP expiration to "validityDuration" set in the function param "payload"
    const expiration_time = timestamp.setSeconds(timestamp.getSeconds() + payload.validityDuration);

    return {otp, timestamp, expiration_time};
}