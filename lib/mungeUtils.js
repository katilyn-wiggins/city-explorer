function formatLocation(someLocation) {
  return {
    formatted_query: someLocation[0].display_name,
    latitude: someLocation[0].lat,
    longitude: someLocation[0].lon
  };
}

function formatWeather(weatherObject) {
  console.log(weatherObject);
  const newWeather = weatherObject.data.map((weatherItem) => {
    return {
      forecast: weatherItem.weather.description,
      time: new Date(weatherItem.ts * 1000).toDateString()
    };
  });

  const finalWeather = newWeather.slice(0, 7);
  return finalWeather;
}

function formatReviews(reviewObject) {
  const newReview = reviewObject.map((reviewItem) => {
    return {
      name: reviewItem.name,
      image_url: reviewItem.image_url,
      price: reviewItem.price,
      rating: reviewItem.rating,
      url: reviewItem.url
    };
  });

  // const finalReview = newReview.slice(0, 5);
  return newReview;
}

module.exports = {
  formatLocation,
  formatWeather,
  formatReviews
};
