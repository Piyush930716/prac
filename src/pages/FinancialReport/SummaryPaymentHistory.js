import React, { Component } from 'react';
import Modal from './Modal.js';
import Login from '../../Login';
import Header from '../Header.js';
class SummaryPaymentHistory extends Component {
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
        await fetch('https://xl73257esa.execute-api.us-east-1.amazonaws.com/preprod/getpaymenthistorybydate', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ responseToPost: data.Items }))
            .catch((error) => {
                <Login></Login>
            });
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
    print = () => {
        window.print();
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
        return (
            <div className="main-wrapper">
                <Header /><br /><br /><br />
                <div className="page-wrapper">
                    <div className="content">
                        <div className='offset-lg-1 '>
                            <div className="row">
                                <div className="col-sm-4 col-3">
                                    <h4 className="page-title">Summary Payment History</h4><br />
                                </div>
                            </div>
                            <div className="row filter-row">
                                <div className="col-sm-1">
                                    <label>From</label>
                                </div>
                                <div className="col-sm-2">
                                    <input className="form-control" type="date" id="fromDate" value={this.state.fromDate} onChange={e => this.setState({ fromDate: e.target.value })} required />
                                </div>
                                <div className="col-sm-1">
                                    <label>To</label>
                                </div>
                                <div className="col-sm-2">
                                    <input className="form-control" type="date" id="toDate" value={this.state.toDate} onChange={e => this.setState({ toDate: e.target.value })} req />
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
                                        <th>Payment Mode</th>
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
                                                    <td>{items.payment_mode}</td>
                                                    <td>{items.total_gross_amount}</td>
                                                    <td>{items.total_discount}</td>
                                                    <td>{items.total_net_amount}</td>
                                                    <td>{items.paid_amount}</td>
                                                    <td>{items.balance}</td>
                                                </tr>
                                            ))}</tbody>
                                    )}
                                </table>
                                <Modal show={this.state.show} handleClose={this.hideModal} >
                                    {/* <button onClick={() => this.print()} style={{ textAlign: 'center', marginLeft: '1.5%', width: '35px' }}><img src="./assets/img/pr.png" width="25px" height="20px" /></button> */}
                                    <table id="myTable" className="table table-border table-striped custom-table datatable mb-0">
                                        <thead>
                                            <tr>
                                                <th>Payment Mode</th>
                                                <th>Gross Amount <br />{this.handleTotalGrossAmount()}</th>
                                                <th>Discount <br />{this.handleTotalDiscount()}</th>
                                                <th>Net Amount <br />{this.handleTotalNetAmount()}</th>
                                                <th>Rec Amount <br />{this.handleTotalPaidAmount()}</th>
                                                <th>Balance Amount <br />{this.handleTotalBalance()}</th>
                                            </tr>
                                        </thead>
                                        {this.state.responseToPost.length > 0 && (
                                            <tbody>
                                                {this.state.responseToPost.map((items) => (
                                                    <tr key={items.receipt_id}>
                                                        <td>{items.payment_mode}</td>
                                                        <td>{items.total_gross_amount}</td>
                                                        <td>{items.total_discount}</td>
                                                        <td>{items.total_net_amount}</td>
                                                        <td>{items.paid_amount}</td>
                                                        <td>{items.balance}</td>
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
export default SummaryPaymentHistory;









