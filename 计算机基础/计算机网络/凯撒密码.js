let secret = 3

// todo content
function encrypt(message) {
  let buffer = Buffer.from(message)
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = buffer[i] + secret
  }
  return buffer.toString()  
}

function decrypt(message) {
  let buffer = Buffer.from(message)
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = buffer[i] - secret
  }
  return buffer.toString()  
}

// todo test
let message = 'abc'
let encryptMessage = encrypt(message)
let decryptMessage = decrypt(encryptMessage)

console.log(encryptMessage)
console.log(decryptMessage)