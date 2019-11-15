const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const HTML5ToPDF = require("html5-to-pdf");
const path = require("path");

inquirer
.prompt([
    {
    type: 'input',
    message: 'What is your GitHub name?',
    name: 'username',
    },
    {
    type: 'list',
    name: 'color',
    message: 'Pick your favorite color', 
    choices: [
        { value: 'red' },
        { value: 'green' },
        { value: 'blue' },
        { value: 'yellow' },
      ],
    }
])
  .then(function({ username, color }) {
    const queryUrl = `https://api.github.com/users/${username}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;
    
    axios.get(queryUrl).then(res => {
        const name = res.data.name;
        const avatar = res.data.avatar_url;
        const bio = res.data.bio;
        const location = res.data.location;
        const repos = res.data.public_repos;
        const blog = res.data.blog;
        const locStr = location.split(' ').join('');
        const qStarredURL = `https://api.github.com/users/${username}/starred{/owner}{/repo}`;
        
        // axios.get(qStarredURL).then(res => {
        //     //parse res to get stars
        //     console.log(res)
        // })

        return htmlGen = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" type="text/css" href="style.css">
            <title>${name}: Developer Profile</title>
        </head>
        <body class="bgc-${color}">
            <img src="${avatar}"/>
            <div> Developer Name: ${name}</div>
            <div> Developer Github Username: ${username}</div>
            <div>This developer currently has ${repos} public Github repositories.</div>
            <div> Developer Bio and Blog
                <div>${bio}</div>
                <div>${blog}</div>
            </div>
            <img src="https://maps.googleapis.com/maps/api/staticmap?center=${locStr}&zoom=13&size=600x300&key=AIzaSyCXnECTQGbbU04vCC-mrir-rUNbg7GvgcQ"/>
        </body>
        </html>`;

    }).then(htmlGen => {
            fs.writeFile(`${username}.html`, htmlGen, () => {});
          }).then(() => {
        /* read the file from filesystem */
        /* convert to pdf */
        const run = async () => {
          const html5ToPDF = new HTML5ToPDF({
            inputPath: path.join(__dirname, `${username}.html`),
            outputPath: path.join(__dirname, `${username}.pdf`),
            options: { printBackground: true }
          });
          await html5ToPDF.start();
          await html5ToPDF.build();
          await html5ToPDF.close();
          console.log("pdf written");
          process.exit(0);
        };
        return run();
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


