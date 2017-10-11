const {calendar} = require('./api');
module.exports = async function calcDemand(property) {
  const star = property.listing.star_rating || 0;
  const revCount = property.listing.reviews_count;
  console.log('demand!', property.listing.id);

  let cal;
  try {
    cal = await calendar(property.listing.id);
  } catch (e) {
    return {
      weight: 0,
      lat: property.listing.lat,
      lng: property.listing.lng,
    }
  }

  //take 10 days, could have sent a days query, but this is easier - without having to calculate which date we are on
  const days = cal.calendar_days.splice(0,10);
  let busy = 0;
  days.forEach((d) => {
    busy += d.available ? 0 : 1;
  });
  //get the ratio, we took 10 days
  busy = busy / 10;

  //higher rated properties, are more likely to be hired, therefor demand is reverse for star rating, if high star rating, demand effect is lower
  //5 star rating would deduct 0.5 points, while for an unrated property it won't deduct anything
  //Max rating then would be an unrated property that's busy for the next 10 days (2) 
  const weight = Math.max(busy * 2 + (star / 5 * -0.3), 0);
  console.log('Finished demand processing', property.listing.id);
  return {
    weight,
    lat: property.listing.lat,
    lng: property.listing.lng,
  };
}