var sql = require("mssql")
var moment = require('moment-timezone');

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

var conn=`Server=${config.server},1433;Database=${config.options.database};User Id=${config.user};Password=${config.password};Encrypt=true`

const formatDate=(date)=>{
  const d = new Date(parseInt(date));
  const modi =  d.toISOString();
  return moment.utc(modi).format('MM/DD/YY hh:mm a');
}

var generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

const createTransaction = async(hl7Obj) =>{
  let { orc, msh, pid, obx } = hl7Obj
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
    return new Promise(async (resolve, reject) => {
      try {
        var recNo = await generateUUID()
        logger.log({ level: "info", message: "genereated recoNo", recNo })
        var connection = await new sql.ConnectionPool(conn)
        await connection.close()
        await connection.connect(async function(err) {
          if (err) {
            logger.log({ level: "error", message: "Error connecting to DB", err })
          } else {
            logger.log({ level: "info", message: "Connected to DB" })
            var req = await new sql.Request(connection)
            let tableName = "xrxQuestResultTransaction"
            let qry = `insert into ${tableName} (TransactionId, VendorAccessionNo, MessageControlId, LabResultSendDateTime, VendorOrderReferenceNo, PatId, VendorOnFilePatLastName, VendorOnFilePatFirstName, VendorOnFilePatDOB, VendorOnFilePatSex, VendorOnFilePatSSN) Values('${recNo}', 
                            '${vendor_accession_no}', 
                            '${message_control_id}', 
                            '${lab_result_send_datetime}', 
                            '${vendor_order_referenceno}', 
                            '${patid}', 
                            '${vendor_onfile_pat_lastname}', 
                            '${vendor_onfile_pat_firstname}', 
                            '${vendor_onfile_pat_dob}', 
                            '${vendor_onfile_pat_sex}', 
                            '${vendor_onfile_pat_ssn}')`
            logger.log({ level: "info", message: "query: ", qry })
            const data = await req.query(qry, async function(err, result) {
              if (err) {
                await connection.close()
                logger.log({ level: "error", message: err })
              } else {
                await connection.close()
                logger.log({ level: "info", message: "Creted transaction", result })
                resolve(recNo, obx)
              }
            })
          }
        })
      }
      catch (err) {
        let errorMessage = "Failed creating transaction" + JSON.stringify(err);
        logger.log({ level:"error",message:errorMessage})
        let error=new Error(errorMessage)
        reject(error, false)
      }
  })
}

const createObrResult = async(recNo, obx) => {
  logger.log({ level: "info", message: "obx array", obx })
  logger.log({
    level: "info",
    message: "Creating result for transaction with id: ",
    recNo
  })
  if (obx.length > 0) {
    await Promise.all(
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
                  Values('${recNo}',
                        1,
                        '${labresult_valuetype}', 
                        '${labresult_analyte_number}', 
                        '${labresult_analyte_name}', 
                        '${labresult_measure_units}', 
                        '${labresult_normal_range}', 
                        '${labresult_normalcy_status}', 
                        '${labresult_status}', 
                        '${labresult_datetime}', 
                        '${labresult_fillerId}')`
            logger.log({
              level: "info",
              message: "Query for result creating:",
              qry
            })
            const data = await req.query(qry, async function(err, result) {
              if (err) {
                logger.log({ level: "error", message: err })
              } else {
                logger.log({ level: "info", message: "Result saved"})
                resolve(true)
              }
            })
          }
        })
      })
    )
  } else {
    logger.log({ level: "info", message: "obx array not coming" })
  }
}

exports.saveToDB= (hl7Obj)=>{
  return new Promise(async (result,reject)=>{
    createTransaction(hl7Obj)
    .then(async (transactionId)=>{
      let { obx } = hl7Obj;
      createObrResult(transactionId, obx).then(()=>{
        console.log('completed wohoooooo')
      })
    })
    .catch(async (err)=>{
      console.log('failed ' + JSON.stringify(err))
    })
  })
}
