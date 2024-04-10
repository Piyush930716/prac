import React, { Component } from 'react';
import AddAppointment from './AddAppointment';
import UpdateCustomer from './UpdateCustomer';
import ViewBills from './ViewBills';
import CustomerAccounting from '../Billing/CustomerAccounting';
// import ViewReport from '../LabReports/ReportView';
import LabReports from '../LabReports/LabReports';
import ReportSearch from '../LabReports/ReportSearch';
class CustomerDashboardForAppointment extends Component {
    state = {
        regitercustomer: false,
        show: false,
        openAcc: false,
        openAppt: true,
        openReg: false,
        openBill: false,
        openReport: false,
        viewReport: false,
        ptFirstName: this.props.ptFirstName,
        ptLastName: this.props.ptLastName,
        ptContactNo: this.props.ptContactNo,
        ptAge: this.props.ptAge,
        ptGender: this.props.ptGender,
        ptEmail: this.props.ptEmail,
        patientId: this.props.patientId,
        patientSalutation: this.props.patientSalutation,
        patientState: this.props.patientState,
        patientMaritalStatus: this.props.patientMaritalStatus,
        patientHusbandName: this.props.patientHusbandName,
        patientAddress: this.props.patientAddress,
        ptCity: this.props.ptCity,
        apptHour: "00",
        apptMin: "00",
        referDoctorName: this.props.referDoctorName,
        remarks: this.props.remarks,
        serviceDetails: this.props.serviceDetails,
        appointmentId: this.props.appointmentId,
        visitId: 0,
    };
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        if (this.props.apptHour == "") {
            this.setState({
                apptHour: "",
                apptMin: ""
            });
        }
        if (this.props.apptHour != "") {
            this.setState({
                apptHour: this.props.apptHour,
                apptMin: this.props.apptMin,
            })
        }
    }
    handleRegisterCustomer = () => {
        this.setState({
            openAppt: false,
            openAcc: false,
            openBill: false,
            openReg: !this.state.openReg
        });
    }
    handlChangeAcc = () => {
        this.setState({
            openAppt: false,
            openReg: false,
            openBill: false,
            openAcc: !this.state.openAcc,
        });
    }
    handleBillDetails = () => {
        this.setState({
            openAppt: false,
            openReg: false,
            openAcc: false,
            openBill: !this.state.openBill,
        });
    }
    handleAddReport = () => {
        this.setState({
            openAppt: false,
            openAcc: false,
            openReg: false,
            openBill: false,
            openReport: !this.state.openReport,
        });
    }
    handleViewReport = () => {
        this.setState({
            openBill: false,
            openAcc: false,
            openReg: false,
            openAppt: false,
            viewReport: !this.state.openReport
        })
    }
    handlChangeAppt = () => {
        this.setState({
            openBill: false,
            openAcc: false,
            openReg: false,
            openAppt: !this.state.openAppt
        });
    }
    render() {
        return (
            <>
                <div className='container_main' style={{ margin: "auto", width: "90%" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <nav className="navbar navbar-expand-xl navbar-light" style={{ width: "100%", backgroundColor: "#00339A", borderRadius: "7px" }}>
                                <div className="container-fluid" >
                                    <div style={{ width: "35%", float: "right" }}>
                                        <label style={{ fontSize: "14px", color: "white" }}><b><i className="fa fa-user-circle-o" style={{ color: "white", fontSize: "18px" }}></i>{ }&nbsp;{"CUST-" + this.props.patientId + " "}{this.props.ptFirstName} {this.props.ptLastName}{"(" + this.state.ptAge + "y,"} {this.state.ptGender + ")"} </b></label>
                                        <br /><b><label style={{ fontSize: "14px", color: "white" }}>{this.state.ptContactNo + " " + this.state.ptEmail}</label></b>
                                    </div>
                                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                        <span className="navbar-toggler-icon"></span>
                                    </button>
                                    <div className="collapse navbar-collapse" id="navbarSupportedContent"  >
                                        <ul className="nav justify-content-end navbar-nav me-auto mb-2 mb-lg-2" style={{ backgroundColor: "00339A" }}>
                                            <li className="nav-item">
                                                <center><button onClick={() => this.handlChangeAppt()} className="btn btn-primary" aria-current="page" style={{ backgroundColor: 'transparent', border: 'none', color: "white" }}><i className="fa fa-calendar" style={{ fontSize: "30px" }} aria-hidden="true"></i><p>Appt.</p></button></center>
                                            </li>
                                            <li className="nav-item">
                                                <center><button onClick={() => this.handlChangeAcc()} className="btn btn-primary" aria-current="page" style={{ backgroundColor: 'transparent', border: 'none', color: "white" }}><i className="fa fa-money" style={{ fontSize: "30px" }} aria-hidden="true"></i><p>Add Bills</p></button></center>
                                            </li>
                                            <li className="nav-item">
                                                <center><button onClick={() => this.handleBillDetails()} className="btn btn-primary" aria-current="page" style={{ backgroundColor: 'transparent', border: 'none', color: "white" }} ><i className="fa fa-id-card-o" style={{ fontSize: "30px" }} aria-hidden="true"></i><p>Bills</p></button></center>
                                            </li>
                                            <li className="nav-item">
                                                <center><button onClick={() => this.handleAddReport()} className="btn btn-primary" aria-current="page" style={{ backgroundColor: 'transparent', border: 'none', color: "white" }}><i className="fa fa-plus" style={{ fontSize: "30px" }} aria-hidden="true"></i><p>Add Reports</p></button></center>
                                            </li>
                                            <li className="nav-item">
                                                <center><button onClick={() => this.handleViewReport()} className="btn btn-primary" aria-current="page" style={{ backgroundColor: 'transparent', border: 'none', color: "white" }}><i className="fa fa-eye" style={{ fontSize: "30px" }} aria-hidden="true"></i><p>View Reports</p></button></center>
                                            </li>
                                            <li className="nav-item">
                                                <center><button onClick={() => this.handleRegisterCustomer()} className="btn btn-primary" aria-current="page" style={{ backgroundColor: 'transparent', border: 'none', color: "white" }}><i className="fa fa-edit" style={{ fontSize: "30px" }} aria-hidden="true"></i><p>Edit</p></button></center>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => window.location.reload(true)}></button>
                        </div>
                        <div className="modal-body">
                            {(() => {
                                if (this.state.openAppt) {
                                    return (
                                        <AddAppointment patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptAge={this.state.ptAge} ptGender={this.state.ptGender} ptContactNo={this.state.ptContactNo} ptEmail={this.state.ptEmail} apptHour={this.state.apptHour}
                                            apptMin={this.state.apptMin} referDoctorName={this.state.referDoctorName} remarks={this.state.remarks} serviceDetails={this.props.serviceDetails} />
                                    )
                                } else if (this.state.openAcc) {
                                    return (
                                        <CustomerAccounting patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptGender={this.state.ptGender} ptContactNo={this.state.ptContactNo} ptEmail={this.state.ptEmail} referDoctorName={this.state.referDoctorName} remarks={this.state.remarks} serviceDetails={this.props.serviceDetails} appointmentId={this.state.appointmentId} />
                                    )
                                } else if (this.state.openReg) {
                                    return (
                                        <UpdateCustomer patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptAge={this.state.ptAge} ptGender={this.state.ptGender} ptContactNo={this.state.ptContactNo} ptEmail={this.state.ptEmail} referDoctorName={this.state.referDoctorName} remarks={this.state.remarks} ptSalutation={this.state.patientSalutation} ptHusbandName={this.state.patientHusbandName} ptCity={this.state.ptCity} patientState={this.props.patientState} patientAddress={this.state.patientAddress} ptMaritalStatus={this.state.patientMaritalStatus} />
                                    )
                                } else if (this.state.openBill) {
                                    return (
                                        <ViewBills patientId={this.state.patientId} ptEmail={this.state.ptEmail} />
                                    )
                                }
                                else if (this.state.openReport) {
                                    return (
                                        <LabReports patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptAge={this.state.ptAge} ptGender={this.state.ptGender} ptContactNo={this.state.ptContactNo} visitId={this.state.visitId} ptEmail={this.state.ptEmail} referDoctorName={this.state.referDoctorName} />
                                    )
                                }
                                else if (this.state.viewReport) {
                                    return (
                                        <ReportSearch patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptAge={this.state.ptAge} ptGender={this.state.ptGender} ptContactNo={this.state.ptContactNo} visitId={this.state.visitId} ptEmail={this.state.ptEmail} referDoctorName={this.state.referDoctorName} />
                                    )
                                }
                                else {
                                    return (
                                        <AddAppointment />
                                    )
                                }
                            })()}
                        </div>
                        <div className="modal-footer" >
                            <div>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => window.location.reload(true)}>Close</button>
                            </div>
                            <div style={{ backgroundColor: "#00339A", width: '100% ', color: "#fff", borderRadius: '25px', padding: '1px' }}><div style={{ marginLeft: '78%', }}> Refer By : {this.state.referDoctorName}<br /></div></div>
                        </div>
                    </div>
                </div>
                <div className='row' style={{ height: "500px" }}>

                </div>
            </>
        );
    }
}
export default CustomerDashboardForAppointment;



