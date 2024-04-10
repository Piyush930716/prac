import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";

class AddAppointment extends Component {
    state = {
        responseMessage: this.props.responseMessage,
        ptFirstName: this.props.ptFirstName,
        ptLastName: this.props.ptLastName,
        ptContactNo: this.props.ptContactNo,
        patientId: this.props.patientId,
        dt: "",
        tm: "",
        ptAppointmentRemarks: "",
        timehour: "00",
        timemin: "00",
        userRole: "RECEPTIONIST",
        NoOfVisits: 0,
        selectDoctorName: "",
        postData: true,
        serviceName: [],
        doctorName: [],
        serviceDetails: [],
        remarks: this.props.remarks,
        i: 1,
        serviceCost: 0,
        totalServiceCost: 0
    };
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        this.setState({ selectDoctorName: this.props.selectDoctorName });
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
    handleApptSubmit = async e => {
        var d_arr = this.state.dt.split("-");
        var newdate = d_arr[2] + '/' + d_arr[1] + '/' + d_arr[0];
        const requestHeader = {
            "content-Type": "application/json",
        };
        const requestOptions = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                date: newdate,
                time: this.state.timehour + ":" + this.state.timemin,
                customerID: this.state.customerId,
                customerCategory: "Diagnostic Center",
                patientFirstName: this.state.ptFirstName,
                patientLastName: this.state.ptLastName,
                patientMobileNumber: this.state.ptContactNo,
                appointmentRemarks: this.state.serviceDetails,
                referDoctorName: this.state.selectDoctorName,
                appointmentStatus: 'Open',
                serviceDetails: this.state.serviceDetails,
                patientId: this.state.patientId,
                accessIDKey: this.state.token
            }),
        }
        const response = await fetch('https://api.preprod.appointment.gynesono.com/postappointment', requestOptions)
        const body = await response.text();
        this.setState({
            responseMessage: body,
            postData: true,
        });
        window.location.reload(true);
        this.setState({ ptName: "" });
        this.setState({ ptMobileNumber: "" });
        this.setState({ ptAppointmentRemarks: "" });
        this.setState({ tm: "" });
        this.setState({ dt: "" });
        this.handleDate();
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
    clear = () => {
        this.setState({
            ptName: "",
            ptMobileNumber: "",
            ptAppointmentRemarks: "",
            tm: ""
        });
    }
    onSelectComplaints = (selectedList, selectedItem) => {
        this.setState({
            serviceDetails: [...this.state.serviceDetails, {name: selectedItem, id: this.state.i}],
            totalServiceCost: parseInt(selectedItem.split(":")[2]) + parseInt(this.state.totalServiceCost),
            i: this.state.i + 1
        });
    }
    onRemoveComplaints = (selectedList, removedItem) => {
        const filtered = (this.state.serviceDetails).filter(obj => {
            return obj !== removedItem;
        });
        this.setState({
            serviceDetails: filtered,
            totalServiceCost: parseInt(this.state.totalServiceCost) -  parseInt(removedItem.name.split(":")[2]),      
        });
    }
    sendWhatsAppMessage = async () => {
        try {
            const chatId = '9022766934'; 
            const message = `Your appointment is scheduled for ${this.state.dt} at ${this.state.timehour}:${this.state.timemin}.`; // Customize the message as needed
            await this.client.sendMessage(chatId, message);
            console.log('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    generateWhatsAppMessage = () => {
        const customerPhoneNumber = sessionStorage.getItem('customerPhoneNumber'); // Retrieve recipient's phone number from session storage
        const message = `Your appointment is scheduled for ${this.state.dt} at ${this.state.timehour}:${this.state.timemin}.`; // Customize the message as needed
        return `whatsapp://send?phone=${9307160074}&text=${encodeURIComponent(message)}`;
    };
    

    render() {
        const whatsappLink = this.generateWhatsAppMessage();


        if (!this.state.postData) {
            return (
                <>
                    <div>
                        <div className="row">
                            <div className="col-lg-8 offset-lg-1"><h4 className="page-title">Add Appointment</h4></div>
                        </div>
                        <p style={{ color: '#24498a', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.responseMessage}</p>
                        <div className="col-lg-8 offset-lg-1">
                            <div className="mb-2 row">
                                <center><div className="spinner-border m-1" role="status" style={{ position: 'absolute', fontSize: '10px', height: '50px', width: '50px', color: 'Black' }}>
                                    <span className="sr-only">Posting...</span>
                                </div><img className=' m-2' src='assets/img/logo1.png' height='40' width='40'></img></center>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
        else {
            return (
                <div>
                    <div className="row">
                        <div className="col-lg-8 offset-lg-1"><h4 className="page-title">Add Appointment</h4></div>
                    </div>
                    <p style={{ color: '#24498a', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.responseMessage}</p>
                    <div className="col-lg-10 offset-lg-1">
                        <div className="mb-2 row">
                            <div className="col-sm-2">
                                <label className="col-form-label">Select Time</label>
                            </div>
                            <div className="col-sm-2">
                                <select className="form-control" id='hour' value={this.state.timehour} onChange={e => this.setState({ timehour: e.target.value })} >
                                    <option disabled>HH</option>
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
                                <select className="form-control" id='minutes' name="timem" value={this.state.timemin} onChange={e => this.setState({ timemin: e.target.value })}  >
                                    <option disabled>MM</option>
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
                                <input className='form-control' type="text" list="productName" value={this.state.selectDoctorName} onChange={(e) => this.setState({ selectDoctorName: e.target.value })}  />
                                <datalist id="productName">
                                <option>{this.state.selectDoctorName}</option>
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
                        <div className="mb-2 row">
                            <div className="col-sm-2">
                                <label htmlFor="dateInput"> Date</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="date" id="myDate" className="form-control" name="date" pattern="\d{4}-\d{2}-\d{2}" value={this.state.dt} onChange={e => this.setState({ dt: e.target.value })} required />
                            </div>
                        </div>
                        <div className="mb-2 row">
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
                        </div>
                        <div className="mb-2 row">
                            <div className="col-sm-2">
                                <label for="ServiceCost" className="col-form-label">Service Cost<span className="text-danger">*</span></label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" id="myDate" className="form-control" name="serviceCost" value={this.state.serviceCost} onChange={e => this.setState({ serviceCost: e.target.value })} required />
                            </div>
                            <div className="col-sm-2">
                                <label for="ServiceCost" className="col-form-label">Total Cost<span className="text-danger">*</span></label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" id="myDate" className="form-control" name="serviceCost" value={this.state.totalServiceCost} onChange={e => this.setState({ totalServiceCost: e.target.value })} required />
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
                                <button type="submit" className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handleApptSubmit()}>Create Appointment</button>&nbsp;
                                <button type="submit" className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.clear()}>Clear</button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 row">
                <div className="m-t-20 text-center">
                    {/* Button to open WhatsApp with pre-populated message */}
                    <a href={whatsappLink} className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a", color: "white" }}>Send Appointment Details via WhatsApp</a>
                    {/* Your existing buttons */}
                    <button type="submit" className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handleApptSubmit()}>Create Appointment</button>&nbsp;
                    <button type="submit" className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.clear()}>Clear</button>
                </div>
            </div>
                </div>
            );
        }
    }
}
export default AddAppointment;



