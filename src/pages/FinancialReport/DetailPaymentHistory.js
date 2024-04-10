import React, { Component } from 'react';
import Modal from './Modal';
import Login from '../../Login';
import Header from '../Header';

class DetailPaymentHistory extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            fromDate: '',
            toDate: '',
            response: '',
            post: '',
            responseToPost: '',
            unAuthorized: false,
            Isprint: true,
            isError: "no",
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
    }
    showModal = () => {
        this.setState({ show: true });
    };
    hideModal = () => {
        this.setState({ show: false });
    };
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
                accessIDKey: this.state.token
            })
        };
        await fetch('https://api.preprod.services.gynesono.com/getpaymenthistorybydate', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ responseToPost: data.Items }))
            .catch((error) => this.setState({ unAuthorized: true }));
    }
    exportTableToExcel = (tableID, filename = '') => {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        filename = filename ? filename + '.xls' : 'excel_data.xls';
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
        this.exportTableToExcel('myTable', 'members-data');
    }
    handleTotalGrossAmount = () => {
        let sum = 0;
        for (var i = 0; i < this.state.responseToPost.length; i++) {
            sum = sum + parseInt(this.state.responseToPost[i].total_gross_amount);
        }
        return parseInt(sum);
    }
    handleTotalDiscount = () => {
        let sum = 0;
        for (var i = 0; i < this.state.responseToPost.length; i++) {
            sum = sum + parseInt(this.state.responseToPost[i].total_discount);
        }
        return parseInt(sum);
    }
    handleTotalNetAmount = () => {
        let sum = 0;
        for (var i = 0; i < this.state.responseToPost.length; i++) {
            sum = sum + parseInt(this.state.responseToPost[i].total_net_amount);
        }
        return parseInt(sum);
    }
    handleTotalPaidAmount = () => {
        let sum = 0;
        for (var i = 0; i < this.state.responseToPost.length; i++) {
            sum = sum + parseInt(this.state.responseToPost[i].paid_amount);
        }
        return parseInt(sum);
    }
    handleTotalBalance = () => {
        let sum = 0;
        for (var i = 0; i < this.state.responseToPost.length; i++) {
            sum = sum + parseInt(this.state.responseToPost[i].balance);
        }
        return parseInt(sum);
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
                    <Header />
                    <div className="page-wrapper"><br /><br /><br />
                        <div className="content">
                            <div className="offset-lg-1">
                                <div className="row">
                                    <div className="col-sm-4 col-3">
                                        <h4 className="page-title">Detail Payment History</h4>
                                    </div>
                                </div>
                                <div className="row filter-row">
                                    <div className="col-sm-1">
                                        <label>From</label>
                                    </div>
                                    <div className="col-sm-2">
                                        <input className="form-control" type="date" id="fromDate" value={this.state.fromDate} onChange={e => this.setState({ fromDate: e.target.value })} />
                                    </div>
                                    <div className="col-sm-1">
                                        <label>To</label>
                                    </div>
                                    <div className="col-sm-2">
                                        <input className="form-control" type="date" id="toDate" value={this.state.toDate} onChange={e => this.setState({ toDate: e.target.value })} pattern="[A-ZÖÄÜ]{1,3} [A-Z]{2,4} [0-9]{1,4}" />
                                    </div>
                                    <div className="col-sm-1 col-md-2">
                                        <button type="submit" className="btn btn-block" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handlePaymentHistory()}> Search </button>
                                    </div>
                                    <div className="col-sm-1 col-md-2">
                                        <button type="submit" className="btn btn-block" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handleexcel()}> Export </button>
                                    </div>
                                    <div className="col-sm-1 col-md-2">
                                        <button type="submit" className="btn btn-block" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.showModal()}>Print</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ width: "97%" }}>
                                <div className="card">
                                    <table id="myTable" className="table table-border table-striped custom-table datatable mb-0">

                                        <tr>
                                            <th>Receipt ID</th>
                                            <th>Visit Date</th>
                                            <th>Customer Name</th>
                                            <th>Refer Doctor Name</th>
                                            <th>Gross Amount <br />{this.handleTotalGrossAmount()}</th>
                                            <th>Discount <br />{this.handleTotalDiscount()}</th>
                                            <th>Net Amount <br />{this.handleTotalNetAmount()}</th>
                                            <th>Rec Amount <br />{this.handleTotalPaidAmount()}</th>
                                            <th>Balance Amount <br />{this.handleTotalBalance()}</th>
                                        </tr>

                                        {this.state.responseToPost.length > 0 && (
                                            <tbody>
                                                {this.state.responseToPost.map((items) => (
                                                    <tr key={items.receipt_id}>
                                                        <td>{items.receipt_id}</td>
                                                        <td>{items.receipt_date}</td>
                                                        <td>{items.patient_first_name} {items.patient_last_name}</td>
                                                        <td>{items.referDoctorName}</td>
                                                        <td>{items.total_gross_amount}</td>
                                                        <td>{items.total_discount}</td>
                                                        <td>{items.total_net_amount}</td>
                                                        <td>{items.paid_amount}</td>
                                                        <td>{items.balance}</td>
                                                    </tr>
                                                ))}</tbody>
                                        )}
                                    </table>
                                    <Modal show={this.state.show} handleClose={this.hideModal}>
                                        <table id="myTable1" className="table table-border table-striped custom-table datatable mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Receipt ID</th>
                                                    <th>Visit Date</th>
                                                    <th>Customer Name</th>
                                                    <th>Gross Amount</th>
                                                    <th>Discount</th>
                                                    <th>Net Amount</th>
                                                    <th>Rec Amount</th>
                                                    <th>Balance Amount</th>
                                                </tr>
                                            </thead>
                                            {this.state.responseToPost.length > 0 && (
                                                <tbody>
                                                    {this.state.responseToPost.map((items) => (
                                                        <tr key={items.receipt_id}>
                                                            <td>{items.receipt_id}</td>
                                                            <td>{items.receipt_date}</td>
                                                            <td>{items.patient_first_name} {items.patient_last_name}</td>
                                                            <td>{items.total_gross_amount}</td>
                                                            <td>{items.total_discount}</td>
                                                            <td>{items.total_net_amount}</td>
                                                            <td>{items.paid_amount}</td>
                                                            <td>{items.balance}</td>
                                                            <td><span className="text-danger"> </span>
                                                                <div className="dropdown dropdown-action">
                                                                    <a className="action-icon dropdown-toggle" data-toggle="dropdown"
                                                                        aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                                                                </div></td>
                                                        </tr>
                                                    ))}</tbody>
                                            )}
                                        </table>
                                    </Modal>
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
export default DetailPaymentHistory;









