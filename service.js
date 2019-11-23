const cron = require("node-cron")
var Base64 = require("js-base64").Base64
const fs = require("fs")
let logger = require("./routes/logger")
let sftp = require("./routes/sftp")
let hl7 = require("./routes/hl7")
let db = require("./routes/db")
let updates = require("./routes/updateTransaction")

global.__basedir = __dirname
global.atob = require("atob")

var decodeBase64 = s => {
  var e = {},
    i,
    b = 0,
    c,
    x,
    l = 0,
    a,
    r = "",
    w = String.fromCharCode,
    L = s.length
  var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  for (i = 0; i < 64; i++) {
    e[A.charAt(i)] = i
  }
  for (x = 0; x < L; x++) {
    c = e[s.charAt(x)]
    b = (b << 6) + c
    l += 6
    while (l >= 8) {
      ;((a = (b >>> (l -= 8)) & 0xff) || x < L - 2) && (r += w(a))
    }
  }
  return r
}

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
                .then(async tId => {
                  // Updating the Transaction with printable report
                  updates
                    .updateRecWithReport(transactionId, object.base64)
                    .then(tId => {
                      // Creating file with printable report varbinary
                      db.createFile(tId).then(status => {
                        logger.log({
                          level: "info",
                          message: status
                        })
                      })
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

// const task = cron.schedule("*/1 * * * *", () => {
LabResultManager.run()
// })

// task.start()
