class QuestResultObservationResult {
  rawData: any = ""
  TransactionId: string = ""
  RequestItemId: string = ""
  ResultItemId: string = ""
  LabResultValueType: string = ""
  LabResultAnalyteNumber: any
  LabResultAnalyteName: string = ""
  LabResultValue: string = ""
  LabResultSummary: string = ""
  LabResultMeasureUnits: any = ""
  LabResultNormalRange: any = ""
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
  ResultRecNo: any = "";

  constructor(rawData: any) {
    this.rawData = rawData
  }
}
