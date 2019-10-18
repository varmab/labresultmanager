const fs = require("fs")
const Reader = require("hl7js").Reader
const reader = new Reader("BASIC")
const parser = require("@rimiti/hl7-object-parser")
const s12Mapping = require("./s12.json")

exports.parseHl7Files = () => {
  const filesFolder = __basedir + "/files/"
  fs.readdir(filesFolder, (err, files) => {
    files.forEach(file => {
      const hl7_file_path = filesFolder + "/" + file
      fs.readFile(hl7_file_path, function(err, buffer) {
        reader.read(buffer.toString(), function(err, hl7Data) {
          if (err) {
            console.log("err@@", err)
          } else {
            fetchValues(hl7Data.segments[0].rawData)
          }
        })
      })
    })
  })
}

function fetchValues(rawMessage) {
  const obj = parser.decode(rawMessage, s12Mapping)
  // xrxQuestResultTransaction fields
  const TransactionId = obj.orc.transaction_id
  const VendorAccessionNo = obj.orc.vendor_accession_no
  const MessageControlId = obj.msh.message_control_id
  const LabResultSendDateTime = obj.msh.lab_result_send_datetime
  const VendorOrderReferenceNo = obj.pid.vendor_order_referenceno
  const PatId = obj.pid.patid
  const VendorOnFilePatLastName = obj.pid.vendor_onfile_pat_lastname
  const VendorOnFilePatFirstName = obj.pid.vendor_onfile_pat_firstname
  const VendorOnFilePatDOB = obj.pid.vendor_onfile_pat_dob
  const VendorOnFilePatSex = obj.pid.vendor_onfile_pat_sex
  const VendorOnFilePatSSN = obj.pid.vendor_onfile_pat_ssn
  const RetrievedDateTime = new Date()
  const ReviewedDateTime = new Date()

  // xrxQuestResultObservationResult fields
  obj.obx.forEach(result => {
    const LabResultValueType = result.labresult_valuetype
    const LabResultAnalyteNumber = result.labresult_analyte_number
    const LabResultAnalyteName = result.labresult_analyte_name
    const LabResultMeasureUnits = result.labresult_measure_units
    const LabResultNormalRange = result.labresult_normal_range
    const LabResultNormalcyStatus = result.labresult_normalcy_status
    const LabResultStatus = result.labresult_status
    const LabResultDateTime = result.labresult_datetime
    const LabResultFillerId = result.labresult_fillerId
  })
}
