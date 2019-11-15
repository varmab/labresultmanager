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
        // Parsing hl7 files
        hl7.parseHl7File(file).then(values => {
          // Saving the values to Transaction and Result tables
          db.saveToTransactionAndResult(values[0]).then(object => {
            // Saving the values to EhrOrders table
            db.saveToEhrOrders(
              object.transactionId,
              object.patId,
              values[0]
            ).then(transactionId => {
              // Updating the Transaction with rawData
              updates
                .updateRecWithRawData(values[1], transactionId)
                .then(tId => {
                  // db.decodeBase64(object.base64).then(() => {
                  updates
                    .updateRecWithReport(transactionId, object.base64)
                    .then(status => {
                      logger.log({
                        level: "info",
                        status: status
                      })
                    })
                  // })
                })
            })
          })
        })
      })
    })
  }
}

//Cron-job scheduled to run for every 10-mins

const task = cron.schedule("*/1 * * * *", () => {
  LabResultManager.run()
})

task.start()
