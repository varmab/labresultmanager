const cron = require("node-cron")
const fs = require("fs")
// var parseString = require("hl7").parseString
// var serializeJSON = require("hl7").serializeJSON
// var translate = require("hl7").translate
var Reader = require("hl7js").Reader
var reader = new Reader("BASIC")
let Client = require("ssh2-sftp-client")
let sftp = new Client()

const remotePath = "/home/prod/results/"

async function functionality() {
  console.log("running a task every 1 minute")
  sftp
    .connect({
      host: "interfaceftp.aegislabs.com",
      port: "22",
      username: "calmed",
      password: "&YGVcft6%RDX"
    })
    .then(() => {
      return sftp.list(remotePath)
    })
    .then(data => {
      // console.log("data coming", data)
      let filesCount = data.length
      for (var i = 0; i < data.length; i++) {
        const remoteFilename = remotePath + data[i].name
        const localFilename = __dirname + "/data/" + data[i].name
        sftp
          .get(remoteFilename, localFilename)
          .then(stream => {
            // console.log('File download Success', stream)
            filesCount--
            if (filesCount <= 0) {
              sftp.end()
            }
          })
          .then(dt => {
            console.log("dt", dt)
            fs.readFileSync(localFilename, function(err, buffer) {
              console.log("error ", error)
              reader.read(buffer.toString(), function(err, hl7Data) {
                if (err) {
                  console.log("err@@", err)
                } else {
                  let raw = hl7Data
                  console.log("hl7@@@:", raw)

                  // var hl7 = parseString(buffer)

                  // //console.log(JSON.stringify(hl7,null,4));

                  // //repeat-component-subcomponent
                  // //console.log(hl7[0]["MSH"]["MSH_3"][0][0]);
                  // //console.log(hl7[2]["NK1"]["NK1_2"][0][0]);
                  // //console.log(hl7[2]["NK1"]["NK1_3"][0][0]);

                  // console.log(hl7[1])

                  // var text = serializeString.serializeJSON(hl7)
                  // console.log(data.split("\r").join("\n"))
                  // console.log()
                  // console.log(text.split("\r").join("\n"))
                  // console.log()
                  // console.log(text == data)

                  // //console.log(JSON.stringify(hl7,null,4));

                  // console.log(JSON.stringify(translateString(hl7), null, 4))
                }
              })
            })
          })
      }
    })
    .catch(err => {
      console.log("catch error", err)
    })
}
// schedule tasks to be run on the server for every 1-minute
const task = cron.schedule("*/1 * * * *", () => {
  functionality()
})

task.start()
