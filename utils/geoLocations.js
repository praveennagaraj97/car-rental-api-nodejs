const { networkInterfaces } = require("os");

const { lookup } = require("geoip-lite");

function getLocation() {
  const address = networkInterfaces()["Wi-Fi"][0].address;
  const data = lookup(address);
  return data;
}

export const locationFinder = getLocation;

// new Promise((resolve, reject) => {
// return resolve(getLocation());
// });
