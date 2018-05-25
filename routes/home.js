//Require Denpedencies
const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const request = require('request');
const GoogleMapsAPI = require('googlemaps');
//Global Variables
const Cred = require('../config/cred'); //Import Credentials
const PDBPath = JSON.parse(JSON.stringify(Cred.Path)); //Get DB Path
const GAPI = JSON.parse(JSON.stringify(Cred.GAPI)); //Get Google Map API
const googleconfig = {
    //GoogleAPI Config
    key: Cred.GAPI,
    stagger_time: 1000,
    encode_polylines: true,
    secure: true
};

//DBSchema
const DBSchema = require('../config/Schema');

//Initiate Router
const router = express.Router();

//Get Routes
router.get('/nogeo', (req, res) => {
    res.send('Sorry Mate!');
    console.log('NoGeo +1');
});

router.get('/home', (req, res) => {
    console.log('Landing Page');
    res.render('fgeo', {});
});

router.get('/result', (req, res) => {


});

//Post Routes

router.post('/admin', (req, res) => {
    //Def. the Var for the Coordinate
    const lat = req.body.latitude;
    const long = req.body.longitude;
    //Log the Coordinate
    console.log('Latitude:' + lat);
    console.log('Longitude:' + long);
    res.send('Good');
    //Initiate Google ReverseGeoCode Lib
    const gmAPI = new GoogleMapsAPI(googleconfig);
    //Set Params
    const reverseGeoCodeParams = {
        latlng: `${lat},${long}`,
        result_type: 'postal_code',
        language: 'en',
        location_type: 'APPROXIMATE'
    };
    //Perform ReverseGeocoding
    gmAPI.reverseGeocode(reverseGeoCodeParams, (err, result) => {
        if (err) {
            console.log('Error!');
        } else {
            if (result.status !== 'OK') {
                console.log('Map Failed to Load');
            } else {
                let place_id = result.results[0].place_id; //Get the Place ID
                console.log('ID:' + place_id);
                ///Getting Street Detail
                //Google URL
                let gurl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${
          Cred.GAPI
        }`;
                //Making Request
                request(encodeURI(gurl), (err, response, body) => {
                    if (err) {
                        console.log('Error!');
                    } else {
                        let PDetailRaw = JSON.parse(body); //Parse the body
                        let PDetail = PDetailRaw.result.address_components; //Get the Addr. Component
                        let Objlength = Object.keys(PDetail).length; //Get the Object Length
                        let adminlv1 = 'administrative_area_level_1'; //Def. the String for Comparison
                        let country = 'country'; //Def. the String for Comparison
                        let FirstLvAdmin = [];
                        let Country = [];

                        //Get the Name of First Lv. Admin
                        for (let i = 0; i < Objlength; ++i) {
                            if (PDetail[i].types[0] == adminlv1) {
                                FirstLvAdmin.push(PDetail[i].long_name);
                                break;
                            }
                        }

                        //Get the Name of the Country
                        for (let i = 0; i < Objlength; ++i) {
                            if (PDetail[i].types[0] == country) {
                                Country.push(PDetail[i].long_name);
                                break;
                            }
                        }
                        console.log(lat);
                        console.log(long);
                        console.log(FirstLvAdmin[0]);
                        console.log(Country[0]);
                        let today = new Date(Date.now());
                        console.log(today.toISOString());

                        const DBIsntance = new DBSchema({
                            Latitude: lat,
                            Longitude: long,
                            FirstLvAdmin: FirstLvAdmin[0],
                            Country: Country[0],
                            Time: Date.now()
                        });
                        DBIsntance.save().then(() => {
                            console.log('Data Saved!');
                        });
                    }
                });
            }
        }
    });
});

//Export
module.exports = router;




// // let id = [];
// DBSchema.find({
//     Latitude: 25.044419130841693
// }, {
//     Longtitude: 121.53058052648127
// }).then((result) => {
//     // console.log(result[0]._id);
//     // id.push(result[0]._id);
//     DBSchema.findById({
//         _id: result[0]._id
//     }).then((goods) => {
//         console.log(goods);
//     });
// });