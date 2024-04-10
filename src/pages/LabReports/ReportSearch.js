import React, { Component } from 'react';
import Login from '../../Login';
import ReportUpdate from './ReportUpdate';
import ReportDelete from './ReportDelete';
import ReportView from './ReportView';
class ReportSearch extends Component {
        state = {
            response: '',
            post: '',
            responseToPost: '',
            unAuthorized: false,
            IsReportUpdate:true,
            IsView: true,
            open: true,
            unAuthorized: false,
            ptFirstName: this.props.ptFirstName,
            ptLastName: this.props.ptLastName,
            patientId: this.props.patientId,
            ptContactNo: this.props.ptContactNo,
            visitId: this.props.visitId,
            referDoctorName: this.props.referDoctorName,
            ptAge: this.props.ptAge,
            ptGender: this.props.ptGender
    }
    componentDidMount() {
        this.setState({token : JSON.parse(sessionStorage.getItem('token'))});  
        this.setState({customerId : JSON.parse(sessionStorage.getItem('customerID'))});  
        this.setState({userName : JSON.parse(sessionStorage.getItem('userName'))}); 
        this.setState({userRole : JSON.parse(sessionStorage.getItem('userRole'))}); 
        this.setState({customerName : JSON.parse(sessionStorage.getItem('customerName'))});
        this.handleSearch(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')), this.props.patientId);
    }
    handleSearch = async (customerId, token,patientId) => {
        try{
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.reports.dcsono.com/getallbloodreportsbypatientid', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: customerId,
                accessIDKey:token,
                patientID: patientId
            }),
        });
        const body = await response.json();
        this.setState({ responseToPost: body.Items});
    }
    catch (error) {
        this.setState({ unAuthorized: true });
      }
    };
    handleUpdate = (items) => {
        this.setState({responseToPost:items})
        this.setState({ IsReportUpdate: false });
        this.setState({reportCategory: items.report_category});
        this.setState({reportName: items.report_name});
        this.setState({reportID:items.report_id});
    }
    handleView = (items) => {
        this.setState({reportID: items.report_id});
        this.setState({reportCategory: items.report_category});
        this.setState({reportName: items.report_name});
        this.setState({IsView: false});
    }
    delete=(items)=>
    {
        this.setState({open: !this.state.open});
        this.setState({ reportID: items.report_id });
        this.setState({ customerID : this.state.customerID});
    }
    render() {
        if (this.state.unAuthorized) {
            return (
                <div>
                    <Login />
                </div>
            );
        }
        else if (!this.state.IsReportUpdate) {
            return (
                <ReportUpdate responseToPost={this.state.responseToPost} reportID={this.state.reportID} reportCategory={this.state.reportCategory} reportName={this.state.reportName} patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptAge={this.state.ptAge} ptGender={this.state.ptGender} ptContactNo={this.state.ptContactNo} visitId={this.state.visitId} ptEmail={this.state.ptEmail} referDoctorName={this.state.referDoctorName}/>
            )
        }
        else if (!this.state.IsView) {
            return (
                <ReportView reportID={this.state.reportID} reportCategory={this.state.reportCategory} reportName={this.state.reportName} patientId={this.state.patientId} ptFirstName={this.state.ptFirstName} ptLastName={this.state.ptLastName} ptAge={this.state.ptAge} ptGender={this.state.ptGender} ptContactNo={this.state.ptContactNo} visitId={this.state.visitId} ptEmail={this.state.ptEmail} referDoctorName={this.state.referDoctorName}/>
            )
        }
        else if (!this.state.open) {
            return (
                <ReportDelete reportID={this.state.reportID} customerID={this.state.customerID}/>
            )
        }
        else {
            return (
                <div className="main-wrapper">
                    <div className="page-wrapper">
                        <div className="content">
                            <div className="col-xl-12 col-md-12 col-sm-6 stretch-card grid-margin">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="table-responsive">
                                                    <h4 className="page-title">Report Search</h4>
                                                    <table className="table table-border table-striped custom-table ">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Report Category</th>
                                                                <th>Report Name</th>
                                                                <th>Calibration Type</th>
                                                                <th>Date</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        {this.state.responseToPost.length > 0 && (
                                                            <tbody>
                                                                {this.state.responseToPost.map((items) => (
                                                                    <tr key={items.report_id}>
                                                                        <td>{items.report_id}</td>
                                                                        <td>{items.report_category}</td>
                                                                        <td>{items.report_name}</td>
                                                                        <td>{items.calibration_type}</td>
                                                                        <td>{items.report_date}</td>
                                                                        <td><i className="fa fa-eye m-r-5" onClick={() => this.handleView(items)} style={{border:"1px solid", fontSize: "24px"}}></i>&nbsp;&nbsp;
                                                                        <i className="fa fa-pencil m-r-5" onClick={() => this.handleUpdate(items)} style={{border:"1px solid", fontSize: "24px"}}></i>&nbsp;&nbsp;
                                                                        <i className="fa fa-trash-o m-r-5" onClick={()=>this.delete(items)} style={{border:"1px solid", fontSize: "24px"}}></i></td>
                                                                    </tr>
                                                                ))}</tbody>
                                                        )}
                                                    </table>                                           
                                                </div>
                                            </div>
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
export default ReportSearch;
