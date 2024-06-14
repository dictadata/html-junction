/**
 * test/html/list
 */
"use strict";

require("../_register");
const { logger } = require("@dictadata/lib");
const { list } = require('@dictadata/storage-junctions/test');

logger.info("=== tests: html list");

async function tests() {

  logger.info("=== list html sheets (forEach)");
  if (await list({
    origin: {
      smt: "html|path|document.html|*",
      options: {
        schema: "foo*"
      }
    },
    terminal: {
      output: "./test/data/output/html/list.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
