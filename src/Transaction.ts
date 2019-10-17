class xrxQuestResultTransaction {
  rawMessage: any
  TransactionId: string = ""
  VendorAccessionNo: number | undefined
  MessageControlId: string = ""
  RetrievedDateTime: string = ""
  LabResultSendDateTime: string = ""
  VendorProviderId: string = ""
  VendorLabResultCode: string = ""
  VendorOrderReferenceNo: number | undefined
  RawData: string = ""
  PatId: string = ""
  DctId: string = ""
  VendorOnFilePatLastName: string = ""
  VendorOnFilePatFirstName: string = ""
  VendorOnFilePatDOB: string = ""
  VendorOnFilePatSex: any
  VendorOnFilePatSSN: any
  VendorOnFileDctLastName: string = ""
  VendorOnFileDctFirstName: string = ""
  VendorOnFileDctLicenseNo: string = ""
  OrderStatus: string = ""
  NotesComments: any
  PrintableReport: any
  ReviewedDateTime: any
  OrderTransactionId: string = ""
  VendorOnFilePatMiddleName: string = ""
  VendorOnFilePatSuffix: string = ""
  VendorOnFilePatPrefix: string = ""
  VendorOnFilePatRace: string = ""
  VendorOnFilePatRaceAlt: string = ""
  VendorPatIdNamespace: string = ""
  VendorPatIdTypeCode: any
  IsCcdaSent: any

  constructor(rawMessage: any) {
    this.rawMessage = rawMessage
  }
}
