/**
 * html-junction/html-reader
 */
"use strict";

const { StorageReader } = require('@dictadata/storage-junctions');
const { HtmlDataReader, RowAsObjectTransform, RepeatCellTransform, RepeatHeadingTransform } = require('html-data-parser');
const { StorageError } = require('@dictadata/storage-junctions/types');
const { logger } = require("@dictadata/lib");
const { pipeline } = require('node:stream/promises');

module.exports = class HTMLReader extends StorageReader {

  /**
   *
   * @param {object}   junction - parent StorageJunction
   * @param {object}   options
   * @param {string}   [options.heading] - HTML section heading or text before data table, default: none
   * @param {string}   [options.id] - value of table id attribute, default: none
   * @param {number}   [options.cells] - minimum number of cells in a tabular data, default: 1
   * @param {boolean}  [options.newlines] - preserve new lines in cell data, default: false
   * @param {string[]} [options.headers] - RowAsObject: array of column names for data, default none, first table row contains names.
   * @param {number}   [options.column] - RepeatCellTransform: column index of cell to repeat, default 0
   * @param {string}   [options.header] - RepeatHeadingTransform: column name for the repeating heading field, default "heading:0"
   */
  constructor(junction, options) {
    super(junction, options);

    this.options.url = this.junction.smt.locus + this.junction.smt.schema;

    this.pipes = [];
  }

  async _construct(callback) {
    logger.debug("HTMLReader._construct");

    try {
      let htmlReader = new HtmlDataReader(this.options);
      this.pipes.push(htmlReader);

      if (Object.hasOwn( this.options,  "RepeatCell.column") || Object.hasOwn( this.options, "column")) {
        let transform = new RepeatCellTransform(this.options);
        this.pipes.push(transform);
      }

      if (Object.hasOwn( this.options, "RepeatHeading.header") || Object.hasOwn( this.options, "header")) {
        let transform = new RepeatHeadingTransform(this.options);
        this.pipes.push(transform);
      }

      let rowAsObjects = new RowAsObjectTransform(this.options);
      this.pipes.push(rowAsObjects);

      var encoder = this.junction.createEncoder(this.options);

      var reader = this;
      var _stats = this._stats;
      var count = this.options?.pattern?.count || this.options?.count || -1;
      this.started = false;

      // eslint-disable-next-line arrow-parens
      rowAsObjects.on('data', (construct) => {
        if (construct) {
          // use junction's encoder functions
          construct = encoder.cast(construct);
          construct = encoder.filter(construct);
          construct = encoder.select(construct);
          //logger.debug(JSON.stringify(construct));

          if ((_stats.count + 1) % 10000 === 0) {
            logger.verbose(_stats.count + " " + _stats.interval + "ms");
          }

          if (count > 0 && _stats.count > count) {
            reader.push(null);
            //htmlReader.destroy();
          }
          else if (construct) {
            _stats.count += 1;
            reader.push(construct);
            //parser.pause();  // If push() returns false stop reading from source.
          }
        }

      });

      rowAsObjects.on('end', () => {
        reader.push(null);
      });

      rowAsObjects.on('error', function (err) {
        //logger.error(err);
        throw new StorageError(err);
      });

    }
    catch (err) {
      logger.warn(err);
      this.destroy(this.junction.StorageError(err));
    }

    callback();
  }

  /**
   * Fetch data from the underlying resource.
   * @param {*} size <number> Number of bytes to read asynchronously
   */
  async _read(size) {
    logger.debug('HTMLReader._read');

    // read up to size constructs
    try {
      if (!this.started) {
        this.started = true;
        pipeline(this.pipes);
      }
    }
    catch (err) {
      logger.error(err.message);
      this.push(null);
    }

  }

};
