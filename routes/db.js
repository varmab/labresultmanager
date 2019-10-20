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

console.log("db config", config)

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

const createQuestResultTransaction =  (hl7Obj) => {
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
  } = pid;

  lab_result_send_datetime=lab_result_send_datetime?formatDate(lab_result_send_datetime):null;
  vendor_onfile_pat_dob=vendor_onfile_pat_dob?formatDate(vendor_onfile_pat_dob):null;

  return new Promise(async (resolve, reject) => {
    try {
      var recNo=generateUUID();
      let qry=`insert into dbo.xrxQuestResultTransaction (TransactionId, VendorAccessionNo, MessageControlId, LabResultSendDateTime, VendorOrderReferenceNo, PatId, VendorOnFilePatLastName, VendorOnFilePatFirstName, VendorOnFilePatDOB, VendorOnFilePatSex, VendorOnFilePatSSN) 
      Values('${recNo}', 
              '${vendor_accession_no}', 
              '${message_control_id}', 
              '${lab_result_send_datetime}', 
              '${vendor_order_referenceno}', 
              '${patid}', 
              '${vendor_onfile_pat_lastname}', 
              '${vendor_onfile_pat_firstname}', 
             '${vendor_onfile_pat_dob}', 
              '${vendor_onfile_pat_sex}', 
              '${vendor_onfile_pat_ssn}')`;
      console.log(qry);
      let result = await sql.query(qry)
      console.log('result', result)
      resolve(recNo, true)
    } catch (err) {
      reject('Error: ' + err, false)
    } 
  })
}

const createQuestResultObservationResults = (hl7Result,hl7ResultIndex,transctionId) => {
  return new Promise(async (resolve, reject) => {
      try {
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
        } = hl7Result;
        var qry=`insert into xrxQuestResultObservationResult  (TransactionId,RequestItemId,LabResultValueType, LabResultAnalyteNumber, LabResultAnalyteName, LabResultMeasureUnits, LabResultNormalRange, LabResultNormalcyStatus, LabResultStatus, LabResultDateTime, LabResultFillerId) 
        Values('${transctionId}',
              1,
              '${labresult_valuetype}', 
              '${labresult_analyte_number}', 
              '${labresult_analyte_name}', 
              '${labresult_measure_units}', 
              '${labresult_normal_range}', 
              '${labresult_normalcy_status}', 
              '${labresult_status}', 
              '${labresult_datetime}', 
              '${labresult_fillerId}')`;
        console.log(qry);
        let result = await sql.query(qry);

        console.log('result', result)
        resolve(null, true)
      } catch (err) {
        reject('Error: ' + err, false)
      }
    })
}

exports.saveToDB= (hl7Obj)=>{
  return new Promise(async (result,reject)=>{
    await sql.close();
    await sql.connect(conn);
    createQuestResultTransaction(hl7Obj)
    .then(async (transactionId)=>{
      let { obx } = hl7Obj;
      obx.reduce((accumulatedPromise,nextResult,nextResultIndex)=>{
          return createQuestResultObservationResults(nextResult,nextResultIndex,transactionId);
      },Promise.resolve());
      //await sql.close();
    })
    .catch(async (err)=>{
      //await sql.close();
      console.log('failed ' + JSON.stringify(err))
    })
  })
}
