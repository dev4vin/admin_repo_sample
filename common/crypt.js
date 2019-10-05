
let cipher = salt => {
  let textToChars = text => text.split('').map(c => c.charCodeAt(0))
  let byteHex = n => ("0" + Number(n).toString(16)).substr(-2)
  let applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)

  return text => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('')
}

let decipher = salt => {
  let textToChars = text => text.split('').map(c => c.charCodeAt(0))
  // let saltChars = textToChars(salt)
  let applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)
  return encoded => encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('')
}
module.exports.EncryptDecrypt = {
  encrypt: (key, data) => {
    let cip = cipher(key);
    return cip(data);
    //return key + data
  },
  decrypt: (key, encrypted_data) => {
    let deci = decipher(key);
    return deci(encrypted_data);
    //return key + encrypted_data
  }
}
