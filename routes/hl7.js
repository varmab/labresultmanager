const fs = require("fs")
const Reader = require("hl7js").Reader
const reader = new Reader("BASIC")
const parser = require("@rimiti/hl7-object-parser")
const s12Mapping = require("./s12.json")

exports.parseHl7File = (file) => {
  return new Promise((resolve,reject)=>{
    fs.readFile(file, function (err, buffer) {
      if (err) reject(err);
      reader.read(buffer.toString(), function (err, hl7Data) {
        if (err) {
          reject(err);
        } else {
          var hl7Message=parser.decode(hl7Data.segments[0].rawData, s12Mapping);
          resolve(hl7Message)
        }
      })
    })
  })
}
