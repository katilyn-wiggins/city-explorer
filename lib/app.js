const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
// const weatherData = require('./weather.js');
// const locationItem = require('./geojson.js');
const request = require('superagent');

const {
  formatLocation,
  formatWeather,
  formatReviews
} = require('./mungeUtils.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

app.get('/location', async (req, res) => {
  try {
    const city = req.query.search;

    const locationInfo = await request.get(
      `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
    );

    const formattedResponse = formatLocation(locationInfo.body);
    res.json(formattedResponse);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/weather', async (req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;

    const weatherInfo = await request.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
    );
    const finalWeather = formatWeather(weatherInfo.body);

    res.json(finalWeather);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// request
//   .get('/reviews')
//   .set('Authorization', `${process.env.YELP_API_KEY}`)
//   .set('Accept', 'application/json');
// app.get('/reviews', async (req, res) => {
//   try {
//     const lat = req.query.latitude;
//     const lon = req.query.longitude;

//     const reviewInfo = await request.get(
//       `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}`
//     );
//     const finalReview = formatReviews(reviewInfo.body);

//     res.json(finalReview);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

app.use(require('./middleware/error'));

module.exports = app;
