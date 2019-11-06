const cron = require("node-cron")
let logger = require("./routes/logger")
let sftp = require("./routes/sftp")
let hl7 = require("./routes/hl7")
let db = require("./routes/db")
let updates = require("./routes/updateTransaction")

global.__basedir = __dirname

class LabResultManager {
  static run() {
    //Download Files to local folder
    sftp.downloadHl7Files().then(localFiles => {
      localFiles.map(file => {
        hl7.parseHl7File(file).then(values => {
          db.saveToTransactionAndResult(values[0]).then(object => {
            db.saveToEhrOrders(
              object.transactionId,
              object.patId,
              values[0]
            ).then(transactionId => {
              updates
                .updateRecWithRawData(values[1], transactionId)
                .then(printableReport => {
                  updates
                    .updateRecWithReport(transactionId, printableReport)
                    .then(status => {
                      logger.log({ level: "info", status: status })
                    })
                })
            })
          })
        })
      })
    })
  }
}

//Cron-job scheduled to run for every 10-mins

const task = cron.schedule("*/10 * * * *", () => {
  LabResultManager.run()
})

task.start()
