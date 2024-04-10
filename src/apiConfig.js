const API_CONFIG = {
    // Dashboard file api
    LOGIN_URL: 'https://api.preprod.gynesono.com/getlogin',
    GET_ALL_APPOINTMENT_BY_NAME_URL: 'https://api.preprod.appointment.gynesono.com/getallappointmentsbyname',
    GET_REGISTERED_APPOINTMENTS_FOR_DASH_URL: 'https://api.preprod.appointment.gynesono.com/getregisteredappointmentsfordash',
    GET_PATIENT_DETAILS_BY_ID_URL: 'https://api.preprod.patient.daffodilshospitals.com/getpatientdetailsbyid',
    SET_APPOINTMENT_STATUS_URL: 'https://api.preprod.appointment.gynesono.com/setappointmentstatus',
    // header file api
    GET_PATIENTS_BY_NAME_URL: 'https://api.preprod.patient.gynesono.com/getpatientsbyname',
    GET_PATIENT_DETAILS_BY_ID_URL: 'https://api.preprod.patient.gynesono.com/getpatientdetailsbyid',
    //Add Customer file api
    GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
    POST_PATIENT_URL: 'https://api.preprod.patient.gynesono.com/postpatient',
    // Delete appointment modal file api
    DELETE_APPOINTMENT_BY_ID_URL: 'https://api.preprod.appointment.gynesono.com/deleteappointmentbyid',
    //UPDATE APPOINTMENT FILE API
    SET_APPOINTMENT_URL: 'https://api.preprod.appointment.gynesono.com/setappointment',
    GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
    GET_BILLING_MASTER_DATAS_CATEGORY_URL: 'https://api.preprod.customer.gynesono.com/getbillingmasterdatascategory',
    //Confirm payment modal file API
    POST_CUSTOMER_ACCOUNTING_URL: 'https://api.preprod.accounting.gynesono.com/postcustomeraccounting',
    SET_APPOINTMENT_STATUS_URL:'https://api.preprod.appointment.gynesono.com/setappointmentstatus',
    POST_PATIENT_RECEIPT_URL: 'https://api.preprod.accounting.gynesono.com/postpatientreceipts',
    //Customer Accounting FILE APT
    GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
    GET_BILLING_MASTER_DATAS_CATEGORY_URL: 'https://api.preprod.customer.gynesono.com/getbillingmasterdatascategory',
//Customer balance update FILE API
    GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
    POST_PATIENT_RECEIPTS_URL: 'https://api.preprod.accounting.gynesono.com/postpatientreceipts',

    //RECEIPT PRINT FILE API
    GET_CUSTOMER_IMAGES_URL: 'https://api.preprod.gynesono.com/getcustomerimages',
    GET_PATIENT_DETAILS_BY_ID_URL:'https://api.preprod.patient.gynesono.com/getpatientdetailsbyid',
    GET_ALL_BILLING_SERVICES_BY_RECEIPT_URL:'https://api.preprod.accounting.gynesono.com/getallbillingservicesbyreceipt',
    GET_PATIENT_RECEIPTS_URL: 'https://api.preprod.accounting.gynesono.com/getpatientreceipts',

// ADD APPOINTMENT FILE API
POST_APPOINTMENT_URL: 'https://api.preprod.appointment.gynesono.com/postappointment',
GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
GET_BILLING_MASTER_DATAS_CATEGORY_URL: 'https://api.preprod.customer.gynesono.com/getbillingmasterdatascategory',
//DELETE BILL MODAL FILE API
DELETE_RECEIPT_BY_ID_URL: 'https://api.preprod.accounting.gynesono.com/deleteReceiptByID',
//UPDATE CUSTOMER FILE API
GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
SET_PATIENT_URL: 'https://api.preprod.patient.gynesono.com/setpatient',

//VIEW BILLS FILE API
GET_ALL_RECEIPTS_BY_PATIRNT_URL: 'https://api.preprod.accounting.gynesono.com/getallreceiptsbypatient',
GET_ALL_BILLING_SERVICES_BY_RECEIPT_URL: 'https://api.preprod.accounting.gynesono.com/getallbillingservicesbyreceipt',

//DAILY PAYMENT REPORT FILE API
GET_PAYMENT_HISTORY_BY_DATE_URL: 'https://xl73257esa.execute-api.us-east-1.amazonaws.com/preprod/getpaymenthistorybydate',

//DETAILED BILL REPORT FILE API
GET_DETAIL_PAYMENT_HISTORY_BY_DATE: 'https://api.preprod.services.gynesono.com/getdetailpaymenthistorybydate',
GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
GET_COMMISION_CALCULATION_BY_DOCTOR_URL: 'https://xl73257esa.execute-api.us-east-1.amazonaws.com/preprod/getcommisioncalculationsbydoctor',

//DETAIL PAYMENT HISTORY FILE API
GET_PAYMENT_HISTORY_BY_DATE_URL: 'https://api.preprod.services.gynesono.com/getpaymenthistorybydate',

//SUMMARY PAYMENT HISTORY FILE API
GET_PAYMENT_HISTORY_BY_DATE: 'https://xl73257esa.execute-api.us-east-1.amazonaws.com/preprod/getpaymenthistorybydate',

//ADD REPORT FILE API
GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.reports.dcsono.com/getcaliberation',
POST_LAB_REPORT_URL: 'https://api.preprod.reports.dcsono.com/postlabreport',

//LAB REPORTS FILE API
GET_ALL_BLOOD_REPORT_CATEGORY: 'https://api.preprod.reports.dcsono.com/getallbloodreportcategory',

//REPORT DELETE FILE API
DELETE_BLOOD_REPORT_BY_ID_URL: 'https://api.preprod.reports.dcsono.com/deletebloodreportbyid',

//REPORT SEARCH FILE API
GET_ALL_BLOOD_REPORTS_BY_PATIENT_ID_URL: 'https://api.preprod.reports.dcsono.com/getallbloodreportsbypatientid',

//REPORT UPDATE FILE API
GET_LAB_REPORT_BY_ID_URL: 'https://api.preprod.reports.dcsono.com/getlabreportbyid',
SET_LAB_REPORT_URL: 'https://api.preprod.reports.dcsono.com/setlabreport',

//ADD CUSTOMER IMAGES FILE API
GET_CUSTOMER_IMAGES: 'https://api.preprod.gynesono.com/getcustomerimages',
POST_CUSTOMER_IMAGES: 'https://api.preprod.gynesono.com/postcustomerimages',

//ADD DOCTOR FILE API
POST_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/postcustomerlocaldata',
GET_DETAILS_BY_LAB_URL: 'https://api.preprod.customer.gynesono.com/getdetailsbylab',
GET_ALL_CUSTOMER_LOCAL_DATA_URL: 'https://api.preprod.customer.gynesono.com/getallcustomerlocaldata',
GET_CUSTOMER_LOCAL_DATA_BY_ID: 'https://api.preprod.customer.gynesono.com/getcustomerlocaldatabyid',

//ADD SERVICES FILE API
GET_SERVICES_MASTER_DATA_URL: 'https://api.preprod.services.gynesono.com/getservicesmasterdata',
GET_SERVICES_MASTER_DATA_URL: 'https://api.preprod.services.gynesono.com/getservicesmasterdata',
GET_SERVICES_MASTER_DATA_BY_ID_URL: 'https://api.preprod.services.gynesono.com/getservicemasterdatabyid',
DELETE_SERVICE_BY_ID_URL:'https://api.preprod.services.gynesono.com/deleteservicebyid',
POST_SERVICE_MASTER_DATA_URL: 'https://api.preprod.services.gynesono.com/postservicemasterdata',

//DELECT DOCTOR FILE API
DELETE_CUSTOMER_LOCAL_DATA_BY_ID_URL:'https://api.preprod.customer.gynesono.com/deletecustomerlocaldatabyid',
DELETE_SERVICE_BY_ID_URL: 'https://api.preprod.services.gynesono.com/deleteservicebyid',

};

export default API_CONFIG;  