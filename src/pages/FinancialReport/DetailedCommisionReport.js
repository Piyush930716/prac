import React, { Component } from 'react';
import Modal from './Modal';
import Login from '../../Login';
import Header from '../Header';

class DetailedCommisionReport extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            fromDate: '',
            toDate: '',
            response: '',
            post: '',
            responseToPost: '',
            Isprint: true,
            commisionAmount: 0,
            doctorName: [],
            referDoctorName: 'ALL',
            unAuthorized: false,
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        this.handleDoctorName(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
    }
    showModal = () => {
        this.setState({ show: true });
    };
    hideModal = () => {
        this.setState({ show: false });
    };
    handleDoctorName = async (customerID, userToken) => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://api.preprod.customer.gynesono.com/getallcustomerlocaldata', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: parseInt(customerID),
                    accessIDKey: userToken
                }),
            });
            const body = JSON.parse(await response.text());
            this.setState({ doctorName: body.Items });
        }
        catch (erro) {
            this.setState({ unAuthorized: true });
        }
    }
    handlePaymentHistory = async () => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const requestOptions = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: this.state.customerId,
                fromDate: this.state.fromDate,
                toDate: this.state.toDate,
                accessIDKey: this.state.token,
                referDoctorName: this.state.referDoctorName
            })
        };
        await fetch('https://xl73257esa.execute-api.us-east-1.amazonaws.com/preprod/getcommisioncalculationsbydoctor', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ responseToPost: data }))
            .catch((error) => this.setState({ unAuthorized: true }));
    }
    exportTableToExcel = (tableID, filename = '') => {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        filename = filename ? filename + '.xls' : 'detailed_bill_report.xls';
        downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
            downloadLink.download = filename;
            downloadLink.click();
        }
    }
    handleexcel = () => {
        this.exportTableToExcel('myTable', 'detailed_bill_report');
    }
    totalCommision = () => {
        let sum = 0;
        for (var i = 0; i < this.state.responseToPost.length; i++) {
            sum = sum + parseInt(this.state.responseToPost[i].commisionAmount);
        }
        return parseInt(sum);
    }
    handlePaymentHistoryAndTotalCommision = () => {
        this.handlePaymentHistory();
        this.totalCommision();
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
                    <Header /><br /><br /><br />
                    <div className="page-wrapper">
                        <div className="content">
                            <div className='offset-lg-1 '>
                                <div className="row">
                                    <div className="col-sm-4 col-3">
                                        <h4 className="page-title">Detail Commision Report</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label className="col-form-label">From</label>
                                    </div>
                                    <div className="col">
                                        <input className="form-control" type="date" id="fromDate" value={this.state.fromDate} onChange={e => this.setState({ fromDate: e.target.value })} />
                                    </div>
                                    <div className="col">
                                        <label className="col-form-label">To</label>
                                    </div>
                                    <div className="col">
                                        <input className="form-control" type="date" id="toDate" value={this.state.toDate} onChange={e => this.setState({ toDate: e.target.value })} pattern="[A-ZÖÄÜ]{1,3} [A-Z]{2,4} [0-9]{1,4}" />
                                    </div>
                                    <div className="col-sm-2">
                                        <label>Select Doctor</label>
                                    </div>
                                    <div className="col-sm-4">
                                        <input className='form-control' type="text" list="productName" value={this.state.referDoctorName} onChange={(e) => this.setState({ referDoctorName: e.target.value })} />
                                        <datalist id="productName">
                                            <option value={"ALL"}>ALL</option>
                                            {
                                                this.state.doctorName.map((item) => (
                                                    <option value={item.customer_refer_name}>{item.customer_refer_name}</option>
                                                ))
                                            }
                                        </datalist>
                                    </div>
                                    <div className="col-sm-1 col-md-1.5">
                                        <button type="submit" className="btn btn-block" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handlePaymentHistoryAndTotalCommision()}> Search </button>
                                    </div>
                                    <div className="col-sm-1 col-md-1.5">
                                        <button type="submit" className="btn btn-block" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handleexcel()}> Export </button>
                                    </div>
                                    <div className="col-sm-1 col-md-1.5">
                                        <button type="submit" className="btn btn-block" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.showModal()}>Print</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ width: "97%" }}>
                                <div className="card">
                                    <div className="table-responsive">
                                        <table id="myTable" className="table table-border table-striped custom-table datatable mb-0">
                                            <tr>
                                                <th>S. No.</th>
                                                <th>Bill Date</th>
                                                <th>Customer Name</th>
                                                <th>service Category</th>
                                                <th>Service Name</th>
                                                <th>Service Cost</th>
                                                <th>Refer By</th>
                                                <th>Blood Refer Percent</th>
                                                <th>USG Refer Percent</th>
                                                <th>Referral Charge</th>
                                            </tr>
                                            {this.state.responseToPost.length > 0 && (
                                                <tbody>
                                                    {this.state.responseToPost.map((items, sno) => (
                                                        <tr key={sno + 1}>
                                                            <td>{sno}</td>
                                                            <td>{items.billDate}</td>
                                                            <td>{items.firstName} {items.lastName}</td>
                                                            <td>{items.serviceCategory}</td>
                                                            <td>{items.serviceName}</td>
                                                            <td>{items.netAmount}</td>
                                                            <td>{items.referDoctorName}</td>
                                                            <td>{items.bloodReferRate}</td>
                                                            <td>{items.usgReferRate}</td>
                                                            <td>{items.commisionAmount}</td>
                                                        </tr>
                                                    ))}</tbody>
                                            )}
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>Total Referrel Amount</td>
                                                <td>{this.totalCommision()}</td>
                                            </tr>
                                        </table>
                                        <Modal show={this.state.show} handleClose={this.hideModal}>
                                            <table id="myTable1" className="table table-border table-striped custom-table datatable mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>S. No.</th>
                                                        <th>Bill Date</th>
                                                        <th>Customer Name</th>
                                                        <th>service Category</th>
                                                        <th>Service Name</th>
                                                        <th>Service Cost</th>
                                                        <th>Refer By</th>
                                                        <th>Blood Refer Percent</th>
                                                        <th>USG Refer Percent</th>
                                                        <th>Referral Charge</th>
                                                    </tr>
                                                </thead>
                                                {this.state.responseToPost.length > 0 && (
                                                    <tbody>
                                                        {this.state.responseToPost.map((items, sno) => (
                                                            <tr key={sno + 1}>
                                                                <td>{sno}</td>
                                                                <td>{items.billDate}</td>
                                                                <td>{items.firstName} {items.lastName}</td>
                                                                <td>{items.serviceCategory}</td>
                                                                <td>{items.serviceName}</td>
                                                                <td>{items.netAmount}</td>
                                                                <td>{items.referDoctorName}</td>
                                                                <td>{items.bloodReferRate}</td>
                                                                <td>{items.usgReferRate}</td>
                                                                <td>{items.commisionAmount}</td>
                                                            </tr>
                                                        ))}</tbody>
                                                )}
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>Total Referrel Amount</td>
                                                    <td>{this.totalCommision()}</td>
                                                </tr>
                                            </table>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-overlay" data-reff=""></div>
                </div>
            );
        }
    }
}
export default DetailedCommisionReport;
