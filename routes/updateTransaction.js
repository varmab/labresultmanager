var Connection = require("tedious").Connection
var Request = require("tedious").Request
const utf8 = require("utf8")
require("dotenv").config()

var config = {
  server: process.env.DB_SERVER,
  authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    }
  },
  options: {
    encrypt: true,
    database: process.env.DB_DATABASE
  }
}

exports.updateRecWithRawData = (RawData, transactionId) => {
  let res = RawData.split("AEGIS^Report^PDF^Base64^")
  let rawData = utf8.encode(res[0]).replace(/\'/g, "\\'")
  let printableReport = res[1]
  return new Promise(async (resolve, reject) => {
    try {
      var connection = new Connection(config)
      connection.on("connect", function(err) {
        logger.log({
          level: "info",
          message: "connected",
          error: err
        })
        let tableName = "xrxQuestResultTransaction"
        let qry = `update ${tableName} set RawData = '${rawData}' where TransactionId = '${transactionId}'`
        var request = new Request(qry, err => {
          if (err) {
            logger.log({
              level: "error",
              message: "error while updating",
              error: err
            })
          } else {
            logger.log({ level: "info", message: "updated with rawdata" })
            resolve(printableReport)
          }
        })
        connection.execSql(request)
      })
    } catch (err) {
      logger.log({ level: "error", message: "error updating", err })
    }
  })
}

exports.updateRecWithReport = (transactionId, printableReport) => {
  return new Promise(async (resolve, reject) => {
    try {
      var connection = new Connection(config)
      connection.on("connect", function(err) {
        logger.log({
          level: "info",
          message: "connected",
          error: err
        })
        let tableName = "xrxQuestResultTransaction"
        let qry = `update ${tableName} set PrintableReport = CONVERT(varbinary(MAX),'${printableReport}') where TransactionId = '${transactionId}'`
        logger.log({ level: "info", qry: qry })
        var request = new Request(qry, err => {
          if (err) {
            logger.log({
              level: "error",
              message: "error while updating",
              error: err
            })
          } else {
            logger.log({ level: "info", message: "updated with report" })
            resolve("COMPLETED")
          }
        })
        connection.execSql(request)
      })
    } catch (err) {
      logger.log({ level: "error", message: "error updating", err })
    }
  })
}
