const api = require('./api');
const fs = require('fs-extra');
const demand = require('./demand');
let requestIdGenerator = 10011;
const requestStatus = {};

async function getInitialResults(location, price_min, price_max) {
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
    return { points:  JSON.parse(heatmap) };
  }
  let requestId = requestIdGenerator++;
  process.nextTick(async () => {
    let curPrice = 0;
    let range = 20;
    //get 1 single result, see how many we have in the price range
    let results = await getInitialResults(location, curPrice, curPrice + range);
    let allListings = [];
    console.log('Results for location', results, location);
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
          // if got too few, increase range for next fetch
          if (results.metadata.listings_count < 300) {
            range += 3;
          }
          let listings = await paginate(location, results.metadata.listings_count, curPrice, range);
          allListings = allListings.concat(listings);
          requestStatus[requestId].currentPrice = curPrice;
          requestStatus[requestId].listingsCount = allListings.length;
        }
        results = await getInitialResults(location, curPrice, curPrice + range);
      }
    } catch (e) {
      console.log('Error fetching listings', e);
    }
    console.log('Finished fetching listings');
    requestStatus[requestId].searchDone = true;
    const demandPromises = allListings.map((listing) => demand(listing));

    let totalDemand = requestStatus[requestId].demand = demandPromises.length;
    let demandDone = 0;
    demandPromises.forEach(d => d.then(() => {
      demandDone++
      requestStatus[requestId].demandDone = demandDone;
    }));

    let heatmap = await Promise.all(demandPromises);
    
    await fs.writeFile(`./${location}-heatmap.json`, JSON.stringify(heatmap, null, 2), 'utf8');

    requestStatus[requestId].done = true;
  })
  requestStatus[requestId] = {
    done: false,
    searchDone: false,
    currentPrice: 0,
    demand: 0,
    listingsCount: 0,
    demandDone: 0,
  };
  return {
    requestId,
  }
  
}

function getStatus(id) {
  return Object.assign({}, requestStatus[id] || {});
}

module.exports = {
  getHeatmap,
  getStatus
}