import React, { Component } from 'react';
import AddReport from './AddReport';
class LabReports extends Component {
  state = {
    rCategory: '',
    reportName: [],
    labReports: false,
    responseToPost: '',
    open: true,
    isBlank: false,
    unAuthorized: false,
    ptFirstName: this.props.ptFirstName,
    ptLastName: this.props.ptLastName,
    patientId: this.props.patientId,
    ptContactNo: this.props.ptContactNo,
    visitId: this.props.visitId,
    referDoctorName: this.props.referDoctorName,
    ptAge: this.props.ptAge,
    ptGender: this.props.ptGender
  }
  componentDidMount() {
    this.setState({token : JSON.parse(sessionStorage.getItem('token'))});  
    this.setState({customerId : JSON.parse(sessionStorage.getItem('customerID'))});  
    this.setState({userName : JSON.parse(sessionStorage.getItem('userName'))}); 
    this.setState({userRole : JSON.parse(sessionStorage.getItem('userRole'))}); 
    this.setState({customerName : JSON.parse(sessionStorage.getItem('customerName'))});
    this.handleOnload(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
  }
  handleOnload = async (customerID, userToken) => {
    try {
      const requestHeader = {
        "content-Type": "application/json"
      };
      const response = await fetch('https://api.preprod.reports.dcsono.com/getallbloodreportcategory', {
        method: 'POST',
        headers: requestHeader,
        body: JSON.stringify({
          customerID: customerID,
          accessIDKey: userToken
        }),
      });
      const body = await response.json();
      this.setState({ responseToPost: body.Items });
    }
    catch (error) {
      this.setState({ unAuthorized: true });
    }
  }
  handleSubmit = (items) => {
    this.setState({ open: !this.state.open })
    this.setState({ reportCategory: items.report_category });
    this.setState({ reportName: items.report_name });
    this.setState({ calibrationType: items.calibration_type });
  }
  render() {
    if (!this.state.open) {
      return (<AddReport reportCategory={this.state.reportCategory} reportName={this.state.reportName} calibrationType={this.state.calibrationType} patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName}  ptContactNo={this.state.ptContactNo} visitId={this.state.visitId} ptEmail={this.state.ptEmail} referDoctorName={this.state.referDoctorName} ptAge={this.state.ptAge} ptGender={this.state.ptGender}/>)
    }
    else {
      return (
        <div className="main-wrapper">
          <div className="page-wrapper">
            <div className="content">
              <div className="row">
                <div className="col-sm-4 col-3">
                  <h4 className="page-title">Lab Reports</h4>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-border table-striped custom-table">
                  <thead>
                    <tr>
                      <th>S. No.</th>
                      <th>Report Category</th>
                      <th>Report Name</th>
                      <th>Calibration Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {this.state.responseToPost.length > 0 && (
                    <tbody>
                      {this.state.responseToPost.map((items, sno) => (
                        <tr key={sno + 1}>
                          <td>{sno + 1}</td>
                          <td>{items.report_category}</td>
                          <td>{items.report_name}</td>
                          <td>{items.calibration_type}</td>
                          <td>
                            <button onClick={() => this.handleSubmit(items)}>Add Reports</button>
                          </td>
                        </tr>
                      ))}</tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
          <div className="sidebar-overlay" data-reff=""></div>
        </div>
      );
    }
  }
}
export default LabReports;


