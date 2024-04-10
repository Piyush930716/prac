import React, { Component } from "react";
import Header from "../Header";
import DeleteDoctor from "./DeleteDoctor";
class DoctorAdd extends Component {
    state = {
        response: '',
        post: '',
        responseToPost: '',
        responseToPostt: '',
        open: true,
        list: [],
        customerName: [],
        Token: '',
        pGender: '',
        contact: '',
        email: '',
        speciality: '',
        dcAddress: ''

    };
    componentDidMount() {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        const customerIDString = sessionStorage.getItem('customerID');
        const customerID = parseInt(customerIDString);
        this.setState({ Token: userToken });
        this.setState({ customerID: customerID });
        this.handleOnload(customerID, userToken);     
    }
    clear = () => {
        window.location.reload(true)
    }
    delete = (item) => {
        this.setState({ open: !this.state.open })
        this.setState({ referralId: item.customer_refer_id });
        this.setState({ ctReferName: item.customer_refer_name });
        this.setState({ svCategory: item.serviceCategory });
    }
    handleSubmit = async e => {
        e.preventDefault();
        const requestHeader = {
            "content-Type": "application/json"
        };
        const requestOptions = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: this.state.customerID,
                customerCategory: "Diagnostic Center",
                customerReferName: this.state.doctorName,
                customerReferAddress: this.state.dcAddress,
                customerReferCity: this.state.dcCity,
                customerReferContactPerson: "",//this.state.dcContactPerson, 
                serviceCategory: this.state.speciality,
                customerContact: this.state.contact,
                customerEmail: this.state.email,
                bloodReferralRate: this.state.BloodReferralRate,
                usgReferralRate: this.state.UsgReferralRate,
                customerGender: this.state.pGender,
                accessIDKey: this.state.Token
            }),
        }
        const response = await fetch('https://api.preprod.customer.gynesono.com/postcustomerlocaldata', requestOptions)
        const body = await response.text();
        this.setState({ messageToPost: body });
        this.handleOnload(this.state.customerID, this.state.Token);
        this.setState({ doctorName: '' })
        this.setState({ dcAddress: '' });
        this.setState({ speciality: '' });
        this.setState({ contact: '' });
        this.setState({ email: '' });
        this.setState({ BloodReferralRate: '' });
        this.setState({ UsgReferralRate: '' });
        this.setState({ pGender: '' });
        this.setState({ dcCity: '' });
    };
    handleCustomerName = () => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const requestOptions = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerCategory: "Diagnostic Center",
                customerID: this.state.customerID,
                customerServiceCategory: this.state.speciality,
                customerName: this.state.doctorName,
                accessIDKey: this.state.Token
            })
        };
        fetch('https://api.preprod.customer.gynesono.com/getdetailsbylab', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({
                dcCity: data.Items[0].details.city,
                dcAddress: data.Items[0].details.address,
            }));
    }
    handleOnload = async (customerID, Token) => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.customer.gynesono.com/getallcustomerlocaldata', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: customerID,
                accessIDKey: Token
            }),
        });
        const body = await response.json();
        this.setState({ responseToPost: body.Items });
    }
    handleEdit = async (key) => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.customer.gynesono.com/getcustomerlocaldatabyid', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerReferID: key,
                customerID: this.state.customerID,
                accessIDKey: this.state.Token
            }),
        });
        const body = await response.json();
        this.setState({
            id: body.Items[0].customer_refer_id,
            rName: body.Items[0].customer_refer_name,
            doctorName: body.Items[0].customer_refer_name,
            dcAddress: body.Items[0].customer_refer_address,
            dcCity: body.Items[0].customer_refer_city,
            dcContactPerson: body.Items[0].customer_refer_contact_person,
            speciality: body.Items[0].service_category,
            UsgReferralRate: body.Items[0].usg_referral_rate,
            BloodReferralRate: body.Items[0].blood_referral_rate,
            pGender: body.Items[0].customer_gender,
            contact: body.Items[0].customer_contact,
            email: body.Items[0].customer_email,
        });
    }
    render() {
        if (!this.state.open) {
            return (
                <DeleteDoctor referral_Id={this.state.referralId} ctrReferName={this.state.ctReferName} />
            )
        }
        else {
            return (
                <div className="main-wrapper">
                    <Header/><br/><br/><br/>
                    <div className="page-wrapper">
                        <div className="content">
                            <div className="mb-2 row">
                                <div className="col-lg-8 offset-lg-2">
                                    <h4 className="page-title">Add Doctor</h4>
                                </div>
                            </div>
                            <p style={{ color: 'blue', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.messageToPost}</p>
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-8 offset-lg-2">
                                        <div className="mb-2 row">
                                            <div className="col-sm-2">
                                                <label>Doctor Name <span className="text-danger">*</span></label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" value={this.state.doctorName} onChange={e => this.setState({ doctorName: e.target.value })} />
                                            </div>
                                            <div className="col-sm-2">
                                                <label>City<span className="text-danger">*</span></label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" name="dcCity" value={this.state.dcCity} onChange={e => this.setState({ dcCity: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="md-2 row">
                                            <div className="col-sm-2">
                                                <label className="gen-label">Gender:</label>
                                            </div>
                                            <div className="col-sm-4">
                                                {this.state.pGender === "Female" &&
                                                    <div className="form-group gender-select" value={this.state.pGender} onChange={e => this.setState({ pGender: e.target.value })}>
                                                        <div className="form-check-inline">
                                                            <label className="form-check-label">
                                                                <input type="radio" name="gender" value="Male" className="form-check-input" />Male
                                                            </label>
                                                        </div>
                                                        <div className="form-check-inline">
                                                            <label className="form-check-label">
                                                                <input type="radio" name="gender" value="Female" className="form-check-input"  checked={this.state.pGender} />Female
                                                            </label>
                                                        </div>
                                                    </div>
                                                }
                                                {this.state.pGender === "Male" &&
                                                    <div className="form-group gender-select" value={this.state.pGender} onChange={e => this.setState({ pGender: e.target.value })}>
                                                        <div className="form-check-inline">
                                                            <label className="form-check-label">
                                                                <input type="radio" name="gender" value="Male" className="form-check-input" checked={this.state.pGender}/>Male
                                                            </label>
                                                        </div>
                                                        <div className="form-check-inline">
                                                            <label className="form-check-label">
                                                                <input type="radio" name="gender" value="Female" className="form-check-input"/>Female
                                                            </label>
                                                        </div>
                                                    </div>
                                                }
                                                {this.state.pGender === "" &&
                                                    <div className="form-group gender-select" value={this.state.pGender} onChange={e => this.setState({ pGender: e.target.value })}>
                                                        <div className="form-check-inline">
                                                            <label className="form-check-label">
                                                                <input type="radio" name="gender" value="Male" className="form-check-input"/>Male
                                                            </label>
                                                        </div>
                                                        <div className="form-check-inline">
                                                            <label className="form-check-label">
                                                                <input type="radio" name="gender" value="Female" className="form-check-input"/>Female
                                                            </label>
                                                        </div>
                                                    </div>
                                                }         
                                            </div>
                                        </div>    
                                        <div className="mb-2 row">
                                            <div className="col-sm-2">
                                                <label>Mobile <span className="text-danger">*</span></label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" name="contact" id="uname" size="10"
                                                    minlength="10" maxlength="10" value={this.state.contact} onChange={e => this.setState({ contact: e.target.value })} />
                                            </div>
                                            <div className="col-sm-2">
                                                <label>Email </label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="email" className="form-control" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="mb-2 row">
                                            <div className="col-sm-2">
                                                <label>Speciality </label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select className="form-control" aria-label="Default select example" value={this.state.speciality} onChange={(e) => this.setState({ speciality: e.target.value })}>
                                                    <option selected>Select</option>
                                                    <option value="MBBS">MBBS</option>
                                                    <option value="MD">MD</option>
                                                    <option value="Surgeon">Surgeon</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-2 row">
                                            <div className="col-sm-2">
                                                <label>Referral Rate for Blood Test </label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" name="BloodReferralRate" value={this.state.BloodReferralRate} onChange={e => this.setState({ BloodReferralRate: e.target.value })} required />
                                            </div>
                                            <div className="col-sm-2">
                                                <label>Referral Rate for USG </label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" name="UsgReferralRate" value={this.state.UsgReferralRate} onChange={e => this.setState({ UsgReferralRate: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="mb-2 row">
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="form-group">
                                                            <label>Address</label>
                                                            <textarea type="text" rows="3" className="form-control" name="dcAddress" value={this.state.dcAddress} onChange={e => this.setState({ dcAddress: e.target.value })} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-2 row">
                                            <div className="text-center">
                                                <button className="btn submit-btn" type="submit" style={{ backgroundColor: "#24498a", color: "white" }}>Save Doctor</button>
                                                &nbsp;
                                                <button className="btn submit-btn" onClick={() => this.clear()} style={{ backgroundColor: "#24498a", color: "white" }}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="row" style={{width: "97%"}}>
                                    <div className="card">
                            <table className="table table-border table-striped custom-table datatable mb-0">
                                    <tr>
                                        <th className="ant-table-cell">Refferal ID</th>
                                        <th className="ant-table-cell">Doctor Name</th>
                                        <th className="ant-table-cell">Speciality</th>                                       
                                        <th className="ant-table-cell">Doctor Addresss</th>
                                        <th className="ant-table-cell">Doctor City</th>
                                        <th className="ant-table-cell">Referral Rate for USG</th>
                                        <th className="ant-table-cell">Referral Rate for Blood Test</th>
                                        <th className="ant-table-cell">#</th>
                                    </tr>
                                {this.state.responseToPost.length > 0 && (
                                    <tbody>
                                        {this.state.responseToPost.map((items) => (
                                            <tr key={items.customer_refer_id}>
                                                <td className="ant-table-cell">{items.customer_refer_id}</td>
                                                <td className="ant-table-cell">{items.customer_refer_name}</td>
                                                <td className="ant-table-cell">{items.service_category}</td>                                                
                                                <td className="ant-table-cell">{items.customer_refer_address}</td>
                                                <td className="ant-table-cell">{items.customer_refer_city}</td>
                                                <td className="ant-table-cell">{items.usg_referral_rate}</td>
                                                <td className="ant-table-cell">{items.blood_referral_rate}</td>
                                                <td className="text-right ant-table-cell">
                                                   <i className="fa fa-trash-o" style={{ fontSize: "25px", color: "red", cursor: "pointer" }} onClick={() => this.delete(items)}></i>&nbsp;&nbsp;
                                                   <i className="fa fa-pencil" style={{ fontSize: "25px", color: "green", cursor: "pointer" }} onClick={() => this.handleEdit(items.customer_refer_id)}></i>
                                                </td>
                                            </tr>
                                        ))}</tbody>
                                )}
                            </table>
                            </div>
                            </div>
                            <div className="mb-2 row">
                                <div className="m-t-20 text-center">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
export default DoctorAdd;
