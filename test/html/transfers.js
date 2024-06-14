/**
 * test/html/transfer
 */
"use strict";

require("../_register");
const { logger } = require("@dictadata/lib");
const { transfer } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: html transfer");

async function tests() {

  logger.info("=== html transfer helloworld");
  if (await transfer({
    origin: {
      smt: "html|./test/data/input/html/|helloworld.html|*",
      options: {
        headers: [ "Greating" ]
      },
      pattern: {}
    },
    terminal: {
      smt: "json|./test/data/output/html/|transfer_hello.json|*",
      output: "./test/data/output/html/transfer_hello.json"
    }
  })) return 1;

  logger.info("=== html transfer helloworld");
  if (await transfer({
    origin: {
      smt: "html|./test/data/input/html/|helloworld.html|*",
      options: {
        id: "cosmic",
        headers: [ "Greating" ]
      },
      pattern: {}
    },
    terminal: {
      smt: "json|./test/data/output/html/|transfer_cosmic.json|*",
      output: "./test/data/output/html/transfer_cosmic.json"
    }
  })) return 1;

  logger.info("=== html transfer ansi");
  if (await transfer({
    origin: {
      smt: "html|./test/data/input/html/|ansi.html|*",
      options: {
        heading: "Congressional Districts"
      },
      pattern: {}
    },
    terminal: {
      smt: "json|./test/data/output/html/|transfer_ansi_cd.json|*",
      output: "./test/data/output/html/transfer_ansi_cd.json"
    }
  })) return 1;

  logger.info("=== html transfer texas_jan2024");
  if (await transfer({
    origin: {
      smt: "html|./test/data/input/html/texas_jan2024.shtml||*",
      options: {},
      pattern: {}
    },
    terminal: {
      smt: "json|./test/data/output/html/|transfer_texas_jan2024.json|*",
      output: "./test/data/output/html/transfer_texas_jan2024.json"
    }
  })) return 1;

  logger.info("=== html transfer AZ counties");
  if (await transfer({
    origin: {
      smt: "html|./test/data/input/html/az_jan2024.htm||*",
      options: {
        "heading": "Counties - Inactive",
        "cells": 9,
        "RepeatCell.column": 0
      },
      pattern: {
        match: {
          "Date/Period": "24-Jan"
        }
      }
    },
    terminal: {
      smt: "json|./test/data/output/html/|transfer_az_counties.json|*",
      output: "./test/data/output/html/transfer_az_counties.json"
    }
  })) return 1;

  logger.info("=== html transfer az legislative");
  if (await transfer({
    origin: {
      smt: "html|./test/data/input/html/az_jan2024.htm||*",
      options: {
        "heading": "Legislative Districts - Active",
        "RepeatHeading.header": "County:1"
      },
      pattern: {
        match: {
          "County": "Total:"
        }
      }
    },
    terminal: {
      smt: "json|./test/data/output/html/|transfer_az_legislative.json|*",
      output: "./test/data/output/html/transfer_az_legislative.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
