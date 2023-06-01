// const Ajv2019 = require("ajv/dist/2019");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");
const process = require("process");
const YAML = require("yaml");

function localSchemaPath(schemaurl) {
  const re = new RegExp("/(\\d+\\.\\d+\\.\\d+)/fmu_results.json$", "i");
  const m = schemaurl.match(re);
  return m && `../schema/definitions/${m[1]}/schema/fmu_results.json`;
}

function loadSchema(uri) {
  console.log("loadschema", uri);
  console.trace();
  return fetch(uri).then((res) => res.json());
}

async function main() {
  const infile = process.argv[2];

  const doc = fs.readFileSync(infile, "utf-8");

  const object = (/\\.yml$/i, infile) ? YAML.parse(doc) : JSON.parse(doc);

  const schemaurl = "http://127.0.0.1:8080/fmu_results.json";

  object["$schema"] = schemaurl;

  // const schemaurl = object["$schema"];

  // const schemapath = localSchemaPath(schemaurl);

  // const schema = JSON.parse(fs.readFileSync(schemapath, "utf-8"));

  const schemaresp = await fetch(schemaurl);
  const schema = await schemaresp.json();

  let ajv = new Ajv2020({
    keywords: ["$contractual"],
    loadSchema: (uri) => fetch(uri).then((res) => res.json()),
  });
  addFormats(ajv);

  const validate = ajv.compile(schema);

  console.log("here");
  let valid = validate(object);
  if (!valid) {
    console.log(JSON.stringify(validate.errors, null, 2));
  }
}

main();
