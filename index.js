//load express module
var express = require('express');
//load body parser module
var bodyParser = require('body-parser');
//load request module
var request = require('request');

//initilize express module
var app = express();


//set view engine
app.set('view engine','ejs');

//load body parser
app.use(bodyParser.urlencoded({extended:false}));

//add static route
// console.log(__dirname);
app.use(express.static(__dirname + '/public'));

//create routes
app.get('/',function(req,res){
    //res.send('IT WORKS!!')
    res.render('index');
});

app.post('/IsItCloudy',function(req,res){
    // res.send(req.body);
    var myPlace = req.body.place;
    // console.log(myPlace);

    request('http://api.openweathermap.org/data/2.5/weather?q='+myPlace,
        function(error,response,responseBody){

            if(error) throw error;

            if(response.statusCode === 200){
                // console.log(typeof responseBody);

                //fails because not an object
                // console.log(responseBody.weather);
                // console.log(responseBody);

                var weatherObject = JSON.parse(responseBody);

                if(weatherObject.weather){
                    var cloudyWeathers = weatherObject.weather.filter(function(item){
                        return item.main.match(/cloud|rain/i);
                    });

                    var isItCloudy = (cloudyWeathers.length > 0);

                    var isItCloudyText = isItCloudy ? 'Yes it is cloudy.' : 'No.';

                    var thingsThatCanBeUsedInTheView = {'areThereClouds':isItCloudyText,'isCloudyBoolean':isItCloudy};

                }else{
                    var thingsThatCanBeUsedInTheView = {'areThereClouds':weatherObject.message,'isCloudyBoolean':null}
                }
                res.render('result',thingsThatCanBeUsedInTheView);
            }else{
                res.send("couldn't get the weather... sorry.");
            }

            // console.log('error',error);
            // console.log('response',response);
            // console.log('body',body);

            
        })
    
    
});


//listen on port
app.listen(3000);