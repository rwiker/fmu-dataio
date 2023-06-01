const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");
const process = require("process");
const YAML = require("yaml");

async function main() {
  const infile = process.argv[2];

  const doc = fs.readFileSync(infile, "utf-8");

  const object = (/\\.yml$/i, infile) ? YAML.parse(doc) : JSON.parse(doc);

  const schemaurl = "http://127.0.0.1:8080/fmu_results.json";

  object["$schema"] = schemaurl;

  const schemaresp = await fetch(schemaurl);
  const schema = await schemaresp.json();

  let ajv = new Ajv2020({
    strict: true,
    keywords: ["$contractual"],
  });
  addFormats(ajv);

  const validate = ajv.compile(schema);

  let valid = validate(object);
  if (!valid) {
    console.log(JSON.stringify(validate.errors, null, 2));
  }
}

main();
