class xrxQuestResultObservationResult {
  rawData: any
  TransactionId: string = ""
  RequestItemId: string = ""
  ResultItemId: string = ""
  LabResultValueType: string = ""
  LabResultAnalyteNumber
  LabResultAnalyteName: string = ""
  LabResultValue: string = ""
  LabResultSummary: string = ""
  LabResultMeasureUnits
  LabResultNormalRange
  LabResultNormalcyStatus: string = ""
  LabResultStatus: string = ""
  LabResultDateTime: string = ""
  LabResultFillerId: string = ""
  LabResultFacilityName: string = ""
  LabResultFacilityId: string = ""
  LabResultFacilityTypeCode: string = ""
  LabResultFacilityAddr1: string = ""
  LabResultFacilityAddr2: string = ""
  LabResultFacilityCity: string = ""
  LabResultFacilityState: string = ""
  LabResultFacilityZip: string = ""
  LabResultFacilityCountry: string = ""
  LabResultPerformerId: string = ""
  LabResultPerformerLastName: string = ""
  LabResultPerformerFirstname: string = ""
  LabResultPerformerMiddleName: string = ""
  LabResultPerformerSuffix: string = ""
  LabResultPerformerPrefix: string = ""
  ValueSetId: string = ""
  ResultRecNo

  constructor(rawData: any) {
    this.rawData = rawData
  }

  get transactionId() {
    return "TransactionId"
  }
  get requestItemId() {
    return "RequestItemId"
  }
  get resultItemId() {
    return "ResultItemId"
  }
  get labResultValueType() {
    return "LabResultValueType"
  }
  get labResultAnalyteNumber() {
    return "LabResultAnalyteNumber"
  }
  get labResultAnalyteName() {
    return "LabResultAnalyteName"
  }
  get labResultValue() {
    return "LabResultValue"
  }
  get labResultSummary() {
    return "LabResultSummary"
  }
  get labResultMeasureUnits() {
    return "LabResultMeasureUnits"
  }
  get labResultNormalRange() {
    return "LabResultNormalRange"
  }
  get labResultNormalcyStatus() {
    return "LabResultNormalcyStatus"
  }
  get labResultStatus() {
    return "LabResultStatus"
  }
  get labResultDateTime() {
    return "LabResultDateTime"
  }
  get labResultFillerId() {
    return "LabResultFillerId"
  }
  get labResultFacilityName() {
    return "LabResultFacilityName"
  }
  get labResultFacilityId() {
    return "LabResultFacilityId"
  }
  get labResultFacilityTypeCode() {
    return "LabResultFacilityTypeCode"
  }
  get labResultFacilityAddr1() {
    return "LabResultFacilityAddr1"
  }
  get labResultFacilityAddr2() {
    return "LabResultFacilityAddr2"
  }
  get labResultFacilityCity() {
    return "LabResultFacilityCity"
  }
  get labResultFacilityState() {
    return "LabResultFacilityState"
  }
  get labResultFacilityZip() {
    return "LabResultFacilityZip"
  }
  get labResultFacilityCountry() {
    return "LabResultFacilityCountry"
  }
  get labResultPerformerId() {
    return "LabResultPerformerId"
  }
  get labResultPerformerLastName() {
    return "LabResultPerformerLastName"
  }
  get labResultPerformerFirstName() {
    return "LabResultPerformerFirstName"
  }
  get labResultPerformerMiddleName() {
    return "LabResultPerformerMiddleName"
  }
  get labResultPerformerSuffix() {
    return "LabResultPerformerSuffix"
  }
  get labResultPerformerPrefix() {
    return "LabResultPerformerPrefix"
  }
  get valueSetId() {
    return "ValueSetId"
  }
  get resultRecNo() {
    return "ResultRecNo"
  }
}
