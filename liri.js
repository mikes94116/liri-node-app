//using .env to hide keys
require("dotenv").config();

//project vars
var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require('node-spotify-api'); 
var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require('moment');
var findThis = process.argv[3];
var liriReturn = process.argv[2];


//switches for various commands
switch (liriReturn) {

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "concert-this":
        concertThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    // instructions for first-time user lurking around on the command line
    default: console.log("\n" + "type any command after 'node liri.js': " + "\n" +
        "spotify-this-song 'any song title' " + "\n" +
        "movie-this 'any movie title' " + "\n" +
        "concert-this 'any band to get concert info' " + "\n" +
        "do-what-it-says " + "\n" +
        "Use quotes for multiword titles!");
};

//command 2 spotify this song
// need artist, song name, preview, album
function spotifyThisSong(trackName) {

    var trackName = process.argv[3];

    if (!trackName) {
        trackName = "I Want it That Way";
    };

    songRequest = trackName;
    spotify.search({
        type: "track",
        query: songRequest

    },
        function (err, data) {
            if (!err) {
                var trackInfo = data.tracks.items;
                for (var i = 0; i < 5; i++) {
                    if (trackInfo[i] != undefined) {
                        var spotifyResults =
                            "Artist: " + trackInfo[i].artists[0].name + "\n" +
                            "Song: " + trackInfo[i].name + "\n" +
                            "Preview URL: " + trackInfo[i].preview_url + "\n" +
                            "Album: " + trackInfo[i].album.name + "\n"

                        console.log(spotifyResults);
                        console.log(' ');
                    };
                };
            } else {
                console.log("error: " + err);
                return;
            };
        });
};
//command 3 movie this
// run a request to the OMDB API with the movie specified
function movieThis() {

    //using movieName from var list at top
    var queryUrl = "http://www.omdbapi.com/?t=" + findThis + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            //pull requested data in readable format
            var myMovieData = JSON.parse(body);
            var queryUrlResults =
                "Title: " + myMovieData.Title + "\n" +
                "Year: " + myMovieData.Year + "\n" +
                "IMDB Rating: " + myMovieData.Ratings[0].Value + "\n" +
                "Rotten Tomatoes Rating: " + myMovieData.Ratings[1].Value + "\n" +
                "Origin Country: " + myMovieData.Country + "\n" +
                "Language: " + myMovieData.Language + "\n" +
                "Plot: " + myMovieData.Plot + "\n" +
                "Actors: " + myMovieData.Actors + "\n"

            console.log(queryUrlResults);
        } else {
            console.log("error: " + err);
            return;
        };
    });
};


function concertThis() {

        var queryURL = "https://rest.bandsintown.com/artists/" + findThis + "/events?app_id=codingbootcamp";

        request(queryURL, function (error, response, body) {
    
        if (!error && response.statusCode === 200) {
            var result  =  JSON.parse(body)[0];
            var concertResults = 
                "Venue name: " + result.venue.name + "\n" +
                "Venue location: " + result.venue.city + "\n" +
                "Date of Event: " +  moment(result.datetime).format("MM/DD/YYYY") + "\n"
            
            console.log(concertResults);

        } else {
            console.log("error: " + err);
            return;
        };
    });
};

//command 4 do-what-it-says
// This block of code creates a file called "random.txt"
// It also adds the spotify command
function doWhatItSays() {

    fs.writeFile("random.txt", 'spotify-this-song, "I Want it That Way"', function (err) {
        var song = "spotify-this-song 'I Want it That Way'"
        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        };

        // Otherwise, it will print:
        console.log(song);
    });
};