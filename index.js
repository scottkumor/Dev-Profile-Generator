const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const HTML5ToPDF = require("html5-to-pdf");
const path = require("path");
let htmlGen = ``;
let starCount = 0;

inquirer
    .prompt([
        {
            type: 'input',
            message: 'Enter a Github username:',
            name: 'username',
        },
        {
            type: 'list',
            name: 'color',
            message: 'Choose a Theme:',
            choices: [
                { value: 'red' },
                { value: 'green' },
                { value: 'blue' },
                { value: 'yellow' },
            ],
        }
    ])
    .then(function ({ username, color }) {
        const queryUrl = `https://api.github.com/users/${username}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;
        starCount = 0;
        axios.get(queryUrl).then(res => {
            const name = res.data.name;
            const avatar = res.data.avatar_url;
            const bio = res.data.bio;
            const location = res.data.location;
            const repos = res.data.public_repos;
            const blog = res.data.blog;
            const locStr = location.split(' ').join('');
            const qStarredURL = `https://api.github.com/users/${username}/repos`;


            axios.get(qStarredURL).then(res => {

                res.data.forEach(element => {
                    starCount += element.stargazers_count;
                })

                htmlGen = `
                <!DOCTYPE html>
                    <html lang="en">
                     <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <link href="https://fonts.googleapis.com/css?family=DM+Sans|Darker+Grotesque|Oswald|Sarabun&display=swap" rel="stylesheet">
                        <link rel="stylesheet" type="text/css" href="template.css">
                        <link rel="stylesheet" type="text/css" href="${color}.css">
                        <title>${name}: Developer Profile</title>
                    </head>
                    <body class="bgc-1 mxw-fv">
                    <div class="d-f df-fdc jc-c ai-c">
                        <div class="d-f df-fdc jc-c ai-c bgc-2 p-l s">
                            <img class="p-l" src="${avatar}"/>
                            <div class="fz-jjj c-4">${name}</div>
                        </div>
                        <div class="d-f df-fdc jc-c ai-c">
                            <div class="fz-jj c-4"> Developer Github Username: ${username}</div>
                            <div class="fz-jj c-4"> This developer currently has ${repos} public Github repositories.</div>
                            <div class="fz-j c-4"> This developer currently has ${starCount} total StarGazers across all Repos.</div>
                            <div class="fz-j c-4 d-f df-fdc jc-c ai-c"> Developer Bio and Blog
                                <div class="c-4">Bio: ${bio}</div>
                                <div class="c-4">Blog(s): ${blog}</div>
                            </div>
                        </div>
                        <div class="fz-j c-4">Link to Google Maps<sup>&#174;</sup> Location: <a class="fz-l td-n c-3" href="https://www.google.com/maps/place/${locStr}">Chicago,IL</a></div>
                    </div>
                    </body>
                    </html>`;


                fs.writeFile(`${username}.html`, htmlGen, () => {
               
                    const createPDF = async () => {
                    const html5ToPDF = new HTML5ToPDF({
                      inputPath: path.join(__dirname, `./${username}.html`),
                      outputPath: path.join(__dirname, `./${username}.pdf`),
                      include: [
                        path.join(__dirname, "./template.css"),
                        path.join(__dirname, `./${color}.css`)
                      ],
                      options: { printBackground: true }
                    });
                    await html5ToPDF.start();
                    await html5ToPDF.build();
                    await html5ToPDF.close();
                    console.log(`${username}.pdf written`);
                    process.exit(0);
                  };
                return { html: htmlGen, pdf: createPDF() }
                })
            });
        });
    });  