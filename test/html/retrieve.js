/**
 * test/html/retrieve
 */
"use strict";

require("../_register");
const { logger } = require("@dictadata/lib");
const { retrieve } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: html retrieve");

async function tests() {

  logger.info("=== html retrieve helloworld");
  if (await retrieve({
    origin: {
      smt: "html|./test/data/input/html/|helloworld.html|*",
      options: {
        headers: [ "Greating" ]
      }
    },
    terminal: {
      output: "./test/data/output/html/retrieve_hello.json"
    }
  })) return 1;

  logger.info("=== html retrieve helloworld");
  if (await retrieve({
    origin: {
      smt: "html|./test/data/input/html/|helloworld.html|*",
      options: {
        id: "cosmic",
        headers: [ "Greating" ]
      }
    },
    terminal: {
      output: "./test/data/output/html/retrieve_cosmic.json"
    }
  })) return 1;

  logger.info("=== html retrieve ansi");
  if (await retrieve({
    origin: {
      smt: "html|./test/data/input/html/|ansi.html|*",
      options: {
        heading: "Congressional Districts"
      }
    },
    terminal: {
      output: "./test/data/output/html/retrieve_ansi_cd.json"
    }
  })) return 1;

  logger.info("=== html retrieve texas_jan2024");
  if (await retrieve({
    origin: {
      smt: "html|./test/data/input/html/texas_jan2024.shtml||*",
      options: {}
    },
    terminal: {
      output: "./test/data/output/html/retrieve_texas_jan2024.json"
    }
  })) return 1;

  logger.info("=== html retrieve AZ counties");
  if (await retrieve({
    origin: {
      smt: "html|./test/data/input/html/az_jan2024.htm||*",
      options: {
        "heading": "Counties - Inactive",
        "cells": 9,
        "RepeatCell.column": 0
      }
    },
    terminal: {
      output: "./test/data/output/html/retrieve_az_counties.json"
    }
  })) return 1;

  logger.info("=== html retrieve az legislative");
  if (await retrieve({
    origin: {
      smt: "html|./test/data/input/html/az_jan2024.htm||*",
      options: {
        "heading": "Legislative Districts - Active",
        "RepeatHeading.header": "County:1"
      }
    },
    terminal: {
      output: "./test/data/output/html/retrieve_az_legislative.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
