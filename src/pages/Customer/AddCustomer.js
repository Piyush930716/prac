import React, { Component } from 'react';
import CustomerDashboardForAppointment from "../CustomerDashboard/CustomerDashboardForAppointment";


class AddCustomer extends Component {
    state = {
        salutation: "Mrs",
        doctorName: [],
        ptFirstName: "",
        ptLastName: "",
        ptGender: "Female",
        ptAge: "",
        ptMobileNumber: "",
        ptEmail: "",
        ptHusbandName: "",
        ptAddress: "",
        ptCity: "Pune",
        ptState: "Maharashtra",
        pPortalConsent: "",
        ptMaritalStatus: "",
        datee: "",
        referDoctorName: "",
        regitercustomer: false,
        obsNobs: ""
    };
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        this.handleDoctorName(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
    }
    handleDate = (dob) => {
        let dt = new Date();
        let d = dt.getDate();
        if (d >= 1 && d <= 9) { d = "0" + d; }
        let m = dt.getMonth() + 1;
        if (m >= 1 && m <= 9) { m = "0" + m }
        dt = dt.getFullYear() + "-" + m + "-" + d;
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var mn = today.getMonth() - birthDate.getMonth();
        if (mn < 0 || (mn === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.setState({ ptAge: age });
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
    handlePatientSubmit = async () => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const requestOptions = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                salutation: this.state.salutation,
                patientFirstName: this.state.ptFirstName,
                patientLastName: this.state.ptLastName,
                patientGender: this.state.ptGender,
                patientAge: this.state.ptAge,
                patientMobileNumber: this.state.ptMobileNumber,
                patientEmail: this.state.ptEmail,
                patientHusbandName: this.state.ptHusbandName,
                patientAddress: this.state.ptAddress,
                patientCity: this.state.ptCity,
                patientState: this.state.ptState,
                patientPortalConsent: this.state.pPortalConsent,
                customerID: this.state.customerId,
                patientMaritalStatus: this.state.ptMaritalStatus,
                customerCategory: "Diagnostic Center",
                LMP: this.state.datee,
                referDoctorName: this.state.referDoctorName,
                ObsNonObs: this.state.obsNobs,
                accessIDKey: this.state.token
            }),
        }
        const response = await fetch('https://api.preprod.patient.gynesono.com/postpatient', requestOptions)
        const body = await response.text();
        this.setState({ patientId: parseInt(body) });
        this.setState({ registercustomer: true })
    }
    render() {
        if (this.state.registercustomer) {
            return (<CustomerDashboardForAppointment patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptAge={this.state.ptAge} ptGender={this.state.ptGender} ptContactNo={this.state.ptMobileNumber} ptEmail={this.state.ptEmail} referDoctorName={this.state.referDoctorName} />)
        }
        else {
            return (
                <>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Customer</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <p style={{ color: '#24498a', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.responseMessage}</p>
                                <div className="col-lg-8 offset-lg-2">
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>Salutation </label>
                                        </div>
                                        <div className="col-sm-4">
                                            <select className="form-control" aria-label="Default select example" name="salutation" value={this.state.salutation} onChange={(e) => this.setState({ salutation: e.target.value })}>
                                                <option value="Mrs.">Mrs.</option>
                                                <option value="Miss">Miss.</option>
                                                <option value="Mr.">Mr.</option>
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
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>First Name <span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input className="form-control" type="text" name="patientName" value={this.state.ptFirstName} onChange={e => this.setState({ ptFirstName: e.target.value })} required />
                                        </div>
                                        <div className="col-sm-2">
                                            <label>Last Name <span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input className="form-control" type="text" name="patientName" value={this.state.ptLastName} onChange={e => this.setState({ ptLastName: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="md-2 row">
                                        <div className="col-sm-2">
                                            <label className="gen-label">Gender</label>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group gender-select">
                                                <div className="form-group gender-select" value={this.state.ptGender} onChange={e => this.setState({ ptGender: e.target.value })} checked="checked">
                                                    <div className="form-check-inline">
                                                        <label className="form-check-label">
                                                            <input type="radio" name="gender" value="Male" className="form-check-input" />Male
                                                        </label>
                                                    </div>
                                                    <div className="form-check-inline">
                                                        <label className="form-check-label">
                                                            <input type="radio" name="gender" value="Female" className="form-check-input" defaultChecked />Female
                                                        </label>
                                                    </div>
                                                    <div className="form-check-inline">
                                                        <label className="form-check-label">
                                                            <input type="radio" name="gender" value="Other" className="form-check-input" />Other
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-2">
                                            <label>Age or DOB</label>
                                        </div>
                                        <div className="col-sm-2">
                                            <input className="form-control" type="text" name="patientAge" value={this.state.ptAge} placeholder="Age" onChange={e => this.setState({ ptAge: e.target.value })} required />
                                        </div>
                                        <div className="col-sm-2">
                                            <input type="date" id="myDate" className="form-control" name="date" pattern="\d{4}-\d{2}-\d{2}" placeholder="DOB" value={this.state.ptDOB} onChange={e => this.setState({ ptDOB: e.target.value }, this.handleDate(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>Marital Status</label>
                                        </div>
                                        <div className="col-sm-4">
                                            <select className="form-control" aria-label="Default select example" value={this.state.ptMaritalStatus} onChange={e => this.setState({ ptMaritalStatus: e.target.value })}>
                                                <option>Select</option>
                                                <option value="married">Married</option>
                                                <option value="unmarried">Unmarried</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-2">
                                            <label>Husband Name</label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input className="form-control" type="text" name="patientHusbandName" value={this.state.ptHusbandName} onChange={e => this.setState({ ptHusbandName: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>Obs/Non-Obs </label>
                                        </div>
                                        <div className="col-sm-4">
                                            <select className="form-control" aria-label="Default select example" name="obsNobs" value={this.state.obsNobs} onChange={e => this.setState({ obsNobs: e.target.value })}  >
                                                <option>Select</option>
                                                <option value="Obs" >Obs</option>
                                                <option value="Non Obs">Non Obs</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>Mobile <span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input type="text" id="uname" name="name" required size="10" minLength="10" maxLength="10" className="form-control" value={this.state.ptMobileNumber} onChange={e => this.setState({ ptMobileNumber: e.target.value })} />
                                        </div>
                                        <div className="col-sm-2">
                                            <label>Email </label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input className="form-control" type="email" name="ptEmail" value={this.state.ptEmail} onChange={e => this.setState({ ptEmail: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>City <span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input className="form-control" type="text" name="ptCity" value={this.state.ptCity} onChange={e => this.setState({ ptCity: e.target.value })} required />
                                        </div>
                                        <div className="col-sm-2">
                                            <label>State</label>
                                        </div>
                                        <div className="col-sm-4">
                                            <select className="form-control" aria-label="Default select example" name="ptState" value={this.state.ptState} onChange={e => this.setState({ ptState: e.target.value })} required >
                                                <option>Maharashtra</option>
                                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                                <option value="Assam">Assam</option>
                                                <option value="Bihar">Bihar</option>
                                                <option value="Chandigarh">Chandigarh</option>
                                                <option value="Chhattisgarh">Chhattisgarh</option>
                                                <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                                                <option value="Daman and Diu">Daman and Diu</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Lakshadweep">Lakshadweep</option>
                                                <option value="Puducherry">Puducherry</option>
                                                <option value="Goa">Goa</option>
                                                <option value="Gujarat">Gujarat</option>
                                                <option value="Haryana">Haryana</option>
                                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                                <option value="Jharkhand">Jharkhand</option>
                                                <option value="Karnataka">Karnataka</option>
                                                <option value="Kerala">Kerala</option>
                                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Manipur">Manipur</option>
                                                <option value="Meghalaya">Meghalaya</option>
                                                <option value="Mizoram">Mizoram</option>
                                                <option value="Nagaland">Nagaland</option>
                                                <option value="Odisha">Odisha</option>
                                                <option value="Punjab">Punjab</option>
                                                <option value="Rajasthan">Rajasthan</option>
                                                <option value="Sikkim">Sikkim</option>
                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                <option value="Telangana">Telangana</option>
                                                <option value="Tripura">Tripura</option>
                                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                <option value="Uttarakhand">Uttarakhand</option>
                                                <option value="West Bengal">West Bengal</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-2">
                                            <label>Address</label>
                                        </div>
                                        <div className="col-sm-10">
                                            <textarea className="form-control" rows="3" name="pAddress" value={this.state.ptAddress} onChange={e => this.setState({ ptAddress: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={() => this.handlePatientSubmit()}>Register Customer</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
}
export default AddCustomer;

