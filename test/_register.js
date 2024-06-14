/**
 * test/register
 */
"use strict";

const { Storage } = require("@dictadata/storage-junctions");
const { logger } = require("@dictadata/lib");

const HtmlJunction = require("../storage/junctions/html");

logger.info("--- adding HtmlJunction to Storage classes");
Storage.Junctions.use("html", HtmlJunction);
