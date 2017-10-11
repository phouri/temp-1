const api = require('./api');
const fs = require('fs-extra');
const demand = require('./demand');

async function getInitialResults(price_min, price_max, location) {
  return await api.search({
    location,
    _limit: 1,
    price_min,
    price_max
  });
}

const paginate = async(location, total, price_min, range) => {
  const price_max = price_min + range;
  const _limit = 50;
  let queries = [];
  let _offset = 0;
  for (let _offset = 0; _offset < total; _offset += 50) {
    queries.push(api.search({
      location,
      _limit,
      _offset,
      price_min,
      price_max
    }));
  }

  const results = await Promise.all(queries);
  return results.map(r => r.search_results).reduce((a, b) => a.concat(b));

}

const getHeatmap = async(location = 'brooklyn') => {
  let heatmapFile = `./${location}-heatmap.json`;
  const exists = await fs.exists(heatmapFile);
  if (exists) {
    let heatmap = await fs.readFile(heatmapFile, 'utf8');
    return JSON.parse(heatmap);
  }
  let curPrice = 0;
  let range = 20;
  let results = await getInitialResults(location, curPrice, curPrice + range);
  let allListings = [];
  try {
    while (results.metadata.listings_count > 0 && range < 200) {
      //too many, filter more
      console.log('Got ', results.metadata.listings_count, 'Listings');
      if (results.metadata.listings_count > 1000) {
        range -= 3;
        if (range < 0) {
          range = 1;
        }
      } else if (results.metadata.listings_count === 0) {
        //increase fast if at 0, to validate we aren't just in a 0 spot of the price
        range += 50;
      } else {
        curPrice += range;
        if (results.metadata.listings_count < 300) {
          range += 3;
        }
        let listings = await paginate(location, results.metadata.listings_count, curPrice, range);
        allListings = allListings.concat(listings);
      }
      results = await getInitialResults(location, curPrice, curPrice + range);
    }
  } catch (e) {
    console.log('Error fetching listings', e);
  }
  console.log('Finished fetching listings');
  const demandPromises = allListings.map((listing) => demand(listing));
  let heatmap = await Promise.all(demandPromises);

  //no need to wait for this
  fs.writeFile(`./${location}-heatmap.json`, JSON.stringify(heatmap, null, 2), 'utf8');
  return heatmap;
}

module.exports = {
  getHeatmap
}