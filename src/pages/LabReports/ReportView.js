import React, { Component } from 'react';
import Login from '../../Login';
import LabReportPrint from './LabReportPrint';
class ReportView extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            responseToPost: [],
            responseToPostHeader: '',
            responseToPostFooter: '',
            header: '',
            footer: '',
            signature: '',
            unAuthorized: false,
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }
    showModal = () => {
        this.setState({ show: true });
    };
    hideModal = () => {
        this.setState({ show: false });
    };
    componentDidMount() {
        this.setState({token : JSON.parse(sessionStorage.getItem('token'))});  
        this.setState({customerId : JSON.parse(sessionStorage.getItem('customerID'))});  
        this.setState({userName : JSON.parse(sessionStorage.getItem('userName'))}); 
        this.setState({userRole : JSON.parse(sessionStorage.getItem('userRole'))}); 
        this.setState({customerName : JSON.parse(sessionStorage.getItem('customerName'))});
        this.setState({ptFirstName: this.props.ptFirstName,
            ptLastName: this.props.ptLastName,
            patientId: this.props.patientId,
            ptContactNo: this.props.ptContactNo,
            visitId: this.props.visitId,
            referDoctorName: this.props.referDoctorName,
            ptAge: this.props.ptAge,
            ptGender: this.props.ptGender});
            this.handleReport(JSON.parse(sessionStorage.getItem('token')), JSON.parse(sessionStorage.getItem('customerID')));
            this.handleOnLoad(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
    }
    handleOnLoad = async (customerID, userToken) => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://api.preprod.gynesono.com/getcustomerimages', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: customerID,
                    accessIDKey: userToken
                }),
            });
            const body = await response.json();
            this.setState({
                responseToPostHeader: body[0].Header,
                responseToPostFooter: body[1].Footer,
                signature: body[2].Signature
            });
        }
        catch (erro) {
            this.setState({ unAuthorized: true });
        }
    }
    handleReport = async (userToken, customerID) => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://api.preprod.reports.dcsono.com/getlabreportbyid', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    reportID: this.props.reportID,
                    customerID: customerID,
                    accessIDKey: userToken
                }),
            });
            const body = await response.json();
            let footer_, header_;
            for (var i = 0; i < body.Items[0].report_value.length; i++) {
                if (body.Items[0].report_value[i].parameter_name === "footer") {
                    footer_ = body.Items[0].report_value[i].value_range;
                    body.Items[0].report_value.splice(i, 1);
                    this.setState({
                        footer: footer_,
                        responseToPost: body.Items[0].report_value
                    });
                    if (body.Items[0].report_value[i].parameter_name === "header") {
                        header_ = body.Items[0].report_value[i].value_range;
                        body.Items[0].report_value.splice(i, 1);
                    }
                    this.setState({
                        header: header_,
                        footer: footer_,
                        responseToPost: body.Items[0].report_value
                    });
                }
                else if (body.Items[0].report_value[i].parameter_name === "header") {
                    header_ = body.Items[0].report_value[i];
                    body.Items[0].report_value.splice(i, 1);
                    this.setState({
                        responseToPost: body.Items[0].report_value
                    });
                }
            }
            if (this.state.responseToPost) {
                this.setState({ responseToPost: body.Items[0].report_value });
            }
            this.setState({
                footer: footer_,
                header: header_
            });
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
        else {
            return (
                <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content">
                        <center><br/>
                            <button className="btn submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.showModal()}>Print</button>&nbsp;&nbsp;&nbsp;
                            <button className="btn btn submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.showPDFModal()}>Download</button>&nbsp;&nbsp;&nbsp;
                            <h5 style={{ color: 'black' }}>{this.props.reportCategory}</h5>
                            <h5 style={{ color: 'black' }}><u>{this.props.reportName}</u></h5>
                        </center>
                        <p>{this.state.header}</p>
                        <table id="myTable" className="table ">
                            <tr>
                                <th>Investigation</th>
                                <th>Result</th>
                                <th>Units</th>
                                <th>Bio. ref. Interval</th>
                            </tr>
                            {this.state.responseToPost.length > 0 && (
                                <tbody>
                                    {this.state.responseToPost.map((items) => (
                                        <tr key={items.parameter_id}>
                                            {(items.editable == 'Yes'? <td> {items.parameter_name} {items.method_name}</td> : null || items.editable == 'No'? <td><b>{items.parameter_name} {items.method_name}</b></td> : null) }
                                            {
                                                items.value_range.includes(" ") && items.value_range.includes("-") && items.value_range.split(" ").length < 20 ?
                                                    parseFloat(items.result) <= parseFloat(items.value_range.split("-")[1]) && parseFloat(items.result) >= parseFloat(items.value_range.split("-")[0]) ?
                                                        <td style={{ color: 'black' }}>{items.result} </td>
                                                        :
                                                        <td style={{ color: 'red' }}>{items.result} </td>
                                                    :
                                                    items.value_range.split("  ").length > 2 || items.value_range.split(" ").length > 2 || items.value_range.length < 1 ?
                                                        <td style={{ color: 'black' }}>{items.result} </td>
                                                        :
                                                        parseFloat(items.result) <= parseFloat(items.value_range.split("-")[1]) && parseFloat(items.result) >= parseFloat(items.value_range.split("-")[0]) ?
                                                            <td style={{ color: 'black' }}>{items.result} </td>
                                                            :
                                                            <td style={{ color: 'red' }}>{items.result} </td>
                                            }

                                            <td>{items.units}</td>
                                            <td>{items.value_range}</td>
                                        </tr>
                                    ))}</tbody>
                            )}
                            <h5 style={{ left: '0px' }} >{this.state.footer}</h5>
                        </table>
                        <center><h4 style={{ color: 'black' }}>--End Of Report--</h4></center>
                    </div>
                    <LabReportPrint show={this.state.show} handleClose={this.hideModal} responseToPostHeader={""} responseToPostFooter={""} signature={this.state.signature}>
                        <div className="mb-1 row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Customer Name </label>
                            </div>
                            <div className="col-sm-2">
                                <p style={{ color: 'black' }}>{this.state.ptFirstName} {this.state.ptLastName}</p>
                            </div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Age/Sex<span className="text-danger">*</span></label>
                            </div>
                            <div className="col-sm-2">
                                <p style={{ color: 'black' }}>{this.state.ptAge}/{this.state.ptGender}</p>
                            </div>
                        </div>
                        <div className="md-1 row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Ref. By Dr. :</label>
                            </div>
                            <div className="col-sm-2">
                                <p style={{ color: 'black' }}>{this.state.referDoctorName}</p>
                            </div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Center Name<span className="text-danger">*</span></label>
                            </div>
                            <div className="col-sm-3">
                                <p style={{ color: 'black' }}>{this.state.customerName}</p>
                            </div>
                        </div>
                        <div className="mb-1 row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Reg.Date : </label>
                            </div>
                            <div className="col-sm-2">
                                <p style={{ color: 'black' }}>{this.state.billDate}</p>
                            </div>
                        </div>
                        <hr></hr>
                        <center> <h4 style={{ color: 'black' }}>{this.props.reportCategory}</h4>
                            <h4 style={{ color: 'black' }}><u>{this.props.reportName}</u></h4></center>
                        <p>{this.state.header}</p>
                        <table id="myTable" hieght="1000px" style={{ color: 'black' }} className="table" >
                            <tr>
                                <th>Investigation</th>
                                <th>Result</th>
                                <th>Units</th>
                                <th>Bio. ref. Interval</th>
                            </tr>
                            {this.state.responseToPost.length > 0 && (
                                <tbody>
                                {this.state.responseToPost.map((items, ind) => (
                                   <tr key={items.parameter_id}>
                                   {(items.editable == 'Yes'? <td style={{ color: 'black', fontWeight: "bold" }}> {items.parameter_name} {items.method_name}</td> : null || items.editable == 'No'? <td style={{ color: 'black', fontWeight: "bold" }}><b>{items.parameter_name} {items.method_name}</b></td> : null) }
                                   {
                                            items.value_range.includes(" ") && items.value_range.includes("-") && items.value_range.split(" ").length < 20 ?
                                                parseFloat(items.result) <= parseFloat(items.value_range.split("-")[1]) && parseFloat(items.result) >= parseFloat(items.value_range.split("-")[0]) ?
                                                    <td style={{ color: 'black', fontWeight: "bold" }}>{items.result} </td>
                                                    :
                                                    <td style={{ color: 'red' , fontWeight: "bold"}}>{items.result} </td>
                                                :
                                                items.value_range.split("  ").length > 2 || items.value_range.split(" ").length > 2 || items.value_range.length < 1 ?
                                                    <td style={{ color: 'black', fontWeight: "bold" }}>{items.result} </td>
                                                    :
                                                    parseFloat(items.result) <= parseFloat(items.value_range.split("-")[1]) && parseFloat(items.result) >= parseFloat(items.value_range.split("-")[0]) ?
                                                        <td style={{ color: 'black', fontWeight: "bold" }}>{items.result} </td>
                                                        :
                                                        <td style={{ color: 'red', fontWeight: "bold" }}>{items.result} </td>
                                        }

                                   <td style={{ color: 'black', fontWeight: "bold" }}>{items.units}</td>
                                   <td style={{ color: 'black', fontWeight: "bold" }}>{items.value_range}</td>
                               </tr>
                                ))}</tbody>
                            )}
                        </table>
                        <h4 style={{ color: 'black' }}>--End Of Report--</h4>
                        <h5 style={{ left: '0px' }} >{this.state.footer}</h5><br />
                    </LabReportPrint>
                    <LabReportPrint show={this.state.showPDF} handleClose={this.hidePDFModal} responseToPostHeader={this.state.responseToPostHeader} responseToPostFooter={this.state.responseToPostFooter} signature={this.state.signature}>
                        <div className="mb-1 row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Customer Name </label>
                            </div>
                            <div className="col-sm-2">
                                <p style={{ color: 'black' }}>{this.state.ptFirstName} {this.state.ptLastName}</p>
                            </div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Age/Sex<span className="text-danger">*</span></label>
                            </div>
                            <div className="col-sm-2">
                                <p style={{ color: 'black' }}>{this.state.ptAge}/{this.state.ptGender}</p>
                            </div>
                        </div>
                        <div className="md-1 row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Ref. By Dr. :</label>
                            </div>
                            <div className="col-sm-2">
                                <p style={{ color: 'black' }}>{this.state.referDoctorName}</p>
                            </div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Center Name<span className="text-danger">*</span></label>
                            </div>
                            <div className="col-sm-3">
                                <p style={{ color: 'black' }}>{this.state.customerName}</p>
                            </div>
                        </div>
                        <div className="mb-1 row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-2">
                                <label style={{ color: 'black' }}>Reg.Date : </label>
                            </div>
                            <div className="col-sm-2">
                                <p style={{ color: 'black' }}>{this.state.billDate}</p>
                            </div>
                        </div>
                        <hr></hr>
                        <center> <h4 style={{ color: 'black' }}>{this.props.reportCategory}</h4>
                            <h4 style={{ color: 'black' }}><u>{this.props.reportName}</u></h4></center>
                        <p>{this.state.header}</p>
                        <table id="myTable" style={{fontSize:'14px', color: 'black'}} className="table" >
                            <tr>
                                <th>Investigation</th>
                                <th>Result</th>
                                <th>Units</th>
                                <th>Bio. ref. Interval</th>
                            </tr>
                            {this.state.responseToPost.length > 0 && (
                                <tbody>
                                    {this.state.responseToPost.map((items, ind) => (
                                       <tr key={items.parameter_id}>
                                       {(items.editable == 'Yes'? <td style={{color: 'black',  fontWeight:'bold'}}> {items.parameter_name} {items.method_name}</td> : null || items.editable == 'No'? <td style={{fontSize:'14px', color: 'black'}}><b>{items.parameter_name} {items.method_name}</b></td> : null) }
                                       {
                                                items.value_range.includes(" ") && items.value_range.includes("-") && items.value_range.split(" ").length < 20 ?
                                                    parseFloat(items.result) <= parseFloat(items.value_range.split("-")[1]) && parseFloat(items.result) >= parseFloat(items.value_range.split("-")[0]) ?
                                                        <td style={{ color: 'black', fontWeight: "bold" }}>{items.result} </td>
                                                        :
                                                        <td style={{ color: 'red', fontWeight: "bold" }}>{items.result} </td>
                                                    :
                                                    items.value_range.split("  ").length > 2 || items.value_range.split(" ").length > 2 || items.value_range.length < 1 ?
                                                        <td style={{ color: 'black', fontWeight: "bold" }}>{items.result} </td>
                                                        :
                                                        parseFloat(items.result) <= parseFloat(items.value_range.split("-")[1]) && parseFloat(items.result) >= parseFloat(items.value_range.split("-")[0]) ?
                                                            <td style={{ color: 'black', fontWeight: "bold" }}>{items.result} </td>
                                                            :
                                                            <td style={{ color: 'red', fontWeight: "bold" }}>{items.result} </td>
                                            }

                                       <td style={{ color: 'black', fontWeight: "bold" }}>{items.units}</td>
                                       <td style={{ color: 'black', fontWeight: "bold" }}>{items.value_range}</td>
                                   </tr>
                                    ))}</tbody>
                            )}
                        </table>
                        <h4 style={{ color: 'black' }}>--End Of Report--</h4>
                        <h5 style={{ left: '0px' }} >{this.state.footer}</h5><br />
                    </LabReportPrint>
                </div>
            </div>
            )
        }
    }
}
export default ReportView;

