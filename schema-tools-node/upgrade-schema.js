// (1) Install by running "npm install --save alterschema"
const alterschema = require("alterschema");
const fs = require("fs");

const input = "../schema/definitions/0.8.0/schema/fmu_results.json";
const output = "../schema/definitions/0.9.0/schema/fmu_results.json";

const schema = JSON.parse(fs.readFileSync(input));

alterschema(schema, "draft7", "2019-09")
  .then((schema) => alterschema(schema, "2019-09", "2020-12"))
  .then((result) => JSON.stringify(result, 0, 2))
  .then((result) => fs.writeFileSync(output, result));
