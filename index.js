function init() {

    
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
//generate static html


//convert that thml to a pdf

//save pdf to the folder (use fs)





inquirer
  .prompt({
    message: "Enter your GitHub username",
    name: "username"
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

    axios.get(queryUrl).then(res => {

      const repoNames = res.data.map(repo => {
        return repo.name;
      })
    repoNamesStr = repoNames.join('\n');

    fs.writeFile('repos.txt', repoNamesStr, err => {
      console.log('file written')
  }

    )});
  });


  const htmlGen = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
  </head>
  <body>
      <div>${repoNamesStr}</div>
  </body>
  </html>`;
};


init();


// The PDF will be populated with the following:

// * Profile image
// * User name
// * Links to the following:
//   * User location via Google Maps
//   * User GitHub profile
//   * User blog
// * User bio
// * Number of public repositories
// * Number of followers
// * Number of GitHub stars