/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var Promise = require('bluebird');
var request = require('request');



var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  var readFileAsync = Promise.promisify(fs.readFile);
  var writeFileAsync = Promise.promisify(fs.writeFile);
  var getRequestAsync = Promise.promisify(request.get);
  return readFileAsync(readFilePath, 'utf8')
    .then(
      (filedata) => { 
        var fileDataArr = filedata.split('\n');
        return fileDataArr[0];
      }
    )
    .then(
      (user) => {
        var options = {
          url: 'https://api.github.com/users/' + user,
          headers: { 'User-Agent': 'request' },
          json: true // will JSON.parse(body) for us
        };
        return getRequestAsync(options);
      }
    )
    .then(
      (msg) => {
        return writeFileAsync(writeFilePath, JSON.stringify(msg.body));
      }
    )
    .catch(console.log('has err'));

};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
