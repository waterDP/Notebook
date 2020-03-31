let p = 3, q = 11
let N = p * q // 33
let fN = (p - 1) * (q - 1) // 欧拉函数
let e = 7  // 随意挑选一个指数e

// {e, N} 成为公钥 {7, 33}

// 我们可以从公钥去推算私钥，但是前提是你得知道fN
for (var d = 1; e * d % fN !== 1; d++) {

}
//d = 3 {3, 7} 私钥
console.log(d)
let data = 5;

let c = Math.pow(data, e) % N  // todo 加密

let k = Math.pow(c, d) % N // todo 解密

console.log(c, k)


const { generateKeyPair, privateEncrypt, publicDecrypt } = require('crypto')
let ras = generateKeyPair('rsa', {
  modulusLength: 1024,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'passphrase'
  }
});
let message = 'hello'

// todo 加密
let encryptMessage = privateEncrypt({
  key: ras.publicKey,
  passphrase: 'passphrase'
}, Buffer.from(message, 'uft8'))

// todo 解密
let decryptedMessage = publicDecrypt(rsa.publicKey, rsa.privateEncrypt)