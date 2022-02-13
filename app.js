require('dotenv').config();

const express = require('express');
const res = require('express/lib/response');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render('index')
});

app.get("/artist-search", (req, res, next) => {
    spotifyApi
      .searchArtists(req.query.artistName)
      .then((data) => {
          console.log("The received data from the API: ", data.body.artists.items);
            res.render("artist-search-results", {artists: data.body.artists.items});

      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
});

app.get("/albums/:artistId", (req, res, next) => {
    let artistId = req.params.artistId
    spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
        console.log("output", data.body.items)
        res.render("albums", {albums: data.body.items})
        })
        .catch((err) =>
    console.log("error here: " , err ))
});

app.get("/tracks/:albumsId", (req, res, next) => {
  let albumsId = req.params.albumsId;
  spotifyApi
    .getAlbumTracks(albumsId, { limit: 5, offset: 1 })
    .then((data) => {
      console.log("output", data.body.items);
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) => console.log("error here: ", err));
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
