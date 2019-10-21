const fs = require("fs")
const Client = require("ssh2-sftp-client")
const sftp = new Client()
const Reader = require("hl7js").Reader
const reader = new Reader("BASIC")
const parser = require("@rimiti/hl7-object-parser")
const s12Mapping = require("./routes/s12.json")
var sql = require("mssql")
var moment = require('moment-timezone');
global.__basedir = __dirname
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

async function LabResultManager() {
    await sftp.connect({
      host: process.env.AEGIS_HOST,
      port: process.env.AEGIS_PORT,
      username: process.env.AEGIS_USERNAME,
      password: process.env.AEGIS_PASSWORD
    }).then(async () => {
        try {
            var files = await sftp.list(process.env.AEGIS_REMOTE_PATH);
            downloadFiles(files)
        } catch(err) {
            console.log('Error downloading sftp files', err);
        }
    })
    .catch(err => {
        console.log('error with connecting SFTP', err);
        return
    })
}

async function downloadFiles (files) {
    var localFiles=[]
    await Promise.all(files.map(async (file) => {
        const remoteFilename = await process.env.AEGIS_REMOTE_PATH + file.name
        const localFilename = await __basedir + "/files/" + file.name
        localFiles.push(localFilename);
        await sftp.get(remoteFilename, localFilename)
        fetchFiles(localFiles)
    }));
}

async function fetchFiles (dFiles) {
    await Promise.all(dFiles.map(async (file) => {
        console.log('single file', file)
        await fs.readFile(file, async (err, buffer) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return
            }
            try {
                await reader.read(buffer.toString(), async (err, hl7Data) => {
                    if (err) {
                        console.log("Error reading file from disk:", err);
                        return
                    }
                    try {
                        parseFiles(hl7Data)
                    } catch(err) {
                        console.log('Error parsing', err);
                    }
                });
            } catch(err) {
                console.log('Error', err);
            }
        });
    }));
}

async function parseFiles (hl7Data) {
    try{
        var hl7Obj= await parser.decode(hl7Data.segments[0].rawData, s12Mapping);
        createTransaction(hl7Obj)
    } catch(err) {
        console.log('error', err)
    }
}

async function createTransaction(hl7Obj) {
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
    var recNo= await generateUUID();
    console.log('recNo', recNo)
    var connection = await new sql.ConnectionPool(conn);
    await connection.close();
    await connection.connect(async function (err) {
        if (err) {
            console.log(err);
        } else {
            var req = await new sql.Request(connection);
            let tableName = 'xrxQuestResultTransaction'
            let qry=`insert into ${tableName} (TransactionId, VendorAccessionNo, MessageControlId, LabResultSendDateTime, VendorOrderReferenceNo, PatId, VendorOnFilePatLastName, VendorOnFilePatFirstName, VendorOnFilePatDOB, VendorOnFilePatSex, VendorOnFilePatSSN) 
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
            const data = await req.query(qry, async function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    createObrResult(recNo, obx)
                }
            });
        }
    });
}

async function createObrResult (recNo, obx) {
    await Promise.all(obx.map(async (result) => {
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
        } = result;
        var connection = await new sql.ConnectionPool(conn);
        await connection.close();
        await connection.connect(async function (err) {
            if (err) {
                console.log(err);
            } else {
                var req = await new sql.Request(connection);
                var qry=`insert into xrxQuestResultObservationResult  (TransactionId,RequestItemId,LabResultValueType, LabResultAnalyteNumber, LabResultAnalyteName, LabResultMeasureUnits, LabResultNormalRange, LabResultNormalcyStatus, LabResultStatus, LabResultDateTime, LabResultFillerId) 
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
                        '${labresult_fillerId}')`;
                const data = await req.query(qry, async function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('final', data)
                    }
                });
            }
        });
    }));
}

LabResultManager()