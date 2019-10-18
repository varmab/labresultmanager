const parser = require("@rimiti/hl7-object-parser")
const s12Mapping = require("./s12.json")

exports.fetchValues = rawMessage => {
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

  const OrderTransactionId = ""
  const PrintableReport = ""
  const VendorProviderId = ""
  const VendorLabResultCode = ""
  const VendorOnFilePatMiddleName = ""
  const VendorOnFilePatSuffix = ""
  const VendorOnFilePatPrefix = ""
  const VendorOnFilePatRace = ""
  const VendorOnFilePatRaceAlt = ""
  const VendorPatIdNamespace = ""
  const VendorPatIdTypeCode = ""
  const IsCcdaSent = ""

  // xrxQuestResultObservationResult fields
  obj.obx.forEach(result => {
    const LabResultValueType = result.labresult_valuetype
    console.log("TCL: LabResultValueType", LabResultValueType)
    const LabResultAnalyteNumber = result.labresult_analyte_number
    const LabResultAnalyteName = result.labresult_analyte_name
    const LabResultMeasureUnits = result.labresult_measure_units
    const LabResultNormalRange = result.labresult_normal_range
    const LabResultNormalcyStatus = result.labresult_normalcy_status
    const LabResultStatus = result.labresult_status
    const LabResultDateTime = result.labresult_datetime
    const LabResultFillerId = result.labresult_fillerId

    const LabResultValue = ""
    const LabResultSummary = ""
    const TransactionId = ""
    const RequestItemId = ""
    const ResultItemId = ""
    const LabResultFacilityName = ""
    const LabResultFacilityId = ""
    const LabResultFacilityTypeCode = ""
    const LabResultFacilityAddr1 = ""
    const LabResultFacilityAddr2 = ""
    const LabResultFacilityCity = ""
    const LabResultFacilityState = ""
    const LabResultFacilityZip = ""
    const LabResultFacilityCountry = ""
    const LabResultPerformerId = ""
    const LabResultPerformerLastName = ""
    const LabResultPerformerFirstname = ""
    const LabResultPerformerMiddleName = ""
    const LabResultPerformerSuffix = ""
    const LabResultPerformerPrefix = ""
    const ValueSetId = ""
    const ResultRecNo = ""
  })
}
