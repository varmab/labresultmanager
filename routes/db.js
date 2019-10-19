var sql = require("mssql")
let PromisePool = require("es6-promise-pool")
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
console.log("db config", config)

exports.dbQueries = obj => {
  let { orc, msh, pid, obx } = obj
  // xrxQuestResultTransaction fields
  const { transaction_id, vendor_accession_no } = orc
  const { message_control_id, lab_result_send_datetime } = msh
  const {
    vendor_order_referenceno,
    patid,
    vendor_onfile_pat_lastname,
    vendor_onfile_pat_firstname,
    vendor_onfile_pat_dob,
    vendor_onfile_pat_sex,
    vendor_onfile_pat_ssn
  } = pid
  const RetrievedDateTime = new Date()
  const ReviewedDateTime = new Date()
  // var conn = `Server=${config.server},1433;Database=${config.options.database};User Id=${config.user};Password=${config.password};Encrypt=true`
  var connection = new sql.ConnectionPool(config)
  connection.close()
  connection
    .connect()
    .then(() => {
      console.log("connection establisheddd")
      var request = new sql.Request(connection)
      request
        .query(
          "insert into xrxQuestResultTransaction (TransactionId, VendorAccessionNo, MessageControlId, LabResultSendDateTime, VendorOrderReferenceNo, PatId, VendorOnFilePatLastName, VendorOnFilePatFirstName, VendorOnFilePatDOB, VendorOnFilePatSex, VendorOnFilePatSSN) Values(" +
            transaction_id +
            "," +
            vendor_accession_no +
            "," +
            message_control_id +
            "," +
            lab_result_send_datetime +
            "," +
            vendor_order_referenceno +
            "," +
            patid +
            "," +
            vendor_onfile_pat_lastname +
            "," +
            vendor_onfile_pat_firstname +
            "," +
            vendor_onfile_pat_dob +
            "," +
            vendor_onfile_pat_sex +
            "," +
            vendor_onfile_pat_ssn +
            ")"
        )
        .then(recordSet => {
          console.log("recordSet", recordSet)
          dbConn.close()
        })
        .catch(err => {
          console.log(err)
          dbConn.close()
        })
    })
    .catch(err => {
      console.log(err)
    })

  // xrxQuestResultObservationResult fields
  obx.forEach(result => {
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
  })
}
