//4 request per second max
//Did the retry inside the api layer

const throttle = require('promise-ratelimit')(250);

const request = require('request-promise-native');
let retryTimer = 0;

async function waitRetry() {
  retryTimer+= 1000;
  if (retryTimer > 10000) {
    retryTimer = 10000;
  }
  return new Promise((res) => setTimeout(res, retryTimer));
}
const search = async (qs) => {
  return airbnbApi('search_results', qs);
}

const airbnbApi = async (path, qs = {}, headers = {}) => {
  qs.client_id = qs.client_id || '3092nxybyb0otqw18e8nh5nty';
  headers['User-Agent'] = headers['User-Agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  await throttle()
  try {
  let results = await request.get(`https://api.airbnb.com/v2/${path}`, {
    headers,
    qs
  });
  return JSON.parse(results);
} catch(e) {
  if (e.statusCode === 503) {
    //retry after a while
    console.log('Hit rate limit, waiting');
    await waitRetry();
    return airbnbApi(path, qs, headers);
  } else {
    //rethrow
    throw e;
  }
}
}

const calendar = async (id) => {
  if (!id) {
    throw new Error('Missing listing param');
  }
  return airbnbApi('calendar_days', {listing_id: id});
}
module.exports = {
  search,
  calendar
}