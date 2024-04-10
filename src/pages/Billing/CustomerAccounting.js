import React, { Component } from 'react';
import ConfirmPaymentModal from './ConfirmPaymentModal';

class CustomerAccounting extends Component {
  state = {
    open: true,
    rows: [],
    selectService: [],
    responseToPost: [],
    responseArr: [],
    serviceCategory: '',
    serviceName: '',
    totalPrice: 0,
    discount: 0,
    totalAmount: 0,
    totalNetAmount: 0,
    totalGrossAmount: 0,
    postArr: [],
    userRole: "RECEPTIONIST",
    doctorName: [],
    serviceName: [],
    referDoctorName: "",
    serviceDetails: [],
    patientId: this.props.patientId,
    ptFirstName: this.props.ptFirstName,
    ptLastName: this.props.ptLastName,
    appointmentId: this.props.appointmentId
  };

  componentDidMount() {
    this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
    this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
    this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
    this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
    this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
    this.handleDate();
    this.setState({
      referDoctorName: this.props.referDoctorName,
      remarks: this.props.remarks
    });
    this.handleDoctorName(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
    var sum = 0;
    this.props.serviceDetails.forEach(value => {
      sum = sum + parseInt(value.name.split(":")[2]);
      this.setState({
        totalAmount: sum,
        totalGrossAmount: sum,
        totalNetAmount: sum
      });
    });
  };

  handleDate = () => {
    let billDate = new Date();
    let d = billDate.getDate();
    if (d >= 1 && d <= 9) { d = "0" + d; }
    let m = billDate.getMonth() + 1;
    if (m >= 1 && m <= 9) { m = "0" + m }
    billDate = billDate.getFullYear() + "-" + m + "-" + d;
    this.setState({ billDate: billDate });
  }

  handleDoctorName = async (customerID, userToken) => {
    const requestHeader = {
      "content-Type": "application/json"
    };
    const response = await fetch('https://api.preprod.customer.gynesono.com/getallcustomerlocaldata', {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        customerID: customerID,
        accessIDKey: userToken
      }),
    });
    const body = JSON.parse(await response.text());
    this.setState({ doctorName: body.Items });
  }

  handleCost = () => {
    var cost = this.state.serviceCost - this.state.discount;
    this.setState({ cost: cost });
  };

  handleConfirm() {
    this.setState({ open: false })
  };

  handleDiscount = (e, discount, ind) => {
    if (discount === NaN) {
      discount = 0
    }
    this.state.rows[ind].discount = parseInt(discount)
    this.setState({ rows: this.state.rows });
    let dis = 0;
    this.state.rows.map((item, ind) => {
      dis += item.discount
    })
    this.setState({ discount: dis })
  }

  handleAddRow = () => {
    const item = {
      serviceCategory: "",
      serviceNames: [],
      serviceCost: 0,
      discount: 0,
      price: 0
    };
    this.setState({ rows: [...this.state.rows, item] });
  };

  handleRemoveRow = () => {
    this.setState({ rows: this.state.rows.slice(0, -1) });
  };

  handleServiceCategory = async () => {
    const requestHeader = {
      "content-Type": "application/json"
    };
    const response = await fetch('https://api.preprod.customer.gynesono.com/getbillingmasterdatascategory', {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify({
        customerID: this.state.customerId,
        serviceCategory: this.state.sCategory,
        accessIDKey: this.state.token
      }),
    });
    const body = await response.json();
    this.setState({
      serviceName: body.Items
    });
  }
  handleAddService = (serviceData) => {
    const newId = this.state.serviceDetails.length + 1;
    this.setState(prevState => ({
      serviceDetails: [
        ...prevState.serviceDetails,
        { name: serviceData + ":", id: newId }
      ],
      totalAmount: prevState.totalAmount + parseInt(serviceData.split(":")[2]),
      totalGrossAmount: prevState.totalGrossAmount + parseInt(serviceData.split(":")[2]),
      totalNetAmount: prevState.totalNetAmount + parseInt(serviceData.split(":")[2]),
      sCategory: "",
      serviceName: [],
      serviceCost: 0,
    }));
  }

  onSelectService = (selectedItem) => {
    this.setState({
      serviceCost: selectedItem.split(":")[2]
    })
  }

  handleDeleteFun = (serviceCategory, serviceName, serviceCost, item) => {
    var i = this.state.serviceDetails.length;
    const filtered = this.state.serviceDetails.filter(obj => {
      return obj !== item;
    });
    this.setState({
      serviceDetails: filtered,
      totalAmount: this.state.totalAmount - parseInt(item.name.split(":")[2]),
      totalNetAmount: this.state.totalNetAmount - parseInt(item.name.split(":")[2]),
      totalGrossAmount: this.state.totalGrossAmount - parseInt(item.name.split(":")[2])
    });
  }

  render() {
    if (!this.state.open) {
      return (
        <ConfirmPaymentModal
          totalAmount={this.state.totalAmount - this.state.discount}
          totalNetAmount={this.state.totalNetAmount - this.state.discount}
          totalGrossAmount={this.state.totalGrossAmount}
          discount={this.state.discount}
          serviceDetails={this.state.serviceDetails}
          ptFirstName={this.props.ptFirstName}
          ptLastName={this.props.ptLastName}
          patientId={this.state.patientId}
          billDate={this.state.billDate}
          referDoctorName={this.state.referDoctorName}
          appointmentId={this.state.appointmentId}
        />
      );
    }

    else {
      return (
        <div>
          <div >
            <div className="row offset-lg-1"><h4 className="page-title" style={{ fontSize: "30px", marginBottom: '30px' }}></h4></div>
            <div className="row offset-lg-1">
              <div className="col-sm-2">
                <label>Select Doctor</label>
              </div>
              <div className="col-sm-4">
                <input className='form-control' type="text" list="productName" value={this.state.referDoctorName} onChange={(e) => this.setState({ referDoctorName: e.target.value })} />
                <datalist id="productName">
                  <option>{this.state.referDoctorName}</option>
                  <option>select</option>
                  <option>SELF</option>
                  {
                    this.state.doctorName.map((item) => (
                      <option value={item.customer_refer_name}>{item.customer_refer_name}</option>
                    ))
                  }
                </datalist>
              </div>
              <div className="col-sm-1">
                <label>Date</label>
              </div>
              <div className="col-sm-2">
                <input type="date" id="myDate" className="form-control" name="date" pattern="\d{4}-\d{2}-\d{2}" value={this.state.billDate} onChange={e => this.setState({ billDate: e.target.value })} required />
              </div>
            </div>
          </div><br />
          <div className="row" style={{ marginTop: '40px', position: 'absolute', marginLeft: '75%', zIndex: '99' }}>
            <div className="col-sm-6 " style={{ marginTop: '4px' }} >
              <label>Total Amount: </label>
            </div>
            <div className="col-sm-4 offset-lg-1" style={{ marginLeft: '-10%' }}>
              <input type="text" className="form-control" name="totalAmount" value={this.state.totalAmount - this.state.discount} onChange={e => this.setState({ totalAmount: e.target.value })} />
            </div>
            <div className="col-sm-6 " style={{ marginTop: '4px' }} >
              <label>Discount: </label>
            </div>
            <div className="col-sm-4 offset-lg-1" style={{ marginLeft: '-10%' }}>
              <input type="text" className="form-control" name="discount" value={this.state.discount} onChange={e => this.setState({ discount: e.target.value })} />
            </div>
            <div className="col-sm-6 offset-lg-3" style={{ marginTop: '25px' }}>
              <button type="submit" onClick={() => this.handleConfirm()} className="btn submit-btn" style={{ backgroundColor: "#24498a", color: "white" }}>Pay</button>
            </div>
          </div>

          <div className="container" style={{ width: "70%", marginLeft: '3%', marginBottom: '20px', borderRadius: '12px' }}>
            <div className="row clearfix">
              <div className="col-md-12 column">
                <table className="table table-bordered" id="tab_logic">
                  <thead>
                    <tr >
                      <th className="ant-table-cell">S. No</th>
                      <th className="ant-table-cell">Service Category</th>
                      <th className="ant-table-cell">Service Name</th>
                      <th className="ant-table-cell">Price</th>
                      <th className="ant-table-cell-end">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.serviceDetails && this.state.serviceDetails.map((item, idx) => (
                      <tr key={idx}>
                        <td className="ant-table-cell">
                          {idx + 1}
                        </td>
                        <td className="ant-table-cell">
                          {item.name.split(":")[0]}
                        </td>
                        <td className="ant-table-cell">
                          {item.name.split(":")[1]}
                        </td>
                        <td className="ant-table-cell">
                          <span style={{ color: 'green' }}>
                            {item.name.split(":")[2]}
                          </span>
                        </td>
                        <td className="ant-table-cell">
                          <i className="fa fa-trash-o" style={{ fontSize: "25px", color: "red", cursor: "pointer" }} onClick={(e) => this.handleDeleteFun(item.name.split(":")[0], item.name.split(":")[1], item.name.split(":")[2], item)}></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="table" style={{ border: "1px solid" }} id="tab_logic">
                  <thead>
                    <tr className="ant-table-cell">
                      <th className="ant-table-cell">S. No</th>
                      <th className="ant-table-cell">Service Category</th>
                      <th className="ant-table-cell">Service Name</th>
                      <th className="ant-table-cell">Price</th>
                      <th className="ant-table-cell-end">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="ant-table-cell">
                      <td className="ant-table-cell">{this.state.serviceDetails.length + 1}</td>
                      <td className="ant-table-cell">
                        <select className="form-control" aria-label="Default select example" value={this.state.sCategory} onChange={(e) => this.setState({ sCategory: e.target.value }, this.handleServiceCategory)} required>
                          <option>Select Category</option>
                          <option value="Blood Test">Blood Test</option>
                          <option value="USG">USG</option>
                          <option value="xray">X-ray</option>
                          <option value="OPD">OPD</option>
                          <option value="MRI">MRI</option>
                          <option value="CTSCAN">CTSCAN</option>
                          <option value="First Visit">First Visit</option>
                          <option value="Second Visit">Second Visit</option>
                        </select>
                      </td>
                      <td className="ant-table-cell">
                        <select className="form-control" aria-label="Default select example" value={this.state.selectServiceName} onChange={(e) => this.setState({ selectServiceName: e.target.value }, this.onSelectService(this.state.sCategory + " : " + e.target.value))} required>
                          <option>Select</option>
                          {this.state.serviceName.map((item, index) => (
                            <option key={index} value={item.serviceName + " : " + item.serviceCost}>{item.serviceName}</option>
                          ))}
                        </select>
                      </td>
                      <td className="ant-table-cell">{this.state.serviceCost}</td>
                      <td className="ant-table-cell"><i className="fa fa-check" style={{ fontSize: "25px", color: "green", cursor: "pointer" }} onClick={(e) => this.handleAddService(this.state.sCategory + " : " + this.state.selectServiceName)}></i></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default CustomerAccounting;
