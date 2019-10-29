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

const formatDateForFetch=(date)=>{
  const d = new Date(parseInt(date));
  const modi =  d.toISOString();
  return moment.utc(modi).format('YYYY-MM-DD');
}

const fetchPatId = async(hl7Obj) =>{
  let { pid } = hl7Obj
  let {
    patid,
    vendor_onfile_pat_lastname,
    vendor_onfile_pat_firstname,
    vendor_onfile_pat_dob,
    vendor_onfile_pat_sex,
  } = pid

  vendor_onfile_pat_dob = vendor_onfile_pat_dob
    ? formatDateForFetch(vendor_onfile_pat_dob)
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
                logger.log({level:"info", message:result})
                let PatId = result.recordset[0] ? result.recordset[0].PatId : "NOTFOUND"
                await connection.close()
                logger.log({ level: "info", message: "patId", PatId })
                resolve(PatId)
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

var generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

const createTransaction = async(hl7Obj, PatId) =>{
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
                            '${PatId}', 
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
                logger.log({ level: "info", message: "Transaction created" })
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

exports.saveToDB= (hl7Obj)=>{
  return new Promise(async (resolve,reject)=>{
    fetchPatId(hl7Obj)
    .then(async(PatId)=>{
      createTransaction(hl7Obj, PatId)
      .then(async (recNo)=>{
        let { obx } = hl7Obj;
        let len = obx.length;
        obx.map(async(result)=>{
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
              const data = await req.query(qry, async function(err, result) {
                if (err) {
                  await connection.close()
                  logger.log({ level: "error", message: err })
                } else {
                  len--;
                  logger.log({level:"info", message:"length OBX:", len})
                  await connection.close()
                  logger.log({ level: "info", message: "Result Created", result })
                  if(len == 0) {
                    resolve('Success, results added')
                  }
                }
              })
            }
          })
        })
      })
      .catch(async (err)=>{
        console.log('failed ' + JSON.stringify(err))
      })
    })
    .catch(async (err)=>{
      console.log('failed on fetching patId ' + JSON.stringify(err))
    })
  })
}
