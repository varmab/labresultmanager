const cron = require("node-cron")
let logger = require("./routes/logger")
let sftp = require("./routes/sftp")
let hl7 = require("./routes/hl7")
let db = require("./routes/db")

global.__basedir = __dirname

class LabResultManager {
  static run() {
    //Download Files to local folder
    sftp.downloadHl7Files().then(localFiles => {
      localFiles.map(file => {
        hl7.parseHl7File(file).then(values => {
          db.saveToDB(values[0], values[1]).then(value => {
            logger.log({ level: "info", message: value })
          })
        })
      })
    })
  }
}

LabResultManager.run()

// const task = cron.schedule("*/1 * * * *", () => {
//   LabResultManager.run()
// })

// task.start()
