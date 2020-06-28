const os = require("os");

const geoLocation = require("geoip-lite");
const ifaces = os.networkInterfaces();

const currentLocation = ifaces["Wi-Fi"][0].address;

const latitute = geoLocation.lookup(currentLocation).ll[0];

const longitute = geoLocation.lookup(currentLocation).ll[1];

console.log(latitute, longitute);
console.log(geoLocation.lookup("2409:4071:e93:b2ac:3c5a:ebb4:80ca:d84f"));
