/**
 * test/codify
 */
"use strict";

require("../_register");
const { codify } = require("@dictadata/storage-junctions/test")
const { logger } = require("@dictadata/lib");

logger.info("=== tests: html codify");

async function tests() {
  logger.verbose("=== codify helloworld.html");
  if (await codify({
    origin: {
      smt: "html|./test/data/input/html/|helloworld.html|*",
      options: {
        headers: [ "Greating" ]
      }
    },
    "terminal": {
      output: "./test/data/output/html/codify_hello.json"
    }
  })) return 1;

  logger.verbose("=== codify ansi.html");
  if (await codify({
    origin: {
      smt: "html|./test/data/input/html/|ansi.html|*",
      options: {
        heading: "Congressional Districts"
      }
    },
    "terminal": {
      output: "./test/data/output/html/codify_ansi_cd.json"
    }
  })) return 1;

  logger.verbose("=== codify texas_jan2024.shtml");
  if (await codify({
    origin: {
      smt: "html|./test/data/input/html/|texas_jan2024.shtml|*",
      options: {}
    },
    "terminal": {
      output: "./test/data/output/html/codify_texas_jan2024.json"
    }
  })) return 1;

  logger.verbose("=== codify az_jan2024.htm");
  if (await codify({
    origin: {
      smt: "html|./test/data/input/html/|az_jan2024.htm|*",
      options: {
        "heading": "Counties - Inactive",
        "cells": 9,
        "RepeatCell.column": 0
      }
    },
    "terminal": {
      output: "./test/data/output/html/codify_az_counties.json"
    }
  })) return 1;


  logger.verbose("=== codify az_jan2024.htm");
  if (await codify({
    origin: {
      smt: "html|./test/data/input/html/|az_jan2024.htm|*",
      options: {
        "heading": "Legislative Districts - Active",
        "RepeatHeading.header": "County:1"
      }
    },
    "terminal": {
      output: "./test/data/output/html/codify_az_legislative.json"
    }
  })) return 1;

}

(async () => {
  if (await tests()) return 1;
})();
