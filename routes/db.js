var sql = require("mssql")
var moment = require("moment-timezone")

require("dotenv").config()

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  options: {
    encrypt: true,
    database: process.env.DB_DATABASE
  }
}

var conn = `Server=${config.server},1433;Database=${config.options.database};User Id=${config.user};Password=${config.password};Encrypt=true`

const formatDate = date => {
  const d = new Date(parseInt(date))
  const modi = d.toISOString()
  return moment.utc(modi).format("MM/DD/YY hh:mm a")
}

const formatDateToFetchPatId = date => {
  logger.log({ level: "info", dateComing: date })
  const year = date.substring(0, 4)
  const month = date.substring(4, 6)
  const day = date.substring(6, 8)
  const modifiedDate = year + "-" + month + "-" + day
  logger.log({ level: "info", modifiedDate: modifiedDate })
  return modifiedDate
}

var generateUUID = () => {
  var d = new Date().getTime()
  var uuid = "xxxxxxxx-xxxx-4xxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

var uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const joinValues = (values, field) => {
  let result = ""
  values.map(obj => {
    result = result + "|" + obj[field]
  })
  return result.substr(1)
}

const fetchPatId = async hl7Obj => {
  let { pid } = hl7Obj
  let {
    patid,
    vendor_onfile_pat_lastname,
    vendor_onfile_pat_firstname,
    vendor_onfile_pat_dob,
    vendor_onfile_pat_sex
  } = pid

  vendor_onfile_pat_dob = vendor_onfile_pat_dob
    ? formatDateToFetchPatId(vendor_onfile_pat_dob)
    : null
  return new Promise(async (resolve, reject) => {
    try {
      var connection = await new sql.ConnectionPool(conn)
      await connection.close()
      await connection.connect(async function(err) {
        if (err) {
          logger.log({ level: "error", message: "Error connecting to DB", err })
        } else {
          logger.log({ level: "info", message: "Connected to DB" })
          var req = await new sql.Request(connection)
          let tableName = "xrxPat"
          let qry = `SELECT PatId FROM ${tableName} WHERE (LastName = '${vendor_onfile_pat_lastname}' AND FirstName = '${vendor_onfile_pat_firstname}' AND Birthdate = '${vendor_onfile_pat_dob}' AND Sex = '${vendor_onfile_pat_sex}')`
          logger.log({ level: "info", message: "query: ", qry })
          const data = await req.query(qry, async function(err, result) {
            if (err) {
              await connection.close()
              logger.log({ level: "error", message: err })
            } else {
              logger.log({ level: "info", message: result })
              let patId = result.recordset[0]
                ? result.recordset[0].PatId
                : "NOTFOUND"
              await connection.close()
              logger.log({ level: "info", message: "patId fetched", patId })
              resolve(patId)
            }
          })
        }
      })
    } catch (err) {
      let errorMessage = "Failed creating transaction" + JSON.stringify(err)
      logger.log({ level: "error", message: errorMessage })
      let error = new Error(errorMessage)
      reject(error, false)
    }
  })
}

const createTransaction = async (hl7Obj, patId) => {
  let { orc, msh, pid, nte } = hl7Obj
  let { transaction_id, vendor_accession_no } = orc
  let { message_control_id, lab_result_send_datetime } = msh
  let {
    vendor_order_referenceno,
    patid,
    vendor_onfile_pat_lastname,
    vendor_onfile_pat_firstname,
    vendor_onfile_pat_dob,
    vendor_onfile_pat_sex,
    vendor_onfile_pat_ssn
  } = pid

  lab_result_send_datetime = lab_result_send_datetime
    ? formatDate(lab_result_send_datetime)
    : null
  vendor_onfile_pat_dob = vendor_onfile_pat_dob
    ? formatDate(vendor_onfile_pat_dob)
    : null

  let notesComments = await joinValues(nte, "notes_comments")
  return new Promise(async (resolve, reject) => {
    try {
      var transactionId = await generateUUID()
      logger.log({
        level: "info",
        message: "genereated transactionId",
        transactionId
      })
      var connection = await new sql.ConnectionPool(conn)
      await connection.close()
      await connection.connect(async function(err) {
        if (err) {
          logger.log({ level: "error", message: "Error connecting to DB", err })
        } else {
          logger.log({ level: "info", message: "Connected to DB" })
          var req = await new sql.Request(connection)
          let tableName = "xrxQuestResultTransaction"
          let qry = `insert into ${tableName} (TransactionId, VendorAccessionNo, MessageControlId, LabResultSendDateTime, VendorOrderReferenceNo, PatId, VendorOnFilePatLastName, VendorOnFilePatFirstName, VendorOnFilePatDOB, VendorOnFilePatSex, VendorOnFilePatSSN, NotesComments) Values('${transactionId}', '${vendor_accession_no}', '${message_control_id}', '${lab_result_send_datetime}', '${vendor_order_referenceno}', '${patId}', '${vendor_onfile_pat_lastname}', '${vendor_onfile_pat_firstname}', '${vendor_onfile_pat_dob}', '${vendor_onfile_pat_sex}', '${vendor_onfile_pat_ssn}', '${notesComments}')`
          logger.log({
            level: "info",
            message: "Transaction Insert query: ",
            qry
          })
          const data = await req.query(qry, async function(err, result) {
            if (err) {
              await connection.close()
              logger.log({ level: "error", message: err })
            } else {
              await connection.close()
              logger.log({ level: "info", message: "Transaction created" })
              resolve(transactionId)
            }
          })
        }
      })
    } catch (err) {
      let errorMessage = "Failed creating transaction" + JSON.stringify(err)
      logger.log({ level: "error", message: errorMessage })
      let error = new Error(errorMessage)
      reject(error, false)
    }
  })
}

exports.saveToTransactionAndResult = hl7Obj => {
  return new Promise(async (resolve, reject) => {
    fetchPatId(hl7Obj)
      .then(async patId => {
        createTransaction(hl7Obj, patId)
          .then(async transactionId => {
            let { obx } = hl7Obj
            let len = obx.length
            obx.map(async result => {
              const {
                labresult_valuetype,
                labresult_analyte_number,
                labresult_analyte_name,
                labresult_measure_units,
                labresult_normal_range,
                labresult_normalcy_status,
                labresult_status,
                labresult_datetime,
                labresult_fillerId
              } = result
              var connection = await new sql.ConnectionPool(conn)
              await connection.close()
              await connection.connect(async function(err) {
                if (err) {
                  logger.log({
                    level: "error",
                    message: "Error connecting with DB",
                    err
                  })
                } else {
                  var req = await new sql.Request(connection)
                  var qry = `insert into xrxQuestResultObservationResult  (TransactionId,RequestItemId,LabResultValueType, LabResultAnalyteNumber, LabResultAnalyteName, LabResultMeasureUnits, LabResultNormalRange, LabResultNormalcyStatus, LabResultStatus, LabResultDateTime, LabResultFillerId)
                  Values('${transactionId}', 1, '${labresult_valuetype}', '${labresult_analyte_number}', '${labresult_analyte_name}', '${labresult_measure_units}', '${labresult_normal_range}', '${labresult_normalcy_status}', '${labresult_status}', '${labresult_datetime}', '${labresult_fillerId}')`
                  const data = await req.query(qry, async function(
                    err,
                    result
                  ) {
                    if (err) {
                      await connection.close()
                      logger.log({ level: "error", message: err })
                    } else {
                      len--
                      await connection.close()
                      if (len == 0) {
                        logger.log({
                          level: "info",
                          message: "Results Created"
                        })
                        resolve({ transactionId, patId })
                      }
                    }
                  })
                }
              })
            })
          })
          .catch(async err => {
            console.log("failed " + JSON.stringify(err))
          })
      })
      .catch(async err => {
        console.log("failed on fetching patId " + JSON.stringify(err))
      })
  })
}

exports.saveToEhrOrders = (transactionId, patId, hl7Obj) => {
  let { obr } = hl7Obj
  return new Promise(async (resolve, reject) => {
    logger.log({ level: "info", obr: obr })
    var connection = await new sql.ConnectionPool(conn)
    await connection.close()
    await connection.connect(async err => {
      if (err) {
        logger.log({ level: "error", message: "Error connecting with DB", err })
      } else {
        var req = await new sql.Request(connection)
        var recNo = await uuidv4()
        console.log(" recNo generated", recNo)
        var d = moment().format()
        var today = d.slice(0, 19).replace("T", " ")
        var orderName = joinValues(obr, "order_name")
        const tableName = "xrxEhr_orders "
        var qry = `insert into ${tableName} (RecNo, PatId, DateOfVisit, OrderType, OrderName, OrderClass, OrderId, HasCompleteResult) Values('${recNo}', '${patId}', '${today}', 'Lab Order', '${orderName}', 'Lab', '${transactionId}', 1)`
        logger.log({ level: "info", Qry: qry })
        const data = await req.query(qry, async function(err, result) {
          if (err) {
            await connection.close()
            logger.log({ level: "error", message: err })
          } else {
            await connection.close()
            logger.log({
              level: "info",
              message: "Order Created",
              result
            })
            resolve(transactionId)
          }
        })
      }
    })
  })
}
