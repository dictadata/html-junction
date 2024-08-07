/**
 * html-junction/html-writer
 */
"use strict";

const { StorageWriter } = require('@dictadata/storage-junctions');
const { logger } = require("@dictadata/lib");

module.exports = class HtmlWriter extends StorageWriter {

  /**
   *
   * @param {*} storageJunction
   * @param {*} options
   */
  constructor(storageJunction, options = null) {
    super(storageJunction, options);

  }

  async _write(construct, encoding, callback) {
    logger.debug("HtmlWriter._write");
    logger.debug(JSON.stringify(construct));
    // check for empty construct
    if (construct.constructor !== Object || Object.keys(construct).length === 0) {
      callback();
      return;
    }

    try {
      // save construct to .schema
      this._stats.count += 1;
      await this.junction.store(construct);

      callback();
    }
    catch (err) {
      logger.error(err.message);
      callback(this.junction.StorageError(err));
    }

  }

  async _writev(chunks, callback) {
    logger.debug("HtmlWriter._writev");

    try {
      for (var i = 0; i < chunks.length; i++) {
        let construct = chunks[ i ].chunk;
        let encoding = chunks[ i ].encoding;

        // save construct to .schema
        await this._write(construct, encoding, () => { });
      }
      callback();
    }
    catch (err) {
      logger.error(err);
      callback(this.junction.StorageError(err));
    }
  }

  _final(callback) {
    logger.debug("HtmlWriter._final");

    try {
      // close connection, cleanup resources, ...
    }
    catch (err) {
      logger.warn(err.message);
      callback(this.junction.StorageError(err));
    }
    callback();
  }

};
