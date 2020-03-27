const request = require('request');
const axios = require('axios');
const fs = require('fs');
const sha1 = require('sha1');
var FormData = require('form-data');

var caesarShift = function(str, amount) {

	// Wrap the amount
	if (amount < 0)
		return caesarShift(str, amount + 26);

	// Make an output variable
	var output = '';

	// Go through each character
	for (var i = 0; i < str.length; i ++) {

		// Get the character we'll be appending
		var c = str[i];

		// If it's a letter...
		if (c.match(/[a-z]/i)) {

			// Get its code
			var code = str.charCodeAt(i);

			// Uppercase letters
			if ((code >= 65) && (code <= 90))
				c = String.fromCharCode(((code - 65 + amount) % 26) + 65);

			// Lowercase letters
			else if ((code >= 97) && (code <= 122))
				c = String.fromCharCode(((code - 97 + amount) % 26) + 97);

		}

		// Append
		output += c;

	}

	// All done!
	return output;

};

var token = '961021420398e6e98f46dcc0928592b4318faca0'
var url = 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=' + token
var url2= 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=' + token

console.log(url)
axios.get(url)
  .then(response => {
    let answer = response.data;
    let decifrado = caesarShift(answer.cifrado, answer.numero_casas*-1);
    answer.decifrado = decifrado
    answer.resumo_criptografico = sha1(decifrado);
   console.log(answer);
   let data = JSON.stringify(answer, null, 2);
fs.writeFile('answer.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
});

console.log('This is after the write call');
    console.log(response.data);
   
  })
  .catch(error => {
    console.log(error);
  });

  const stream = fs.createReadStream('./answer.json');

  const response = new FormData();

response.append('answer', stream);
const formHeaders = response.getHeaders();

axios.post(url2, response, {
  headers: {
    ...formHeaders,
  },
})
.then(response => {
  console.log(response.data.score);
  let answer = response.data;
 let data = JSON.stringify(answer, null, 2);
fs.writeFile('result.json', data, (err) => {
  if (err) throw err;
  console.log('Data written to file');
});

})
.catch(error => {console.log(error)});