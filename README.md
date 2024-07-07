# @dictadata/html-junction 0.9.x

HtmlJunction implements a junction for reading tabular data in HTML documents.  HtmlJunction is a storage plugin for use with [_@dictadata/storage-junctions_](https://github.com/dictadata/storage-junctions) and related projects [_@dictadata/storage-tracts_](https://github.com/dictadata/storage-tracts) ETL command line utility and [_@dictadata/storage-node_](https://github.com/dictadata/storage-node) API Server.

The plugin uses the [html-data-parser](https://github.com/dictadata/html-data-parser) module to parse the HTML documents.

## Installation

```bash
npm install @dictadata/storage-junctions @dictadata/html-junction
```

## Plugin Initialization

Import the _Storage Junctions_ library and the _HTML Junction_ plugin.  Then register _HTML Junction_ with the _Storage Junctions_' `Storage` module. This will register _HTML Junction_ for use with storage model `"html"`.

```javascript
const { Storage } = require("@dictadata/storage-junctions");
const HtmlJunction = require("@dictadata/html-junction");

Storage.Junctions.use("html", HtmlJunction);
```

## Creating an instance of HTMLJunction

Create an instance of `HTMLJunction` class.

```javascript
let junction = Storage.activate(smt, options);
```

### SMT

`HtmlJunction` constructor takes an SMT, Storage Memory Trace, with the address of the data source. SMT can be a string or object. The string format is `"model|locus|schema|key"` which for HTMLJunction is `"html|url or local path|document filename|*"`.

```javascript
// SMT string
let smt = "html|./path/|mydoc.html|*"

// SMT object
let SMT = {
  model: "html",
  locus: "http://server.org/path/",
  schema: "mydoc.html",
  key: "*" // all rows
}
```

### HtmlJunction Options

`HtmlJunction` constructor takes an options object with the following fields.

`{string|regexp} heading` - Section heading in the document after which the parser will look for tabular data; optional, default: none. The parser does a string comparison or match looking for first occurrence of `heading` value in the first cell of rows, row[0]. If not specified then data output starts with first row of the document.

`{string|regexp} id` - Table id attribute; optional, default: none. The parser does a string comparison or regexp match looking for `id=` value in the table attributes. If not specified then data output stops on value of `cells` or the end of document.

`{integer} cells` - Minimum number of cells in tabular data; optional, default: 1. After `heading` string is found parser will look for the first row that contains at least `cells` count of cells. The parser will output rows until it encounters a row with less than `cells` count of cells.

`{boolean} newlines` - Preserve new lines in cell data; optional, default: false. When false newlines will be replaced by spaces. Preserving newlines characters will keep the formatting of multiline text such as descriptions. Though, newlines are problematic for cells containing multiword identifiers and keywords that might be wrapped in the HTML text.

## Streaming Usage

The following example creates an instance of `HtmlReader` and collects streamed data into an array. In this case the storage construct is an object representing a row of cells from the HTML document. `HtmlReader` is derived from Node.js stream Readable. So the reader can be the source of any Node.js pipeline.

```javascript
  async retrieveData() {
    let response = [];

    let junction = Storage.activate(smt, options);
    let reader = junction.createReader();

    reader.on('data', (construct) => {
      response.push(construct);
    })
    rs.on('end', () => {
      console.log('End of data.');
    });
    rs.on('error', (err) => {
      console.error(err);
    });

    await stream.finished(reader);

    return response;
  }
```

## Using HtmlJunction plugin with Storage-Tracts ETL

`HtmlJunction` can be used from the command line, batch file or task schedular via the Storage-Tracts ETL command line utility.

### Install Storage-Tracts

Install Storage-Tracts in NPM's global workspace. This will allow you to run from any folder using the command "etl" or "storage-etl".

```bash
npm -g install @dictadata/storage-tracts
```

### Storage_Tracts ETL Utility

The ETL utility takes two parameters as shown below. See the [Storage-Tracts](https://github.com/dictadata/storage-tracts) documentation for full details.

```bash
etl [-t tractsFile] [tractName]
```

### ETL Tracts File

An ETL Tracts file is a JSON object describing the storage source and storage destination. Each top level property is a tract. For HTML files you will need to also specify the plugin.

```json
{
  "config": {
    "plugins": {
      "junctions": {
        "@dictadata/html-junction": [ "html" ]
      }
    }
  },
  "transfer": {
    "action": "transfer",
    "origin": {
      "smt": "html|./test/data/input/|foofile.html|*",
      "options": {
        "heading": "html section heading",
        "cells": 7,
        "repeatingHeaders": true
      }
    },
    "terminal": {
      "smt": "json|./test/data/output/|foofile.json|*"
    }
  }
}
```

## Examples

### Hello World

[HelloWorld.html](./test/data/input/html/helloworld.html) is a single page HTML document with the string "Hello, world!" positioned on the page. The parser output is one row with one cell.

Create an ETL tract file named mytracts.json with one tract name hello_world.

```json
{
  "hello_world": {
    "action": "transfer",
    "origin": {
      "smt": "html|./test/data/input/html/|helloworld.html|*",
    },
    "terminal": {
      "smt": "json|./test/data/output/html/|helloworld.json|*"
    }
  },
  "plugins": {
    "junctions": {
      "dictadata/html-junction": [ "html" ]
    }
  }
}
```

Run the ETL command.

```bash
etl -t mytracts.json hello_world
```

The output is save in file helloworld.json which contains the data rows from the html document.

```json
[
  { "Greeting": "Hello, world!" }
]
```

See the [html-data-parser](https://github.com/dictadata/html-data-parser) project for more complex examples.
