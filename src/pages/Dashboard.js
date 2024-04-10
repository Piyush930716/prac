import React, { Component } from 'react';
import Header from './Header';
import CustomerDashboardForAccounting from './CustomerDashboard/CustomerDashboardForAccounting';
import UpdateAppointment from './Appointment/UpdateAppointment';
import Login from '../Login';
import DeleteAppointmentModal from './Appointment/DeleteAppointmentModal';
import API_CONFIG from '../apiConfig';

class Dashboard extends Component {
    state = {
        regitercustomer: false,
        responseToPost: [],
        run: true,
        setAppt: false,
        open: true,
        noData: false,
        unAuthorized: false,
        totalAppt: 0,
        cancelAppt: 0,
        serviceDetails: []
    };
    componentDidMount() {
        console.log(API_CONFIG.LOGIN_URL);

        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        let date = new Date();
        let d = date.getDate();
        if (d >= 1 && d <= 9) { d = "0" + d; }
        let m = date.getMonth() + 1;
        if (m >= 1 && m <= 9) { m = "0" + m }
        var aptDate = date.getFullYear() + "-" + m + "-" + d;
        this.setState({ aptDate: aptDate });
        let today = new Date();
        var hours = today.getHours() * 60;
        var minutes = today.getMinutes();
        this.setState({ currentTime: hours + minutes });
    }
    handleDate = () => {
        var curr = new Date();
        curr.setDate(curr.getDate());
    };
    handleSubmitname = async (ptfName) => {
        this.setState({ run: false });
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.appointment.gynesono.com/getallappointmentsbyname', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: this.state.customerId,
                patientFirstName: ptfName,
                patientLastName: "",
                accessIDKey: this.state.token
            }),
        });
        const body = await response.json();
        this.setState({ responseToPost: body });
        this.handleTime();
    }
    handleSubmit = async () => {
        if (this.state.aptDate.includes("-")) {
            var d_arr = this.state.aptDate.split("-");
            var newdate = d_arr[2] + '/' + d_arr[1] + '/' + d_arr[0];
        }
        if (this.state.ptfName == null) {
            this.setState({ run: true });
        }
        if (this.state.run === true) {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://api.preprod.appointment.gynesono.com/getregisteredappointmentsfordash', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    appointmentDate: newdate,
                    customerID: this.state.customerId,
                    accessIDKey: this.state.token
                }),
            });
            const body = await response.json();
            if (response.status !== 200) {
                this.setState({ unAuthorized: true });
            }
            var totalAppt = body.length;
            if (totalAppt == 0) {
                this.setState({
                    noData: true
                })
            }
            var completedAppt = 0;
            var pendingAppt = 0;
            var cancelAppt = 0;
            for (var i = 0; i < body.length; i++) {
                if (body[i].status == "Completed") {
                    completedAppt = completedAppt + 1;
                }
                if (body[i].status == "Open") {
                    pendingAppt = pendingAppt + 1;
                }
                if (body[i].status == "Cancelled") {
                    cancelAppt = cancelAppt + 1;
                }
            }
            this.setState({
                responseToPost: body,
                completedAppt: completedAppt,
                pendingAppt: pendingAppt,
                cancelAppt: cancelAppt,
                totalAppt: totalAppt
            });
        }
        this.handleTime();
    }
    handleScans = async (items) => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.patient.daffodilshospitals.com/getpatientdetailsbyid', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                patientId: items.patientId,
                doctorName: this.state.doctorName,
                accessIDKey: this.state.Token
            }),
        });
        const body = await response.json();
        this.setState({
            ptName: items.patient_details.patient_name,
            ptContactNo: items.patient_details.patient_contact_no,
            ptEmail: items.patient_details.patient_email,
            ptGender: items.patient_details.patient_gender,
            ptAge: items.patient_details.patient_age,
            patientId: items.patient_id,
            appointmentId: items.appointment_id
        });
    }
    handleRegisterCustomer = async (items) => {
        const myArray = items.apointmentTime.split(":");
        let apptHour = myArray[0];
        let apptMin = myArray[1];
        this.setState({
            appointmentId: items.appointmentId,
            ptFirstName: items.patientName.split(" ")[0],
            ptLastName: items.patientName.split(" ")[1],
            apptStatus: items.status,
            ptContactNo: items.patientContact,
            ptEmail: items.ptEmail,
            ptGender: items.ptGender,
            ptAge: items.ptAge,
            patientId: items.patientId,
            patientSalutation: items.patientSalutation,
            patientState: items.patientState,
            patientMaritalStatus: items.patientMaritalStatus,
            patientHusbandName: items.patientHusbandName,
            ptCity: items.ptCity,
            patientAddress: items.patientAddress,
            serviceDetails: items.serviceDetails,
            apptHour: apptHour,
            apptMin: apptMin,
            referDoctorName: items.referDoctorName,
            remarks: items.remarks,
            registercustomer: true
        });
    }
    handleUpdate = (items) => {
        const myArray = items.apointmentTime.split(":");
        let apptHour = myArray[0];
        let apptMin = myArray[1];
        this.setState({
            setAppt: true,
            appointmentId: items.appointmentId,
            ptFirstName: items.patientName,
            ptContactNo: items.patientContact,
            patientId: items.patientId,
            serviceDetails: items.serviceDetails,
            apptHour: apptHour,
            apptMin: apptMin,
            referDoctorName: items.referDoctorName,
            remarks: items.remarks,
        })
    }
    handleCancel = async (items) => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.appointment.gynesono.com/setappointmentstatus', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                appointmentID: items.appointmentId,
                customerID: this.state.customerId,
                accessIDKey: this.state.token,
                appointmentStatus: "Cancelled"
            }),
        });
        window.location.reload(true);
    }
    handleDelete = async (items) => {
        this.setState({ open: !this.state.open })
        this.setState({ appointmentID: items.appointmentId });
    }

    handleLoader = () => {
        if (this.state.noData == false) {
            return (
                <>
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border m-1" role="status" style={{ position: 'absolute', fontSize: '10px', height: '50px', width: '50px', color: 'Black' }}>
                            <span className="sr-only">Loading...</span>
                        </div><img className=' m-2' src='assets/img/logo1.png' height='40' width='40'></img>
                    </div>
                </>
            );
        }
        if (this.state.noData) {
            return (<>
                <div className=" appointment-table">
                    <div className="card">
                        <div className="card-body">
                        </div><table className="table">
                            <tr>
                                <th className="ant-table-cell">Appt. ID</th>
                                <th className="ant-table-cell">Token ID</th>
                                <th className="ant-table-cell">Name</th>
                                <th className="ant-table-cell">View</th>
                                <th className="ant-table-cell">Time</th>
                                <th className="ant-table-cell">Wait</th>
                                <th className="ant-table-cell">Status</th>
                                <th className="ant-table-cell">Purpose</th>
                                <th className="ant-table-cell-end">Action</th>
                            </tr>
                        </table>
                        <h5><center>No Data Available</center></h5>
                    </div></div>
            </>
            )
        }
    }
    handleTime = () => {
        let today = new Date();
        var hours = today.getHours();
        var hours = hours % 12;
        var hours = hours ? hours : 12;
        var minutes = today.getMinutes();
        this.setState({
            hours: hours,
            minutes: minutes
        })
    }
    render() {
        if (this.state.unAuthorized) {
            return (<Login />)
        }
        else if (this.state.registercustomer) {
            return (<CustomerDashboardForAccounting patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptAge={this.state.ptAge} ptGender={this.state.ptGender} ptContactNo={this.state.ptContactNo} ptEmail={this.state.ptEmail} patientSalutation={this.state.patientSalutation} patientState={this.state.patientState} patientMaritalStatus={this.state.patientMaritalStatus} patientHusbandName={this.state.patientHusbandName} ptCity={this.state.ptCity}
                patientAddress={this.state.patientAddress} apptHour={this.state.apptHour} apptMin={this.state.apptMin} referDoctorName={this.state.referDoctorName} remarks={this.state.remarks} serviceDetails={this.state.serviceDetails} appointmentId={this.state.appointmentId} apptStatus={this.state.apptStatus}/>)
        }
        else if (!this.state.open) {
            return (
                <>
                    <DeleteAppointmentModal appointmentID={this.state.appointmentID} />
                </>
            );
        }
        else if (this.state.setAppt) {
            return (<UpdateAppointment appointmentId = {this.state.appointmentId} ptFirstName = {this.state.ptFirstName} ptContactNo ={this.state.ptContactNo} patientId = {this.state.patientId} serviceDetails={this.state.serviceDetails} apptHour={this.state.apptHour} apptMin= {this.state.apptMin} referDoctorName={this.state.referDoctorName} remarks={this.state.remarks}
           />) }
                else {
            return (
                <>
                    <div className="main-wrapper" onLoad={() => this.handleSubmit()} >
                        <Header />
                        <div className="page-wrapper">
                            <div className="content">
                                <br></br><br></br><br></br>
                                <div className="displybar">
                                    <label className="lablecomplete" >TOTAL: <span style={{ color: 'green' }}>{this.state.totalAppt}</span></label>
                                    <label className="lablepending">PENDING: <span style={{ color: 'red' }}>{this.state.pendingAppt}</span></label>
                                    <label className="lablecomplete" >COMPLETED: <span style={{ color: 'green' }}>{this.state.completedAppt}</span></label>
                                    <label className="lablecomplete" >CANCELLED: <span style={{ color: 'red' }}>{this.state.cancelAppt}</span></label>
                                    <input type="text" className="searchname" placeholder="search..." value={this.setState.ptName} onChange={e => this.handleSubmitname(e.target.value)} />
                                    <input type="date" id="myDate" className='date' name="date" pattern="\d{2}\d{2}\d{3}" defaultValue={this.setState.aptDate} onChange={(e) => this.setState({ aptDate: e.target.value, noData: false }, () => { this.handleSubmit() })} required />
                                </div>
                                <div className=" appointment-table">
                                    <div className="card">
                                        <div className="card-body">
                                            {
                                                this.state.responseToPost.length == 0 ? this.handleLoader() :
                                                    <table className="table">
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th className="ant-table-cell">ID</th>
                                                            <th className="ant-table-cell">Token</th>
                                                            <th className="ant-table-cell">Name</th>
                                                            <th className="ant-table-cell">Time</th>
                                                            <th className="ant-table-cell">Date</th>
                                                            <th className="ant-table-cell">Refer Doctor Name</th>
                                                            <th className="ant-table-cell">Purpose</th>
                                                            <th className="ant-table-cell">Contact No.</th>
                                                            <th className="ant-table-cell">Scans</th>
                                                            <th className="ant-table-cell">Status</th>
                                                            <th className="ant-table-cell-end">Action</th>
                                                        </tr>
                                                        {this.state.noData == true ? <tbody><h5>No data available in table</h5></tbody> : this.state.responseToPost.length > 0 && (
                                                            <tbody>
                                                                {this.state.responseToPost.map((items, sno = 0) => (
                                                                    (items.status == "Cancelled" || items.status == "Completed") && items.patientId != 0 &&
                                                                    <tr key={items.appointmentId} style={{ color: "grey" }}>
                                                                        <td className="ant-table-cell">{items.appointmentId}</td>
                                                                        <td className="ant-table-cell">{this.state.totalAppt - sno}</td>
                                                                        <td className="ant-table-cell"><button type="submit" className="btn btn-sm" style={{ color: "grey" }} onClick={() => this.handleRegisterCustomer(items)}>{items.patientName}</button></td>
                                                                        <td className="ant-table-cell">{items.apointmentTime}</td>
                                                                        <td className="ant-table-cell">{items.appointmentDate}</td>
                                                                        <td className="ant-table-cell">{items.referDoctorName}</td>
                                                                        {typeof (items.remarks) == "object" && <td className="ant-table-cell">{items.remarks.map((item, sno = 0) => (<>{item.name.split(":")[0]} {item.name.split(":")[1]}</>))}</td>}
                                                                        {typeof (items.remarks) == "string" && <td className="ant-table-cell">{items.remarks}</td>}
                                                                        <td className="ant-table-cell">{items.patientContact}</td>
                                                                        <td className="ant-table-cell"><button type="submit" className="btn btn-sm" style={{ color: "grey" }} onClick={() => this.handleScans(items)}><i className="fa fa-eye" aria-hidden="true"></i>&nbsp;Scans</button></td>
                                                                        <td className="ant-table-cell" style={{ color: "grey" }}>{items.status}</td>
                                                                        <td className="ant-table-cell-end">
                                                                            <button type="button" className=" dropdown-toggle" style={{ color: "#0036B1", backgroundColor: 'transparent', border: 'none' }} data-bs-toggle="dropdown" aria-expanded="false"></button>
                                                                            <ul className="dropdown-menu">
                                                                                <li><button className="dropdown-item" onClick={() => this.handleUpdate(items)}>Edit</button></li>
                                                                                <li><button className="dropdown-item" onClick={() => this.handleCancel(items)}>Cancel</button></li>
                                                                                <li><button className="dropdown-item" onClick={() => this.handleDelete(items)}>Delete</button></li>
                                                                            </ul>
                                                                        </td>
                                                                    </tr>) ||
                                                                    (items.status == "Open" && items.patientId != 0 &&
                                                                        <tr key={items.appointmentId} style={{ color: "black" }}>
                                                                            <td className="ant-table-cell">{items.appointmentId}</td>
                                                                            <td className="ant-table-cell">{this.state.totalAppt - sno}</td>
                                                                            <td className="ant-table-cell"><button type="submit" className="btn btn-primary btn-sm" style={{ color: "white", backgroundColor: "#24498a" }} onClick={() => this.handleRegisterCustomer(items)}>{items.patientName}</button></td>
                                                                            <td className="ant-table-cell">{items.apointmentTime}</td>
                                                                            <td className="ant-table-cell">{items.appointmentDate}</td>
                                                                            <td className="ant-table-cell">{items.referDoctorName}</td>
                                                                            {typeof (items.remarks) == "object" && <td className="ant-table-cell">{items.remarks.map((item, sno = 0) => (<>{item.name.split(":")[0]} : {item.name.split(":")[1]}, </>))}</td>}
                                                                            {typeof (items.remarks) == "string" && <td className="ant-table-cell">{items.remarks}</td>}
                                                                            <td className="ant-table-cell">{items.patientContact}</td>
                                                                            <td className="ant-table-cell"><button type="submit" className="btn btn-primary btn-sm" style={{ color: "white", backgroundColor: "#24498a" }} onClick={() => this.handleScans(items)}><i className="fa fa-eye" aria-hidden="true"></i>&nbsp;View Scans</button></td>
                                                                            <td className="ant-table-cell" style={{ color: "orange", fontWeight: "bold" }}>{items.status}</td>
                                                                            <td className="ant-table-cell-end">
                                                                                <button type="button" className=" dropdown-toggle" style={{ color: "#0036B1", backgroundColor: 'transparent', border: 'none' }} data-bs-toggle="dropdown" aria-expanded="false"></button>
                                                                                <ul className="dropdown-menu">
                                                                                    <li><button className="dropdown-item" onClick={() => this.handleUpdate(items)}>Edit</button></li>
                                                                                    <li><button className="dropdown-item" onClick={() => this.handleCancel(items)}>Cancel</button></li>
                                                                                    <li><button className="dropdown-item" onClick={() => this.handleDelete(items)}>Delete</button></li>
                                                                                </ul>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                            </tbody>
                                                        )}
                                                    </table>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sidebar-overlay" data-reff=""></div>
                    </div>
                </>
            );
        }
    }
}
export default Dashboard;
















