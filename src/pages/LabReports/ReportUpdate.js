import React, { Component } from 'react';
import Login from '../../Login';
import ReportSearch from './ReportSearch';
class ReportUpdate extends Component {
    constructor() {
        super();
        this.state = {
            responseToPost: '',
            unAuthorized: false,
            isBlank: false,
            reportSearchButton:false
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
        this.handleDate();
    }
    handleDate = () => {
        let reportDate = new Date();
        let d = reportDate.getDate();
        if (d >= 1 && d <= 9) { d = "0" + d; }
        let m = reportDate.getMonth() + 1;
        if (m >= 1 && m <= 9) { m = "0" + m }
        reportDate =   d + "/" + m  + "/" + reportDate.getFullYear();
        this.setState({ reportDate: reportDate });
    }
    handleCopyTable = () => {
        this.setState({ arr: this.state.responseToPost.map(({ parameter_id, parameter_name, units, value_range, result,method_name,editable}) => ({parameter_id, parameter_name, units, value_range, result, method_name,editable})) });
    }
    handleReport = async (userToken, customerID) => {
        try{
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
        this.setState({ responseToPost: body.Items[0].report_value});
    }
    catch (error) {
        this.setState({ unAuthorized: true });
      }
    }
    handleUpdate = async () => {
        try{
        const requestHeader = {
            "content-Type": "application/json"
        };
        const requestOption = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({          
                customerID:this.state.customerId,
                reportValue: this.state.arr,
                reportID: this.props.reportID,
                accessIDKey: this.state.token
            })
        }
        const response = await fetch('https://api.preprod.reports.dcsono.com/setlabreport', requestOption)
        const body = await response.text();
        this.setState({ messageToPost: body });
        this.setState({isBlank: true});
        this.handleReport(this.state.token, this.state.customerId);
    }
    catch (error) {
        this.setState({ unAuthorized: true });
      }
    }
    handleCustomerSearchBtn = () =>{
        this.setState({ reportSearchButton: true });
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
                    <ReportUpdate messageToPost = {this.state.messageToPost} reportID={this.props.reportID} reportCategory={this.props.reportCategory} reportName={this.props.reportName} calibrationType={this.props.calibrationType}/>
                </div>
            );
        }

        else if (this.state.reportSearchButton) {
            return (
                <div>
                    <ReportSearch/>
                </div>
            );
        }
        else {
            return (
                <div className="main-wrapper">
                    <div className="page-wrapper">
                        <div className="content">
                             <center> <h4>{this.props.reportCategory}</h4>
                                    <h4><u>{this.props.reportName}</u></h4></center> 
                                    <p style={{ color: 'blue', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.messageToPost || this.props.messageToPost}</p>
                                    <div className='col-lg-8 offset-lg-2 '>
                                <table id="myTable" className="table table-border">
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
                                                    <td>{items.parameter_name}<br></br>{items.method_name}</td>
                                                    {items.editable == 'Yes'? <input type="text" value={items.result} onChange={this.onInputchange} name={ind} />: null }
                                                    <td>{items.units}</td>
                                                    <td>{items.value_range}</td>
                                                </tr>
                                            ))}</tbody>
                                    )}
                                </table><div className="row">
                                <div className="col">
                                <center><button className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handleUpdate()}>Submit</button>&nbsp;&nbsp;&nbsp;
                                </center>
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
export default ReportUpdate;


