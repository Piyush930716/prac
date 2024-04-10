import React, { Component } from 'react';
import Login from '../../Login';
import Header from '../Header';
import Modal from './Modal';

class DailyPaymentReport extends Component {
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
            todayDate: "",
            cash: 0,
            card: 0,
            upi: 0,
            total: 0
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
        this.handleDate();
        let todayDate = new Date();
        let d = todayDate.getDate();
        if (d >= 1 && d <= 9) { d = "0" + d; }
        let m = todayDate.getMonth() + 1;
        if (m >= 1 && m <= 9) { m = "0" + m }
        todayDate = todayDate.getFullYear() + "-" + m + "-" + d;
        this.handlePaymentHistory(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')), todayDate);
    }
    handleDate = () => {
        let todayDate = new Date();
        let d = todayDate.getDate();
        if (d >= 1 && d <= 9) { d = "0" + d; }
        let m = todayDate.getMonth() + 1;
        if (m >= 1 && m <= 9) { m = "0" + m }
        todayDate = todayDate.getFullYear() + "-" + m + "-" + d;
        this.setState({ todayDate: todayDate });
    }
    showModal = () => {
        this.setState({ show: true });
    };
    hideModal = () => {
        this.setState({ show: false });
    };
    handlePaymentHistory = async (customerID, Token, todayDate) => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://xl73257esa.execute-api.us-east-1.amazonaws.com/preprod/getpaymenthistorybydate', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: parseInt(customerID),
                    fromDate: todayDate,
                    toDate: todayDate,
                    accessIDKey: Token
                }),
            });
            const body = await response.json();
            this.setState({ responseToPost: body.Items });
            this.handleCalculateUPI(body.Items);
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }
    }
    handleCalculateUPI = (item) => {
        var upi = 0, cash = 0, card = 0, total = 0;
        for (var i = 0; i < item.length; i++) {
            if (item[i].payment_mode == "UPI") {
                upi = upi + parseInt(item[i].paid_amount);
            }
            if (item[i].payment_mode == "Cash") {
                cash = cash + parseInt(item[i].paid_amount);
            }
            if (item[i].payment_mode == "Debit Card") {
                card = card + parseInt(item[i].paid_amount);
            }
            if (item[i].payment_mode == "Debit Card" || "Cash" || "UPI" || " ") {
                total = total + parseInt(item[i].paid_amount);
            }
        }
        this.setState({
            upi: upi,
            card: card,
            cash: cash,
            total: total
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
    handleBalanceUpdate = (items) => {
        this.setState({ FirstName: items.patient_first_name });
        this.setState({ LastName: items.patient_last_name });
        this.setState({ NetAmount: items.total_net_amount });
        this.setState({ PaidAmount: items.paid_amount });
        this.setState({ Balance: items.balance });
        this.setState({ referDoctorName: items.referDoctorName });
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
                    <Header /><br /><br /><br /><br />
                    <div className="page-wrapper">
                        <div className="content">
                            <div className='offset-lg-1 '>
                                <div className="row">
                                    <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                                        <div className="dash-widget" style={{ border: "outset" }}>
                                            <span className="dash-widget-bg2"><i className="fa fa-paypal" style={{ fontSize: "24px" }}></i></span>
                                            <div className="dash-widget-info text-right">
                                                <h2>{this.state.upi} <i class="fa fa-inr" style={{ fontSize: "24px" }} aria-hidden="true"></i></h2>
                                                <span className="widget-title1"><b>UPI</b><i className="fa fa-check" style={{ fontSize: "24px" }} aria-hidden="true"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                                        <div className="dash-widget" style={{ border: "outset" }}>
                                            <span className="dash-widget-bg2"><i className="fa fa-money" style={{ fontSize: "24px" }}></i></span>
                                            <div className="dash-widget-info text-right">
                                                <h2>{this.state.cash} <i class="fa fa-inr" aria-hidden="true"></i></h2>
                                                <span className="widget-title1"><b>Cash</b><i className="fa fa-check" aria-hidden="true"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                                        <div className="dash-widget" style={{ border: "outset" }}>
                                            <span className="dash-widget-bg2"><i className="fa fa-cc-visa" style={{ fontSize: "24px" }}></i></span>
                                            <div className="dash-widget-info text-right">
                                                <h2>{this.state.card} <i class="fa fa-inr" aria-hidden="true"></i></h2>
                                                <span className="widget-title1"><b>Card</b><i className="fa fa-check" aria-hidden="true"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                                        <div className="dash-widget" style={{ border: "outset" }}>
                                            <span className="dash-widget-bg2"><i className="fa fa-plus" style={{ fontSize: "24px" }}></i></span>
                                            <div className="dash-widget-info text-right">
                                                <h2>{this.state.total} <i class="fa fa-inr" aria-hidden="true"></i></h2>
                                                <span className="widget-title1"><b>Total</b><i className="fa fa-check" aria-hidden="true"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-sm-4 col-3">
                                        <h4 className="page-title">Daily Payment Report</h4>
                                    </div>
                                </div>
                                <div className="row filter-row">
                                    <div className="col-sm-1">
                                        <label id="dateLabel">Date</label>
                                    </div>
                                    <div className="col-sm-2">
                                        <input className="form-control" type="date" pattern="\d{4}-\d{2}-\d{2}" aria-labelledby="dateLabel" value={this.state.todayDate} onChange={e => this.setState({ todayDate: e.target.value })} />
                                    </div>

                                    <div className="col-sm-1 col-md-2">
                                        <button type="submit" className="btn btn-block" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.handlePaymentHistory(this.state.customerId, this.state.token, this.state.todayDate)}> Search </button>
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
                                            <th>Payment Mode</th>
                                            <th>Gross Amount  <br />{this.handleTotalGrossAmount()}</th>
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
export default DailyPaymentReport;









