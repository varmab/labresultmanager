namespace Calmed{
    enum SearchResultOption { PatientId=1, PatientFirstName, PatientLastName, PatientDOB, DoctorId, DoctorLastName }
    
    class LabResultManager
    {
        companyRecNo:number=0;
        facilityId:string="";
        _responseMessage:string="";
        _errorMessage:string="";
        _retrieveFinalsOnly:boolean=false;
        _providerAccountsToRetrieve:Array<string>=[];
        _fclId:string="";
        _userName:string="";
         _password:string=""; 
         _sendingApplication=""; 
        _companyRecNo:number=0;
        _printableWebService:any = null;
        _start:any=undefined;
        _end:any=undefined;
        _lastVendorProviderName:string="";

        constructor(companyRecNo:number, facilityId:string){
            this.companyRecNo=companyRecNo;
            this.facilityId=facilityId;
        }

        get ResponseMessage(){ return this._responseMessage; };
        
        get ErrorMessage(){ return this._errorMessage; };
        
        get RetrieveFinalResultsOnly(){ return this._retrieveFinalsOnly; }
        set RetrieveFinalResultsOnly(value){ this._retrieveFinalsOnly = value; }
        
        get ProviderAccountsToRetrieve():Array<string>{ return this._providerAccountsToRetrieve; }
        
        get FclId(){ return this._fclId};
        set FclId(value) { this._fclId=value; }
        
        GetProviderAccounts(){
            
        }

        RetrieveResults(){

        }

        RetrieveResultsSinceLastDownload(){

        }

        RetrieveNewResults(){

        }

        GetResultTransactions(){

        }

        ExtractTempPrintableReport(){

        }

        RetrieveLatestResult(){

        }

        SearchResultTransactions(){

        }

        GetOpenResultTransactions(){

        }

        MarkResultAsReviewed(){

        }

        MatchLabResultWithPatient(){

        }

        MatchLabResultWithDoctor(){

        }

        CreateAndAssociatePatientRecordFromLabResult(){

        }

        GetPatientLabTestTransactions(){

        }

        GetLabTestResult(){

        }

        LabResultReportStatus(){

        }

        InitializeLocalParams(){

        }
        
        LoadQuestWSInfoFromCurrentFacility(){

        }

        CreateLabResultWebServiceClient(){

        }

        CreatePrintableWebServiceClient(){

        }

        CreateLabResultServiceRequest(){

        }

        CreatePrintableServiceRequest(){

        }

        ParseResponse(){

        }

        ProcessResult(){

        }

        UpdateOrderTransactionOnResultReceived(){

        }

        LookupOrderTransaction(){

        }

        LookupOrderPatient(){

        }

        LookupUnAssignedPatient(){

        }

        GenerateHL7AckMessages(){

        }

        GenerateHL7AckMessage(){

        }

        GetVendorProviderByProviderName(){

        }

        GetVendorProviderByAccountName(){

        }

        UpdateProviderAccount(){

        }

        ParsePrintableResponse(){

        }

        RetrievePrintableResults(fromDate:any,toDate:any):any{

        }

        NewTransactionId(){
            
        }
    }
}