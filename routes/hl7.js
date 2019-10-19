const fs = require("fs")
const Reader = require("hl7js").Reader
const reader = new Reader("BASIC")
const parser = require("@rimiti/hl7-object-parser")
const s12Mapping = require("./s12.json")
const queries = require("./db")

exports.parseHl7Files = () => {
  const filesFolder = __basedir + "/files/"
  fs.readdir(filesFolder, (err, files) => {
    files.forEach(file => {
      const hl7_file_path = filesFolder + "/" + file
      fs.readFile(hl7_file_path, function(err, buffer) {
        reader.read(buffer.toString(), function(err, hl7Data) {
          if (err) {
            logger.log({
              level: "error",
              message: err
            })
          } else {
            mapValues(hl7Data.segments[0].rawData)
          }
        })
      })
    })
  })
}

function mapValues(rawMessage) {
  const obj = parser.decode(rawMessage, s12Mapping)
  // Passing mapped values to queries
  queries.dbQueries(obj)
}
