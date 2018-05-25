//Require Denpedencies
const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const request = require('request');
const GoogleMapsAPI = require("googlemaps");

//Global Variable
const port = 2000; //Server Port
const Cred = require('./config/cred'); //Import Credentials
const PDBPath = JSON.parse(JSON.stringify(Cred.Path)); //Get DB Path
const GAPI = JSON.parse(JSON.stringify(Cred.GAPI)); //Get Google Map API
const googleconfig = { //GoogleAPI Config
    key: Cred.GAPI,
    stagger_time: 1000,
    encode_polylines: true,
    secure: true
};

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
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

//Initialize body-parser
server.use(
    bodyPaser.urlencoded({
        extended: true
    })
);

//Get Routes
server.get('/', (req, res) => {
    console.log('Landing Page');
    res.render('fgeo', {});
});

server.get('/nogeo', (req, res) => {
    res.send('Sorry Mate');
});

//Post Routes
server.post('/', (req, res) => {
    //Def. the Var for the Coordinate
    let lat = req.body.latitude;
    let long = req.body.longitude;
    //Log the Coordinate
    console.log('Latitude:' + lat);
    console.log('Longitude:' + long);
    res.send('Good');
    //Initiate Google ReverseGeoCode Lib
    const gmAPI = new GoogleMapsAPI(googleconfig);
    //Set Params
    const reverseGeoCodeParams = {
        latlng: `${lat},${long}`,
        result_type: "postal_code",
        language: "en",
        location_type: "APPROXIMATE"
    };
    //Perform ReverseGeocoding
    gmAPI.reverseGeocode(reverseGeoCodeParams, (err, result) => {
        if (err) {
            console.log('Error!');
        } else {
            if (result.status !== "OK") {
                console.log('Map Failed to Load');
            } else {
                let place_id = result.results[0].place_id; //Get the Place ID
                console.log('ID:' + place_id);
                ///Getting Street Detail
                //Google URL
                let gurl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${Cred.GAPI}`
                //Making Request
                request(encodeURI(gurl), (err, response, body) => {
                    if (err) {
                        console.log('Error!');
                    } else {
                        let PDetailRaw = JSON.parse(body); //Parse the body
                        let PDetail = PDetailRaw.result.address_components; //Get the Addr. Component
                        let Objlength = Object.keys(PDetail).length //Get the Object Length
                        let adminlv1 = 'administrative_area_level_1'; //Def. the String for Comparison
                        let country = 'country'; //Def. the String for Comparison

                        //Get the Name of First Lv. Admin
                        for (let i = 0; i < Objlength; ++i) {
                            if (PDetail[i].types[0] == adminlv1) {
                                console.log(PDetail[i].long_name);
                                break;
                            }
                        };

                        //Get the Name of the Country
                        for (let i = 0; i < Objlength; ++i) {
                            if (PDetail[i].types[0] == country) {
                                console.log(PDetail[i].long_name);
                                break;
                            }
                        };
                    }
                });
            }
        }
    });
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