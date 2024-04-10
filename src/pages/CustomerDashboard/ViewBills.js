import React, { Component } from 'react';
import ViewBillsPrint from './ViewBillsPrint';
import CustomerBalanceUpdate from '.././Billing/CustomerBalanceUpdate';
import DeleteBillModal from './DeleteBillModal';
class ViewBills extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      rows: [],
      selectService: [],
      responseToPost: [],
      responseArr: [],
      serviceCategory: '',
      serviceName: '',
      printbtn: false,
      customerBalanceUpdate: false,
      discount: 0,
      balance: 0,
      paidAmount: 0,
      patientId: 0,
      paymentMode: "",
      receiptId: 0,
      referDoctorName: "",
      discount: 0,
      grossAmount: 0,
      netAmount: 0,
      deleteBill: false
    };
  };
  componentDidMount() {
    this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
    this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
    this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
    this.setState({ userRole: "Owner"});
    // this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
    this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
    this.handleBills(JSON.parse(sessionStorage.getItem('token')), JSON.parse(sessionStorage.getItem('customerID')));
  };
  handleBills = async (userToken, customerID) => {
    const requestHeader = {
      "content-Type": "application/json"
    };
    const requestOption = {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        customerID: customerID,
        patientID: this.props.patientId,
        accessIDKey: userToken
      })
    }
    const response = await fetch('https://api.preprod.accounting.gynesono.com/getallreceiptsbypatient', requestOption)
    const body = await response.json();
    this.setState({ responseArr: body.Items });
  };
  handlePrint = async (item) => {
    const requestHeader = {
      "content-Type": "application/json"
    };
    const requestOption = {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        customerID: this.state.customerId,
        receiptID: item.receipt_id,
        accessIDKey: this.state.token
      })
    }
    const response = await fetch('https://api.preprod.accounting.gynesono.com/getallbillingservicesbyreceipt', requestOption)
    const body = await response.json();
    sessionStorage.setItem('patient_id', item.patient_id);
    sessionStorage.setItem('receipt_id', item.receipt_id);
    sessionStorage.setItem('serviceDetails', []);
    if (body.length > 0) {
      sessionStorage.setItem('serviceDetails', item.service_details);
    }
    this.setState({
      printbtn: true
    });
  }
  handleSubmit = (item) => {
    this.setState({
      ptFirstName: item.patient_first_name,
      ptLastName: item.patient_last_name,
      balance: item.balance,
      paidAmount: item.paid_amount,
      patientId: item.patient_id,
      paymentMode: item.payment_mode,
      receiptId: item.receipt_id,
      referDoctorName: item.referDoctorName,
      discount: item.total_discount,
      grossAmount: item.total_gross_amount,
      netAmount: item.total_net_amount,
      customerBalanceUpdate: true
    });
  }
  handleDeleteReceipt = (items) => {
    this.setState({receiptID: items.receipt_id,
                  deleteBill: true})
  }
  render() {
    if (this.state.printbtn) {
      return (<ViewBillsPrint patientId={this.state.patientId} />)
    }
    else if (this.state.customerBalanceUpdate) {
      return (<CustomerBalanceUpdate ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} balance={this.state.balance} paidAmount={this.state.paidAmount} patientId={this.state.patientId} paymentMode={this.state.paymentMode}
        receiptId={this.state.receiptId} referDoctorName={this.state.referDoctorName} discount={this.state.discount} grossAmount={this.state.grossAmount} netAmount={this.state.netAmount}
      />)
    }
    else if(this.state?.receiptID){
      return(<DeleteBillModal receiptID= {this.state.receiptID}></DeleteBillModal>)
    }
    else {
      return (
        <div>
          <div >
            <div ><h4 className="page-title" style={{ fontSize: "20px", marginBottom: '20px' }}>View Bills</h4></div>
          </div>
          <div className="col-md-12 column">
            <table className="table table-bordered" id="tab_logic" style={{ overflow: 'hidden' }}>
              <thead>
                <tr >
                  <th className="ant-table-cell">Receipt ID</th>
                  <th className="ant-table-cell">Bill Amount</th>
                  <th className="ant-table-cell">Paid Amount</th>
                  <th className="ant-table-cell">Balance</th>
                  <th className="ant-table-cell">Payment Mode</th>
                  <th className="ant-table-cell">Date of Bill</th>
                  <th className="ant-table-cell">Remaining Pay</th>
                  <th className="ant-table-cell">#</th>
                </tr>
              </thead>
              {this.state.responseArr.map((item) => (
                <tbody>
                  <tr>
                    <td className="ant-table-cell">{item.receipt_id}</td>
                    <td className="ant-table-cell">{item.total_net_amount}</td>
                    <td className="ant-table-cell">{item.paid_amount}</td>
                    <td className="ant-table-cell">{item.balance}</td>
                    <td className="ant-table-cell">{item.payment_mode}</td>
                    <td className="ant-table-cell">{item.receipt_date}</td>
                    <td className="ant-table-cell">{item.balance != 0 && <button style={{ border: '0.5px solid black', borderRadius: '4px' }} onClick={() => this.handleSubmit(item)}><i class="fa fa-plus" aria-hidden="true" style={{ color: "red" }}></i></button>}&nbsp;</td>
                    <td className="ant-table-cell">
                      <button style={{ border: '0.5px solid black', borderRadius: '4px' }} onClick={() => this.handlePrint(item)}><i class="fa fa-print" aria-hidden="true"></i></button> &nbsp;
                      <button data-testid="delete-button" style={{ border: '0.5px solid black', borderRadius: '4px' }} disabled={!this.props.ptEmail}><i class="fa fa-envelope" aria-hidden="true" ></i></button>&nbsp;&nbsp;
                      {this.state.userRole === "Owner" && (<button style={{ border: '0.5px solid black', borderRadius: '4px' }} onClick={() => this.handleDeleteReceipt(item)}>
                        <i class="fa fa-trash" style={{ color: 'red', fontSize: "20px" }} aria-hidden="true"></i></button>)}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      );
    }
  }
}
export default ViewBills; 
