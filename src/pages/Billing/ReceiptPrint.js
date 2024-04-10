import React, { Component } from 'react';

class ReceiptPrint extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      fromDate: '',
      toDate: '',
      response: '',
      post: '',
      responseToPost: '',
      IsBalanceUpdate: true,
      Isprint: true,
      arr: [],
      serviceDetails: [],
      balance: 0,
      responseToPostHeader: '',
      responseToPostFooter: '',
    }
  }
  componentDidMount() {
    console.log(JSON.parse(sessionStorage.getItem('serviceDetails')));
    this.setState({ serviceDetails: JSON.parse(sessionStorage.getItem('serviceDetails')) });
    this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
    this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
    this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
    this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
    this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
    this.setState({ patientId: JSON.parse(sessionStorage.getItem('patient_id')) });
    this.setState({ receiptId: JSON.parse(sessionStorage.getItem('receipt_id')) });
    this.handlePatient(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')), JSON.parse(sessionStorage.getItem('patient_id')));
    this.handleReport(JSON.parse(sessionStorage.getItem('receipt_id')), JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
    this.handleBilling(JSON.parse(sessionStorage.getItem('receipt_id')), JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
    this.handleOnLoad(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
  }
  handleOnLoad = async (customerID, userToken) => {
    try {
      const requestHeader = {
        "content-Type": "application/json"
      };
      const response = await fetch('https://api.preprod.gynesono.com/getcustomerimages', {
        method: 'POST',
        headers: requestHeader,
        body: JSON.stringify({
          customerID: customerID,
          accessIDKey: userToken
        }),
      });
      const body = await response.json();
      this.setState({
        responseToPostHeader: body[0].Header,
        responseToPostFooter: body[1].Footer
      });
    }
    catch (error) {
      this.setState({ unAuthorized: true });
    }
  }
  handlePatient = async (customerId, token, patientId) => {
    const requestHeader = {
      "content-Type": "application/json"
    };
    const response = await fetch('https://api.preprod.patient.gynesono.com/getpatientdetailsbyid', {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        customerID: customerId,
        accessIDKey: token,
        patientID: patientId
      }),
    });
    const body = await response.json();
    console.log(body);
    this.setState({
      ptFirstName: body.Items[0].patient_details.patient_first_name,
      ptLastName: body.Items[0].patient_details.patient_last_name,
      ptContactNo: body.Items[0].patient_details.patient_contact_no,
      ptGender: body.Items[0].patient_details.patient_gender,
      ptAge: body.Items[0].patient_details.patient_age
    });
  }

  handleBilling = async (receiptId, customerId, userToken) => {
    console.log(receiptId, customerId, userToken);
    try {
      const requestHeader = {
        "content-Type": "application/json"
      };
      const response = await fetch('https://api.preprod.accounting.gynesono.com/getallbillingservicesbyreceipt', {
        method: 'POST',
        headers: requestHeader,
        body: JSON.stringify({
          customerID: customerId,
          receiptID: receiptId,
          accessIDKey: userToken
        }),
      });
      const body = await response.json();
      console.log(body);
      this.setState({
        serviceDetails: body.Items
      });
    }
    catch (error) {
      this.setState({ unAuthorized: true });
    }
  }
  handleReport = async (receiptId, customerId, userToken) => {
    console.log(receiptId, customerId, userToken);
    try {
      const requestHeader = {
        "content-Type": "application/json"
      };
      const response = await fetch('https://api.preprod.accounting.gynesono.com/getpatientreceipts', {
        method: 'POST',
        headers: requestHeader,
        body: JSON.stringify({
          customerID: customerId,
          receiptID: receiptId,
          accessIDKey: userToken
        }),
      });
      const body = await response.json();
      console.log(body);
      this.setState({
        receiptID: body.Items[0].receipt_id,
        firstName: body.Items[0].patient_first_name,
        lastName: body.Items[0].patient_last_name,
        netAmount: body.Items[0].total_net_amount,
        balance: body.Items[0].balance,
        paidAmount: body.Items[0].paid_amount,
        patientID: body.Items[0].patient_id,
        totalDiscount: body.Items[0].total_discount,
        grossAmount: body.Items[0].total_gross_amount,
        billDate: body.Items[0].receipt_date,
        paymentMode: body.Items[0].payment_mode,
        discount: body.Items[0].total_discount,
        referDoctorName: body.Items[0].referDoctorName
      });
    }
    catch (error) {
      this.setState({ unAuthorized: true });
    }
  }

  render() {
    return (
      <div style={{ width: "100%", marginTop: "0%", fontSize: "16px" }}>
        <div className="h-10 d-inline-block" style={{ width: "100%" }}>
          <div className='row' >
            <div className='col'>
              <img src={this.state.responseToPostHeader} width="900px" height="90px" ></img>
            </div>
          </div>
        </div>
        <div className="h-10 d-inline-block" style={{ width: "100%" }}>
          <div className='row'>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}><b>Patient Name</b></label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}> : {this.state.ptFirstName} {this.state.ptLastName} ({this.state.ptAge}y, F)</label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}><b>Bill Date</b></label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}> : {this.state.billDate}</label>
            </div>
          </div>
          <div className='row'>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}><b>Mobile Number</b></label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}> : {this.state.ptContactNo}</label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}><b>Bill Number</b></label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}> : #{this.state.receiptId}</label>
            </div>
          </div>
          <div className='row'>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}><b>Refer By</b></label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}> : {this.state.referDoctorName}</label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}><b>Bill Status</b></label>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}> : PAID</label>
            </div>
          </div>
        </div>
        <p style={{ borderBottom: "1px solid black" }}></p>
        <div className="h-10 d-inline-block" style={{ width: "100%" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#F5F5F5" }}>
                <th className="ant-table-cell" style={{ fontSize: "12px" }}>#</th>
                <th className="ant-table-cell" style={{ fontSize: "12px" }}>Service Category</th>
                <th className="ant-table-cell" style={{ fontSize: "12px" }}>Service Name</th>
                <th className="ant-table-cell" style={{ fontSize: "12px" }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {JSON.parse(sessionStorage.getItem('serviceDetails')).map((item, sno = 0) => (
                <tr>
                  <td className="ant-table-cell" style={{ fontSize: "12px" }}>{sno + 1}</td>
                  <td className="ant-table-cell" style={{ fontSize: "12px" }}>{item.name.split(":")[0]}</td>
                  <td className="ant-table-cell" style={{ fontSize: "12px" }}>{item.name.split(":")[1]}</td>
                  <td className="ant-table-cell" style={{ fontSize: "12px" }}>{item.name.split(":")[2]}</td>

                </tr>
              ))}
            </tbody>

          </table>
          <p style={{ borderBottom: "1px solid black" }}></p>
          <div className='row'>
            <div className='col-5'>
              <label style={{ fontSize: "12px" }}>Payment Mode : {this.state.paymentMode}</label>
            </div>
            <div className='col-2'>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}>Billed Amount : </label>
            </div>
            <div className='col-1'>
              <label style={{ fontSize: "12px" }}>{this.state.grossAmount}</label>
            </div>
          </div>
          {this.state.discount !== 0 && <><div className='row'>
            <div className='col-3'>
            </div>
            <div className='col-4'>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}>Discount : </label>
            </div>
            <div className='col-1'>
              <label style={{ fontSize: "12px" }}>{this.state.totalDiscount}</label>
            </div>
          </div></>}

          <div className='row'>
            <div className='col-3'>
            </div>
            <div className='col-4'>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}>Received Amount : </label>
            </div>
            <div className='col-1'>
              <label style={{ fontSize: "12px" }}>{this.state.paidAmount}</label>
            </div>
          </div>
          <div className='row'>
            <div className='col-3'>
            </div>
            <div className='col-4'>
            </div>
            <div className='col-3'>
              <label style={{ fontSize: "12px" }}>Balance Amount : </label>
            </div>
            <div className='col-1'>
              <label style={{ fontSize: "12px" }}>{this.state.netAmount - this.state.paidAmount}</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ReceiptPrint;









