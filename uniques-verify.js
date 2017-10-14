const location = process.argv[2] || 'brooklyn';

const listings = require(`./${location}-listings.json`);

const ids = listings.map(item => item.listing.id);

const unique = [...new Set(ids)];

console.log(ids.length);
console.log(unique.length);