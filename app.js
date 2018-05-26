//Require Denpedencies
const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const request = require('request');
const GoogleMapsAPI = require("googlemaps");
//const upload = require('express-fileupload');
//Global Variable
const port = 2000; //Server Port
const Cred = require('./config/cred'); //Import Credentials
const PDBPath = JSON.parse(JSON.stringify(Cred.Path)); //Get DB Path

//Initialize Mogoose
mongoose.connect(PDBPath);
mongoose.connection
    .once('open', () => console.log('Connection Established!'))
    .on('error', err => {
        console.warn('Error:', err);
    })
    .catch(err => {
        console.log('Error', err);
    });

//Initialize Express
const server = express();
server.use(express.static(path.join(__dirname, "public")));
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

//Initialize body-parser
server.use(
    bodyPaser.urlencoded({
        extended: true
    })
);

//Initialize Upload Func.
// server.use(upload()); // configure middleware

// server.post('/video', function (req, res) {
//     console.log(req.files);
//     if (req.files.upfile) {
//         var file = req.files.upfile,
//             name = file.name,
//             type = file.mimetype;
//         var uploadpath = __dirname + '/video/' + name;
//         file.mv(uploadpath, function (err) {
//             if (err) {
//                 console.log("File Upload Failed", name, err);
//                 res.send("Error Occured!")
//             } else {
//                 console.log("File Uploaded", name);
//                 res.send('Done! Uploading files')
//             }
//         });
//     } else {
//         res.send("No File selected !");
//         res.end();
//     };
// })
//Load Routes
const api = require('./route/api');

//Use Routes
server.use('/api', api);


//Root Route
server.get('/', (req, res) => {
    res.redirect('/api/user');
});

//GET Error Handling
server.get('*', (req, res) => {
    res.send('Page Not Found!');
});

//POST Error Handling
server.post('*', (req, res) => {
    res.send('Internal Error!');
});


//Start the Server
server.listen(port, () => {
    console.log(`Server is now listening on ${port}`);
});







// [ 'administrative_area_level_1', 'political' ]
// [ 'country', 'political' ]
//console.log(PDetailRaw.result.address_components);
// console.log(PDetail[0].types);
// console.log(PDetail[1].types);
// console.log(PDetail[2].types);
// if (PDetail[1].types[0] == adminlv1) {
//     //     console.log('yes');
//     // }
//let gurl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=xxxxxxxx';
//console.log(PDetail[i].long_name);
//console.log(PDetail[i].long_name);