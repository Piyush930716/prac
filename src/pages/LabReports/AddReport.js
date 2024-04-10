import React, { Component } from 'react';
import Login from '../../Login';
// import ReportSearch from './ReportSearch';
class AddReport extends Component {
    constructor() {
        super();
        this.state = {
            responseToPost: '',
            arr: '',
            referDoctorName: '',
            unAuthorized: false,
            isBlank: false,
            doctorName: [],
        };
        this.onInputchange = this.onInputchange.bind(this);
    }
    onInputchange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.state.responseToPost[event.target.name]['result'] = event.target.value;
        this.handleCopyTable();
    }
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        this.handleReport(JSON.parse(sessionStorage.getItem('token')));
        this.handleDate();
        this.handleDoctorName(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
        this.setState({
            ptfName: this.props.ptFirstName,
            ptlName: this.props.ptLastName,
            ptId: this.props.patientId,
            Contact: this.props.ptContactNo,
            visitId: this.props.visitId,
            referDoctorName: this.props.referDoctorName,
            ptAge: this.props.ptAge,
            ptGender: this.props.ptGender
        });
    }
    handleDate = () => {
        let reportDate = new Date();
        let d = reportDate.getDate();
        if (d >= 1 && d <= 9) { d = "0" + d; }
        let m = reportDate.getMonth() + 1;
        if (m >= 1 && m <= 9) { m = "0" + m }
        reportDate = reportDate.getFullYear() + "-" + m + "-" + d;
        this.setState({ reportDate: reportDate });
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
    handleReport = async (userToken) => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://api.preprod.reports.dcsono.com/getcaliberation', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    calibrationType: this.props.calibrationType,
                    reportCategory: this.props.reportCategory,
                    reportName: this.props.reportName,
                    accessIDKey: userToken
                }),
            });
            const body = await response.json();
            this.setState({ responseToPost: body.Items });
            let footer_ = "", header_ = "";
            for (var i = 0; i < body.Items.length; i++) {
                if (body.Items[i].parameter_name == "footer") {
                    footer_ = body.Items[i].value_range;
                    body.Items.splice(i, 1);
                    this.setState({
                        footer: footer_,
                        header: header_,
                        responseToPost: body.Items
                    })
                }
                else if (body.Items[i].parameter_name == "header") {
                    header_ = body.Items[i].value_range;
                    body.Items.splice(i, 1);
                    this.setState({
                        responseToPost: body.Items,
                        header: header_,
                        footer: footer_
                    });
                }
            }
            this.setState({ responseToPost: body.Items });
            this.setState({
                footer: footer_,
                header: header_
            });
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }
    }
    handleCopyTable = () => {
        this.setState({ arr: this.state.responseToPost.map(({ parameter_id, parameter_name, units, value_range, result, method_name, editable }) => ({ parameter_id, parameter_name, units, value_range, result, method_name, editable })) });
    }
    handlePost = async () => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const requestOption = {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerCategory: "Diagnostic Center",
                    customerID: this.state.customerId,
                    age: this.props.ptAge,
                    gender: this.props.ptGender,
                    patientID: this.props.patientId,
                    patientFirstName: this.props.ptFirstName,
                    patientLastName: this.props.ptLastName,
                    patientMobileNumber: this.props.ptContactNo,
                    calibrationType: this.props.calibrationType,
                    reportCategory: this.props.reportCategory,
                    referDoctorName: this.state.referDoctorName,
                    reportName: this.props.reportName,
                    reportDate: this.state.reportDate,
                    reportValue: this.state.arr,
                    accessIDKey: this.state.token
                })
            }
            const response = await fetch('https://api.preprod.reports.dcsono.com/postlabreport', requestOption)
            const body = await response.text();
            this.setState({ messageToPost: body });
            this.setState({ isBlank: true });
            this.handleReport(this.state.token);
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }
    }
    render() {
        if (this.state.unAuthorized) {
            return (
                <div>
                    <Login />
                </div>
            );
        }
        else if (this.state.isBlank) {
            return (
                <div>
                    <AddReport messageToPost={this.state.messageToPost} reportCategory={this.props.reportCategory} reportName={this.props.reportName} calibrationType={this.props.calibrationType} />
                </div>
            );
        }

        else {
            return (
                <div className="main-wrapper">
                    <div className="page-wrapper">
                        <div className="content">
                            <div className="col-xl-12 stretch-card grid-margin">
                                <div className="mb-2 row">
                                    <div className="col-lg-12"><br />
                                        <div className="md-2 row">
                                            <div className="col-sm-1"></div>
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
                                                <label>Reg.Date : </label>
                                            </div>
                                            <div className="col-sm-2">
                                                <input type="date" id="myDate" className="form-control" name="date" pattern="\d{4}-\d{2}-\d{2}" value={this.state.reportDate} onChange={e => this.setState({ reportDate: e.target.value })} required />
                                            </div>
                                            <div className="col-sm-2">
                                                <label>Center Name<span className="text-danger">*</span></label>
                                            </div>
                                            <div className="col-sm-3">
                                                {this.state.customerName}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <hr></hr>
                                <center> <h4>{this.props.reportCategory}</h4>
                                    <h4><u>{this.props.reportName}</u></h4></center>
                                <h5>{this.state.header}</h5>
                                <p style={{ color: 'blue', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{this.props.messageToPost || this.state.messageToPost}</p>
                                <div className='col-lg-8 offset-lg-2 '>
                                    <table id="myTable">
                                        <thead>
                                            <tr>
                                                <th>Investigation</th>
                                                <th>Result</th>
                                                <th>Units</th>
                                                <th>Bio. ref. Interval</th>
                                            </tr>
                                        </thead>
                                        {this.state.responseToPost.length > 0 && (
                                            <tbody>
                                                {this.state.responseToPost.map((items, ind) => (
                                                    <tr key={items.parameter_id}>
                                                        <td>{items.parameter_name}<br></br>{items.method_name}</td>
                                                        {items.editable == 'Yes' ? <input type="text" value={this.state.ind} onChange={this.onInputchange} name={ind} /> : null}
                                                        <td>{items.units}</td>
                                                        <td>{items.value_range}</td>
                                                    </tr>
                                                ))}</tbody>
                                        )}
                                    </table>
                                    <h5>{this.state.footer}</h5>
                                    <div className="row">
                                        <div className="col">
                                            <center><button className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handlePost()}>Submit</button>&nbsp;&nbsp;&nbsp;
                                            </center>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )
        }
    }
}
export default AddReport;


