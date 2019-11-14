const fs = require("fs");
const util = require("util");
const axios = require("axios");
const inquirer = require("inquirer");

const writeFileAsync = util.promisify(fs.writeFile);

inquirer
  .prompt({
    message: "Enter your GitHub username:",
    name: "username"
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;

    axios.get(queryUrl).then(function(res) {
      const name = res.data.name
      const avatar = res.data.avatar_url


        const htmlGen = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${name}: Developer Profile</title>
        </head>
        <body>
            <img src="${avatar}"/>
            <div>${name}</div>
        </body>
        </html>`;
      
        fs.writeFile(`${username}.html`, htmlGen, function(err) {
            if (err) {
              throw err;
            }
    
        console.log(`Saved ${username}.html`);
      });
    });
  });
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


// function prompt() {

//     return inquirer.prompt({
//         message: "Enter your GitHub username:",
//         name: "username"
//     },
//         // {
//         //     message: 'Choose a color theme from the rainbow',
//         //     name: 'color'
//         // }
//     )
// };

// function getUser(username) {
//     return axios
//         .get(
//             `https://api.github.com/users/${username}?client_id=${
//             process.env.CLIENT_ID
//             }&client_secret=${process.env.CLIENT_SECRET}`
//         )
//         .catch(err => {
//             console.log(`User not found`);
//             process.exit(1);
//         });
// };

// function getTotalStars(username) {
//     return axios
//         .get(
//             `https://api.github.com/users/${username}/repos?client_id=${
//             process.env.CLIENT_ID
//             }&client_secret=${process.env.CLIENT_SECRET}&per_page=100`
//         )
//         .then(response => {
//             // After getting user, count all their repository stars
//             return response.data.reduce((acc, curr) => {
//                 acc += curr.stargazers_count;
//                 return acc;
//             }, 0);
//         });
// }

//             //  const {data} = await axios.get(`https://api.github.com/users/scottkumor`).then(res =>{
//             //     console.log(res);
//             //     //  login = res.data.login;
//             //     //  avatar = res.data.avatar_url;

//             //   })
