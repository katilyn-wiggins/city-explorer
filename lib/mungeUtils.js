function formatLocation(someLocation) {
  return {
    formatted_query: someLocation[0].display_name,
    latitude: someLocation[0].lat,
    longitude: someLocation[0].lon,
  };
}

function formatWeather(weatherObject) {
  const newWeather = weatherObject.data.map((weatherItem) => {
    return {
      forecast: weatherItem.weather.description,
      time: new Date(weatherItem.ts * 1000).toDateString(),
    };
  });

  const finalWeather = newWeather.slice(0, 7);
  return finalWeather;
}

function formatReviews(reviewObject) {
  const newReview = reviewObject.data.map((reviewItem) => {
    return {
      forecast: reviewItem.weather.description,
      time: new Date(reviewItem.ts * 1000).toDateString(),
    };
  });

  // const finalReview = newReview.slice(0, 3);
  return newReview;
}

module.exports = {
  formatLocation,
  formatWeather,
  formatReviews,
};
