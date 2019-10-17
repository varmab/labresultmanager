class xrxQuestResultTransaction {
  rawMessage: any
  TransactionId: string = ""
  VendorAccessionNo: number = null
  MessageControlId: string = ""
  RetrievedDateTime: string = ""
  LabResultSendDateTime: string = ""
  VendorProviderId: string = ""
  VendorLabResultCode: string = ""
  VendorOrderReferenceNo: number = null
  RawData: string = ""
  PatId: string = ""
  DctId: string = ""
  VendorOnFilePatLastName: string = ""
  VendorOnFilePatFirstName: string = ""
  VendorOnFilePatDOB: string = ""
  VendorOnFilePatSex
  VendorOnFilePatSSN
  VendorOnFileDctLastName: string = ""
  VendorOnFileDctFirstName: string = ""
  VendorOnFileDctLicenseNo: string = ""
  OrderStatus: string = ""
  NotesComments
  PrintableReport
  ReviewedDateTime
  OrderTransactionId: string = ""
  VendorOnFilePatMiddleName: string = ""
  VendorOnFilePatSuffix: string = ""
  VendorOnFilePatPrefix: string = ""
  VendorOnFilePatRace: string = ""
  VendorOnFilePatRaceAlt: string = ""
  VendorPatIdNamespace: string = ""
  VendorPatIdTypeCode
  IsCcdaSent

  constructor(rawMessage: any) {
    this.rawMessage = rawMessage
  }

  get transactionId() {
    return "TransactionId"
  }
  set transactionId(value: string) {
    this.transactionId = value
  }

  get vendorAccessionNo() {
    return 123
  }
  set vendorAccessionNo(value: number) {
    this.VendorAccessionNo = value
  }

  get messageControlId() {
    return "MessageControlId"
  }
  set messageControlId(value: string) {
    this.MessageControlId = value
  }

  get retrievedDateTime() {
    return
  }
  set retrievedDateTime(value: Date) {
    this.RetrievedDateTime = value
  }
  get labResultSendDateTime() {
    return "LabResultSendDateTime"
  }
  get vendorProviderId() {
    return "VendorProviderId"
  }
  get vendorLabResultCode() {
    return "VendorLabResultCode"
  }
  get vendorOrderReferenceNo() {
    return "VendorOrderReferenceNo"
  }
  get rawData() {
    return "RawData"
  }
  get patId() {
    return "PatId"
  }
  get dctId() {
    return "DctId"
  }
  get vendorOnFilePatLastName() {
    return "VendorOnFilePatLastName"
  }
  get vendorOnFilePatFirstName() {
    return "VendorOnFilePatFirstName"
  }
  get vendorOnFileDctLicenseNo() {
    return "VendorOnFileDctLicenseNo"
  }
  get orderStatus() {
    return "OrderStatus"
  }
  get notesComments() {
    return "NotesComments"
  }
  get printableReport() {
    return "PrintableReport"
  }
  get reviewedDateTime() {
    return "ReviewedDateTime"
  }
  get orderTransactionId() {
    return "OrderTransactionId"
  }
  get vendorOnFilePatMiddleName() {
    return "VendorOnFilePatMiddleName"
  }
  get vendorOnFilePatSuffix() {
    return "VendorOnFilePatSuffix"
  }
  get vendorOnFilePatPrefix() {
    return "VendorOnFilePatPrefix"
  }
  get vendorOnFilePatRace() {
    return "VendorOnFilePatRace"
  }
  get vendorOnFilePatRaceAlt() {
    return "VendorOnFilePatRaceAlt"
  }
  get vendorPatIdNamespace() {
    return "VendorPatIdNamespace"
  }
  get vendorPatIdTypeCode() {
    return "VendorPatIdTypeCode"
  }
  get isCcdaSent() {
    return "IsCcdaSent"
  }
}
