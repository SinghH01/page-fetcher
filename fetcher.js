// Import request, fs and readline
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const { exit } = require('process');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Take input from terminal and assin them values
let array = process.argv.slice(2);
const url = array[0];
const path = array[1];

// Request data from the server
request(`${url}`, (error, response, body) => {

  if (response.statusCode !== 200) {
    console.log(` Error Code : ${response.statusCode} (${response.statusMessage}) `);
    exit();
  } else {
    fs.exists(path, function(isExist) {
      if (isExist) {
      //
        rl.question("File already exist's. Would you like to overwrite it? Please type y/n: ", function(answer) {

          if (answer === 'y') {
            console.log('Overiting file ...');
            writeFile(body);
          } else if (answer === 'n') {
            console.log("File not overwirtten");
          } else {
            console.log('Invalid input');
          }
          rl.close();
        });
      } else {
        writeFile(body);
      }
    });
  }

});

// Write data into file
function writeFile(body) {
  fs.writeFile(`${path}`, `${body}`, function(err) {
    if (err) {
      return console.log("File Path doesn't exist");
    } else {
      getFilesizeInBytes(path);
    }
  });  
}

// Print file size
function getFilesizeInBytes(path) {
  let stats = fs.statSync(path);
  let fileSizeInBytes = stats.size;

  console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${path}`);
  exit();
}
