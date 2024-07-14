/* 
1. Use the inquirer npm package to get user input.
*/
import inquirer from "inquirer";
import qr from "qr-image";
import fs from 'fs';

inquirer
    .prompt([
        {
            message: "Enter a URL to turn into a QR code: ",
            name: "URL",
        },
    ])
    .then((answers) => {
        const url = answers.URL;
        var qr_png = qr.image(url);
        qr_png.pipe(fs.createWriteStream("qr.png"));
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });

/*
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
*/

/*
3. Create a txt file to save the user input using the native fs node module.
*/
