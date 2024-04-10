import React, { Component } from 'react';
import Login from '../../Login';
class CustomerBalanceUpdate extends Component {
    state = {
        balance: this.props.balance,
        paidAmount: this.props.paidAmount,
        patientId: this.props.patientId,
        paymentMode: this.props.paymentMode,
        receiptId: this.props.receiptId,
        referDoctorName: this.props.referDoctorName,
        discount: this.props.discount,
        grossAmount: this.props.grossAmount,
        netAmount: this.props.netAmount,
        paymentRemark: "",
        newPaidAmount: this.props.balance,
        newDiscount: 0,
        doctorName: [],
        responseToPost: [],
        ptFirstName: this.props.ptFirstName,
        ptLastName: this.props.ptLastName,
        Contact: this.props.ptContactNo,
        visitId: this.props.visitId,
        referDoctorName: this.props.referDoctorName,
        ptAge: this.props.ptAge,
        ptGender: this.props.ptGender,
        customerBalanceUpdate: true,
        printbtn: false,
        postData: true,
        payBtn: false,
        receipt: false
    }
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
        this.handleDate();
        this.handleDoctorName(JSON.parse(sessionStorage.getItem('customerID')), JSON.parse(sessionStorage.getItem('token')));
        sessionStorage.setItem('patient_id', JSON.stringify(this.props.patientId));
    }
    printIframe = (id) => {
        const iframe = document.frames
            ? document.frames[id]
            : document.getElementById(id);
        const iframeWindow = iframe.contentWindow || iframe;
        iframe.focus();
        iframeWindow.print();
        return false;
    };
    handleDate = () => {
        let billDate = new Date();
        let d = billDate.getDate();
        if (d >= 1 && d <= 9) { d = "0" + d; }
        let m = billDate.getMonth() + 1;
        if (m >= 1 && m <= 9) { m = "0" + m }
        billDate = billDate.getFullYear() + "-" + m + "-" + d;
        this.setState({ billDate: billDate });
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
    handlePostReceipt = async () => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const requestOption = {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: this.state.customerId,
                    role: this.state.userRole,
                    customerCategory: "Diagnostic Center",
                    patientID: parseInt(this.props.patientId),
                    patientFirstName: this.props.ptFirstName,
                    patientLastName: this.props.ptLastName,
                    referDoctorName: this.state.referDoctorName,
                    totalNetAmount: this.props.balance,
                    totalGrossAmount: 0,
                    totalDiscount: this.state.newDiscount,
                    paymentMode: this.state.paymentMode,
                    paymentInfo: this.state.paymentRemark,
                    paidAmount: this.state.newPaidAmount,
                    balance: this.props.balance - this.state.newPaidAmount,
                    receiptDate: this.state.billDate,
                    accessIDKey: this.state.token
                })
            }
            const response = await fetch('https://api.preprod.accounting.gynesono.com/postpatientreceipts', requestOption)
            const body = await response.text();
            var str1 = body.replace(/[^\d.]/g, '');
            this.setState({ str1: str1 });
            sessionStorage.setItem('receipt_id', str1);
            sessionStorage.setItem('serviceDetails', JSON.stringify([]));
            setTimeout(() => {
                this.setState({
                    receipt: true,
                    postData: true,
                    printbtn: true,
                    payBtn: true
                });
            }, 4000);
            this.setState({ messageToPost: "Complete Payment Done With " + body });
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }
    };
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
                            <div className="col-xl-12 stretch-card grid-margin">
                                <div className="mb-2 row">
                                    <div className="col-lg-12"><br />
                                        <div className="offset-lg-1">
                                            <h4 className="page-title">Pay Remaining Balance</h4>
                                            <p style={{ color: 'blue', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.messageToPost}</p>
                                            <div className="md-2 row">
                                                <div className="col-sm-1">
                                                    <label>Select Doctor</label>
                                                </div>
                                                <div className="col-sm-3">
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
                                                    <label>Bill Date : </label>
                                                </div>
                                                <div className="col-sm-3">
                                                    <input type="date" id="myDate" className="form-control" name="date" pattern="\d{4}-\d{2}-\d{2}" value={this.state.billDate} onChange={e => this.setState({ billDate: e.target.value })} required />
                                                </div>
                                                <div className="col-sm-1">
                                                    <label>Bill Amount<span className="text-danger">*</span></label>
                                                </div>
                                                <div className="col-sm-3">
                                                    <input type="text" id="netAmount" className="form-control" name="netAmount" value={this.state.netAmount} disabled required />
                                                </div>
                                            </div><br />
                                            <div className="md-2 row">
                                                <div className="col-sm-1">
                                                    <label>Paid Amount<span className="text-danger">*</span></label>
                                                </div>
                                                <div className="col-sm-3">
                                                    <input type="text" id="paidAmount" className="form-control" name="paidAmount" value={this.state.paidAmount} disabled required />
                                                </div>
                                                <div className="col-sm-1">
                                                    <label>Balance Amount<span className="text-danger">*</span></label>
                                                </div>
                                                <div className="col-sm-3">
                                                    <input type="text" id="balance" className="form-control" name="balance" value={this.state.balance} disabled required />
                                                </div>
                                                <div className="col-sm-1">
                                                    <label>Discount<span className="text-danger">*</span></label>
                                                </div>
                                                <div className="col-sm-3">
                                                    <input type="text" id="newDiscount" className="form-control" name="newDiscount" value={this.state.newDiscount} onChange={e => this.setState({ newDiscount: e.target.value })} required />
                                                </div>
                                            </div><br />
                                            <div className="md-2 row">
                                                <div className="col-sm-1">
                                                    <label>New Paid Amount<span className="text-danger">*</span></label>
                                                </div>
                                                <div className="col-sm-3">
                                                    <input type="text" id="newPaidAmount" className="form-control" name="newPaidAmount" value={this.state.newPaidAmount} onChange={e => this.setState({ newPaidAmount: e.target.value })} required />
                                                </div>
                                                <div className="col-sm-1">
                                                    <label style={{ color: 'black' }}>Select Payment Method:</label>
                                                </div>
                                                <div className="col-sm-3">
                                                    <select name="paymentMethod" id="paymentMethod" className="form-control" style={{ marginBottom: '20px' }} defaultValue={this.state.paymentMode} onClick={e => this.setState({ paymentMode: e.target.value })} required>
                                                        <option defaultselected >select mode....</option>
                                                        <option value='Cash'>Cash</option>
                                                        <option value='UPI'>UPI</option>
                                                        <option value='Credit Card'>Credit Card</option>
                                                        <option value='Debit Card'>Debit Card</option>
                                                        <option value='Cheque'>Cheque</option>
                                                    </select>
                                                </div>

                                                <div className="col-sm-1">
                                                    <label>Payment Remark<span className="text-danger">*</span></label>
                                                </div>
                                                <div className="col-sm-3">
                                                    <input type="text" id="paymentRemark" className="form-control" name="paymentRemark" value={this.state.paymentRemark} onChange={e => this.setState({ paymentRemark: e.target.value })} required />
                                                </div>
                                            </div><br />
                                            <div className="mb-2 row">
                                                <div>
                                                    <button onClick={() => this.handlePostReceipt()} disabled={this.state.payBtn} className="btn submit-btn" type="submit" style={{ backgroundColor: "#24498a", color: "white" }}>Submit</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <button className="btn submit-btn" type="submit" disabled={!this.state.printbtn} style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.printIframe('receipt')}>{this.state.isLoading ? 'Print & Close' : 'Print Receipt'}</button> &nbsp;
                                                    {this.state.receipt === true && <iframe id="receipt" src="/receiptPrint" frameBorder="0" style={{ overflow: "hidden", display: "none", position: "absolute" }} title="Receipt" />}
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
export default CustomerBalanceUpdate;


