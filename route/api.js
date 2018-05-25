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

//Misc Get Route
router.get('/nogeo', (req, res) => {
    res.send('Sorry Mate!');
    console.log('NoGeo +1');
});

//User Get Route
router.get('/user', (req, res) => {
    res.render('fgeo1', {});
});

//Admin Get Route
router.get('/admin', (req, res) => {
    res.render('fgeo', {});
});

//Admin POST Route
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


//User POST Route
router.post('/user', (req, res) => {
    const lat = req.body.latitude;
    const long = req.body.longitude;
    const gmAPI = new GoogleMapsAPI(googleconfig);
    const reverseGeoCodeParams = {
        latlng: `${lat},${long}`,
        result_type: 'postal_code',
        language: 'en',
        location_type: 'APPROXIMATE'
    };
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
                        DBSchema.find({
                            FirstLvAdmin: FirstLvAdmin[0]
                        }, {
                            Country: Country[0]
                        }).then((result) => {
                            //console.log(result);
                            DBSchema.findById({
                                _id: result[0]._id
                            }).then((goods) => {
                                let CompC = goods.Country;
                                let CompFirstLv = goods.FirstLvAdmin;
                                if (CompFirstLv == FirstLvAdmin[0]) {
                                    if (CompC == Country[0]) {


                                        //res.send('a');
                                        res.send(200, {
                                            "result": true
                                        })


                                    } else {
                                        console.log('Error');
                                        // 
                                        res.send(200, {
                                            "result": false
                                        })
                                    }
                                } else {
                                    console.log('Error');
                                    // res.send(null);
                                    res.send(200, {
                                        "result": false
                                    })
                                }
                            });
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
// let today = new Date(Date.now());
// console.log(today.toISOString());
// console.log(goods.Country); //Frontend Output /Compare
// console.log(goods.FirstLvAdmin);