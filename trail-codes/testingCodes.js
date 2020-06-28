// const { sign } = require("jsonwebtoken");
// const { promisify } = require("util");
// const jwtSignPromise = promisify(sign);
// async function jwtTrail() {
//   const token = await jwtSignPromise(
//     "8bdg7dbndw8",
//     "dje7e9nedbe9ejebfy8endbye8eenbe9enen"
//   );
//   console.log(token);
// }
// // jwtTrail();

// const { jwtSign } = require("./../utils/appPromiseFunctions");

// async function jwtfinal(id) {
//   const token = await jwtSign(id);
//   console.log(token);
// }
// jwtfinal("dhjdw8weyhdun");

// Getting Current Location
const geoip = require("geoip-lite");
console.log(geoip.lookup(`2409:4071:210e:b29c:3c5a:ebb4:80ca:d84f`));
