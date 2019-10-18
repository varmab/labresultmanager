const fs = require("fs")
const Reader = require("hl7js").Reader
var reader = new Reader("BASIC")
const mapping = require("./mapping")

exports.parseHl7Files = () => {
  console.log("fetching hl7 files from local dir")
  const filesFolder = __basedir + "/files/"
  fs.readdir(filesFolder, (err, files) => {
    files.forEach(file => {
      const hl7_file_path = filesFolder + "/" + file
      fs.readFile(hl7_file_path, function(err, buffer) {
        reader.read(buffer.toString(), function(err, hl7Data) {
          if (err) {
            console.log("err@@", err)
          } else {
            let rawMessage = hl7Data.segments[0].rawData
            mapping.fetchValues(rawMessage)
          }
        })
      })
    })
  })
}
