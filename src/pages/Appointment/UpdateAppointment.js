import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";

class UpdateAppointment extends Component {
    state = {
        responseMessage: this.props.responseMessage,
        appointmentId: this.props.appointmentId,
        ptFirstName: this.props.ptFirstName,
        ptContactNo: this.props.ptContactNo,
        patientId: this.props.patientId,
        serviceDetails: this.props.serviceDetails,
        apptHour: this.props.apptHour,
        apptMin: this.props.apptMin,
        referDoctorName: this.props.referDoctorName,
        remarks: this.props.remarks,
        userRole: "RECEPTIONIST",
        NoOfVisits: 0,
        serviceName: [],
        doctorName: [],
        i: 1,
        serviceCost: 0,
        totalServiceCost: 0,
    };
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        this.handleDoctorName(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
        this.handleDate();
    }
    handleDate = () => {
        let dt = new Date();
        let d = dt.getDate();
        if (d >= 1 && d <= 9) { d = "0" + d; }
        let m = dt.getMonth() + 1;
        if (m >= 1 && m <= 9) { m = "0" + m }
        dt = dt.getFullYear() + "-" + m + "-" + d;
        this.setState({ dt: dt });
    }
    handleApptSubmit = async () => {
        var d_arr = this.state.dt.split("-");
        var newdate = d_arr[2] + '/' + d_arr[1] + '/' + d_arr[0];
        const requestHeader = {
            "content-Type": "application/json",
        };
        const requestOptions = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                appointmentID: this.state.appointmentId,
                patientFirstName: this.state.ptFirstName.split(" ")[0],
                patientLastName: this.state.ptFirstName.split(" ")[1],
                patientMobileNumber: this.state.ptContactNo,
                customerID: this.state.customerId,
                referDoctorName: this.state.referDoctorName,
                appointmentDate: newdate,
                appointmentTime: this.state.apptHour + ":" + this.state.apptMin,
                appointmentRemarks: this.state.serviceDetails,
                serviceDetails: this.state.serviceDetails,
                accessIDKey: this.state.token
            }),
        }
        const response = await fetch('https://api.preprod.appointment.gynesono.com/setappointment', requestOptions)
        const body = await response.text();
        this.setState({ responseMessage: body });
        this.setState({ apptHour: "00" });
        this.setState({ apptMin: "00" });
        this.setState({ ptAppointmentRemarks: "" });
        this.setState({ dt: "" });
    };
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
    onSelectComplaints = (selectedList, selectedItem) => {
        this.setState({
            serviceDetails: [...this.state.serviceDetails, { name: selectedItem, id: this.state.i }],
            i: this.state.i + 1
        });
    }
    onRemoveComplaints = (selectedList, removedItem) => {
        const filtered = this.state.serviceDetails.filter(obj => {
            return obj !== removedItem;
        });
        this.setState({
            serviceDetails: filtered,
            totalServiceCost: parseInt(this.state.totalServiceCost) - parseInt(removedItem.name.split(":")[2]),
        });
    }
    clear = () => {
        this.setState({
            ptAppointmentRemarks: "",
            apptHour: "",
            apptMin: "",
            dt: ""
        });
    }
    render() {
        return (
            <><br /><br />
                <div className='container'>
                    <div className="modal-content">
                        <div className="modal-header">
                            <nav className="navbar navbar-expand-lg navbar-light" style={{ width: "100%", backgroundColor: "#24498a", borderRadius: "7px" }}>
                                <div className="container-fluid" >
                                    <p style={{ fontSize: "12px", color: "white", display: "inline" }}><a to="" className="navbar-brand"><i className="fa fa-user-circle-o" style={{ color: "white", fontSize: "16px" }}>{ }&nbsp;{"CUST-" + this.props.patientId + " "}{this.props.ptFirstName}
                                        <br /><br />
                                    </i> </a>
                                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                            <span className="navbar-toggler-icon"></span>
                                        </button></p>
                                </div>
                            </nav>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => window.location.reload(true)}></button>
                        </div>
                        <div className="modal-body">

                            <div>
                                <div className="row">
                                    <div className="col-lg-8 offset-lg-2"><h4 className="page-title">Update Appointment</h4></div>
                                </div>
                                <p style={{ color: '#24498a', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.responseMessage}</p>
                                <div className="col-lg-8 offset-lg-2">
                                    <div className="mb-2 row">
                                        <div className="mb-2 row ">
                                            <div className="col-sm-2">
                                                <label htmlFor="hour" className="col-form-label">Select Time</label>
                                            </div>
                                            <div className="col-sm-2">
                                                <select className="form-control" id='hour' value={this.props.apptHour} onChange={e => this.setState({ apptHour: e.target.value })} >
                                                    <option value={this.props.apptHour}>{this.props.apptHour}</option>
                                                    <option value='00'>00</option>
                                                    <option value='01'>01</option>
                                                    <option value='02'>02</option>
                                                    <option value='03'>03</option>
                                                    <option value='04'>04</option>
                                                    <option value='05'>05</option>
                                                    <option value='06'>06</option>
                                                    <option value='07'>07</option>
                                                    <option value='08'>08</option>
                                                    <option value='09'>09</option>
                                                    <option value='10'>10</option>
                                                    <option value='11'>11</option>
                                                    <option value='12'>12</option>
                                                    <option value='13'>13</option>
                                                    <option value='14'>14</option>
                                                    <option value='15'>15</option>
                                                    <option value='16'>16</option>
                                                    <option value='17'>17</option>
                                                    <option value='18'>18</option>
                                                    <option value='19'>19</option>
                                                    <option value='20'>20</option>
                                                    <option value='21'>21</option>
                                                    <option value='22'>22</option>
                                                    <option value='23'>23</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-2">
                                                <select className="form-control" id='minutes' name="timem" value={this.state.apptMin} onChange={e => this.setState({ apptMin: e.target.value })}  >
                                                    <option value={this.props.apptMin}>{this.props.apptMin}</option>
                                                    <option value='00'>00</option>
                                                    <option value='15'>15</option>
                                                    <option value='30'>30</option>
                                                    <option value='45'>45</option>
                                                </select>
                                            </div>
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
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>Date</label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input type="date" id="myDate" className="form-control" name="date" pattern="\d{4}-\d{2}-\d{2}" value={this.state.dt} onChange={e => this.setState({ dt: e.target.value })} required />
                                        </div>
                                        <div className="col-sm-2">
                                            <label className="col-form-label">Service Category<span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-sm-4">
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
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label for="Service Name" className="col-form-label">Service Name<span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <select className="form-control" aria-label="Default select example" value={this.state.selectServiceName} onChange={(e) => this.setState({ selectServiceName: e.target.value, serviceCost: e.target.value.split(":")[1] }, this.onSelectComplaints("", this.state.sCategory + " : " + e.target.value))} required>
                                                <option>Select</option>
                                                {
                                                    this.state.serviceName.map((item) => (
                                                        <option value={item.serviceName + " : " + item.serviceCost}>{item.serviceName}</option>
                                                    ))
                                                }
                                            </select>

                                        </div>
                                        <div className="col-sm-2">
                                            <label for="ServiceCost" className="col-form-label">Service Cost<span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input type="text" id="myDate" className="form-control" name="serviceCost" value={this.state.serviceCost} onChange={e => this.setState({ serviceCost: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>Selected Service</label>
                                        </div>
                                        <div className="col-sm-10">
                                            <Multiselect onSelect={this.onSelectComplaints} onRemove={this.onRemoveComplaints} selectedValues={this.state.serviceDetails} fontSize="30px" displayValue="name"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="m-t-20 text-center">
                                            <button type="submit" className="btn btn-primary btn-sm" style={{ color: "white", backgroundColor: "#24498a" }} onClick={() => this.handleApptSubmit()}>Update Appointment</button>&nbsp;
                                            <button type="submit" className="btn btn-primary btn-sm" style={{ color: "white", backgroundColor: "#24498a" }} onClick={() => this.clear()}>Clear</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer" >
                            <div>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => window.location.reload(true)}>Close</button>
                            </div>
                            <div style={{ backgroundColor: "#24498a", width: '100% ', color: "#fff", borderRadius: '25px', padding: '1px' }}><div style={{ marginLeft: '85%', }}>{'Dr. ' + this.state.referDoctorName}</div></div>
                        </div>
                    </div>

                </div>
            </>
        );
    }
}
export default UpdateAppointment;



