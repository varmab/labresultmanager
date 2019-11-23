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
  let rawData = utf8.encode(RawData).replace(/\'/g, "\\'")
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
            resolve(transactionId)
          }
        })
        connection.execSql(request)
      })
    } catch (err) {
      logger.log({ level: "error", message: "error updating", err })
    }
  })
}

exports.updateRecWithReport = (transactionId, printableReport, filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      var connection = new Connection(config)
      connection.on("connect", function(err) {
        let tableName = "xrxQuestResultTransaction"
        let qry = `update ${tableName} set PrintableReport = CAST(N'' AS XML).value('xs:base64Binary("${printableReport}")', 'VARBINARY(MAX)') where TransactionId = '${transactionId}'`
        var request = new Request(qry, err => {
          if (err) {
            logger.log({
              level: "error",
              message: "error while updating with report",
              error: err
            })
          } else {
            logger.log({
              level: "info",
              message: "Transaction updated with report"
            })
            resolve(transactionId)
          }
        })
        connection.execSql(request)
      })
    } catch (err) {
      logger.log({ level: "error", message: "error updating", err })
    }
  })
}
