
/**
 * test the html-data-parser
 */
"use strict";

const { HtmlDataParser } = require("html-data-parser");
const fs = require("fs");
const path = require("path");

async function test(options) {
  console.log(">>> input: " + options.url);

  let parser = new HtmlDataParser(options);
  let rows = [];

  parser.on('data', (data) => {
    rows.push(data);
  });

  parser.on('end', () => {
    let output = options.url.replace("/input/", "/output/").replace(".html", ".json");
    console.log(">>> output: " + output);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(rows, null, 2));
  });

  parser.on('error', (err) => {
    console.error(err);
  });

  await parser.parse();
}

(async () => {
  if (await test({ url: "./test/data/input/html/texas_jan2024.shtml" })) return;

  if (await test({
    url: "./test/data/input/html/ansi.html",
    heading: "Congressional Districts",
    cells: 3
  })) return;

  if (await test({
    "url": "./test/data/input/html/az_jan2024.htm",
    "heading": "Counties - Active",
    "cells": 9,
    "RepeatCell.column": 0
  })) return;
})();
