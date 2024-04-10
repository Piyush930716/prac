import React, { Component } from "react";
import { Link } from "react-router-dom";
import AddCustomer from "./Customer/AddCustomer";
import CustomerDashboardForAppointment from "./CustomerDashboard/CustomerDashboardForAppointment";
import API_config from '../apiConfig';

class Header extends Component {
    state = {
        response: "",
        post: "",
        Token: "",
        customerID: "",
        launchCustomerModalOpen: false,
        launcDashboardModalOpen: false,
        suggestions: [], 
        ptFirstName: "",
        ptLastName: "",
        ptContactNo: "",
        ptEmail: "",
        ptGender: "",
        ptAge: "",
        patientId: "",
    };

    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });  
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });  
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) }); 
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) }); 
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        this.setState({ userRole: "Owner" }); 
    }

    launchCustomerModal = () => {
        this.setState({ launchCustomerModalOpen: true });
    }

    handleSubmitname = async (ptName) => {
        if (ptName.trim() !== '') { 
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://api.preprod.patient.gynesono.com/getpatientsbyname', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: this.state.customerId,
                    patientFirstName: ptName,
                    patientLastName: "",
                    accessIDKey: this.state.token
                }),
            });
            const body = await response.json();
            this.setState({ suggestions: body.Items });
        }
    }

    handleSuggestion = async (suggestion) => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.patient.gynesono.com/getpatientdetailsbyid', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: this.state.customerId,
                accessIDKey: this.state.token,
                patientID: suggestion.patient_id
            }),
        });
        const body = await response.json();
        this.setState({
            ptFirstName: body.Items[0].patient_details.patient_first_name,
            ptLastName: body.Items[0].patient_details.patient_last_name,
            ptContactNo: body.Items[0].patient_details.patient_contact_no,
            ptEmail: body.Items[0].patient_details.patient_email,
            ptGender: body.Items[0].patient_details.patient_gender,
            ptAge: body.Items[0].patient_details.patient_age,
            patientId: body.Items[0].patient_id,
            launcDashboardModalOpen: true,
        });
    }

    render() {
        if (this.state.launchCustomerModalOpen) {
            return (<AddCustomer />);
        } else if (this.state.launcDashboardModalOpen) {
            return (
                <>
                    <CustomerDashboardForAppointment
                        patientId={this.state.patientId}
                        ptFirstName={this.state.ptFirstName}
                        ptLastName={this.state.ptLastName}
                        ptAge={this.state.ptAge}
                        ptGender={this.state.ptGender}
                        ptContactNo={this.state.ptContactNo}
                        ptEmail={this.state.ptEmail}
                    />
                </>
            );
        } else {
            return (
                <>
                    <div className="nav" style={{position: "fixed"}}>
                        <input type="checkbox" id="nav-check" />
                        <div className="nav-header">
                            <div className="nav-title">
                                <center><i className="fa fa-user-md rounded-circle" style={{color: "white", fontSize: "26px", width: "220px"}} data-bs-toggle="modal" data-bs-target="#exampleModal" alt="">&nbsp;DCSONO</i></center>
                            </div>
                        </div>
                        <div className="nav-links">
                            <ul>
                            <li><a href="/dashboard"><i className="fa fa-home" aria-hidden="true"></i>&nbsp;Dashboard</a></li>
                                <li><Link to="/addCustomer" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fa fa-user" aria-hidden="true"></i>&nbsp;Customer</Link></li>
                                <li><button type="button" className="btn dropdown-toggle" style={{ color: "white", backgroundColor: "#0036B1" }} data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-plus"></i>&nbsp;Billing Reports</button>
                                    <ul className="dropdown-menu">
                                        <li style={{ width: "100%" }}><a className="dropdown-item-down" href="/dailyPaymentReport">Daily Payment Report</a></li>
                                            {this.state.userRole == "Owner" && <>               
                                        <li style={{ width: "100%" }}><a className="dropdown-item-down" href="/detailPaymentHistory">Detail Payment History</a></li>
                                        <li style={{ width: "100%" }}><a className="dropdown-item-down" href="/summaryPaymentHistory">Summary Payment History</a></li>
                                        <li style={{ width: "100%" }}><a className="dropdown-item-down" href="/detailedBillReport">Detail Bill Report</a></li>
                                        <li style={{ width: "100%" }}><a className="dropdown-item-down" href="/detailedCommisionReport">Detail commission  Report</a></li></>}
                                    </ul></li>&nbsp;
                                <li><button type="button" className="btn dropdown-toggle" style={{ color: "white", backgroundColor: "#0036B1" }} data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-plus"></i>&nbsp;Services</button>
                                    <ul className="dropdown-menu">
                                        <li style={{ width: "100%" }}><a className="dropdown-item-down" href="/addServices">Add Services</a></li>
                                        <li style={{ width: "100%" }}><a className="dropdown-item-down" href="/addDoctor">Add Doctor</a></li>
                                        <li style={{ width: "100%" }}><a className="dropdown-item-down" href="/addCustomerImages">Add Images</a></li>
                                    </ul></li>
                                <li><button type="button" className="btn dropdown-toggle"
                                    style={{ marginTop: '-3%', marginLeft: '40%', color: "white", backgroundColor: "#0036B1", position: "absolute" }} data-bs-toggle="dropdown" aria-expanded="false">{this.state.userName} </button>
                                    <ul className="dropdown-menu">
                                        <li ><button style={{ color: 'black', backgroundColor: 'white' }}><i className="fa fa-id-card-o" aria-hidden="true">&nbsp;&nbsp;</i>Profile</button></li><br></br>
                                        <li><Link to="/logout" style={{ color: 'black', backgroundColor: 'white' }}><i className="fa fa-sign-out" aria-hidden="true">&nbsp;&nbsp;</i>Log out</Link></li>
                                    </ul>
                                </li>
                                <li> <input type="text" placeholder="search customer..." className="custfeild" name="search" onChange={e => this.handleSubmitname(e.target.value)} /></li>
                                <div className="cell">{this.state.suggestions && this.state.suggestions.map((suggestion, i) =>
                                    <div key={i} className='suggetion' onClick={() => this.handleSuggestion(suggestion)}>{suggestion.patient_details.patient_first_name} {suggestion.patient_details.patient_last_name} ({suggestion.patient_details.patient_contact_no})</div>
                                )}</div>&nbsp;
                            </ul>
                        </div>
                        <div className="nav-btn">
                            <label htmlFor="nav-check">
                                <span></span>
                                <span></span>
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl">
                                <AddCustomer />
                            </div>
                        </div>
                </> 
            );
        }
    }
}
export default Header;
