import React, { Component } from "react";

class ConfirmPaymentModal extends Component {
    state = {
        open: true,
        show: true,
        str1: '',
        receipt: false,
        printbtn: false,
        postData: true,
        paymentMode: 'UPI',
        payBtn: false,
        patientId: this.props.patientId,
        ptFirstName: this.props.ptFirstName,
        ptLastName: this.props.ptLastName,
        serviceDetails: this.props.serviceDetails,
        referDoctorName: this.props.referDoctorName,
        totalNetAmount: this.props.totalNetAmount,
        totalGrossAmount: this.props.totalGrossAmount,
        receivedAmount: this.props.totalNetAmount,
        billDate: this.props.billDate,
        discount: this.props.discount,
        appointmentId: this.props.appointmentId,
        paymentInfo: ""
    };
    componentWillMount() {
        window.addEventListener('message', this.handleMessage);
    }
    componentWillUnmount() {
        window.removeEventListener('message', this.handleMessage);
    }
    handleMessage(event) {
        if (event.data.action === 'receipt-loaded') {
            this.setState({
                isLoading: false
            });
        }
    }
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
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
    delete = () => {
        this.setState({ open: !this.state.open })
    }
    handalModal = async () => {
        window.location.reload(true);
    }
    money = () => {
        var lamt = this.state.tamt - this.state.ramt;
        this.setState({ lmoney: lamt });
    }
    handleBilling = async (receiptId) => {
        this.setState({
            show: false,
            postData: false
        });
        const requestHeader = {
            "content-Type": "application/json",
        };
        const requestOption = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: this.state.customerId,
                role: this.state.userRole,
                receiptID: parseInt(receiptId),
                visit_id: 0,
                patient_id: this.state.patientId,
                serviceDetails: this.state.serviceDetails,
                bill_date: this.state.billDate,
                first_name: this.state.ptFirstName,
                last_name: this.state.ptLastName,
                discount: this.state.discount,
                discount_reason: this.state.discountReason,
                referDoctorName: this.state.referDoctorName,
                customer_category: "Diagnostic Center",
                accessIDKey: this.state.token
            })
        }
        const response = await fetch('https://api.preprod.accounting.gynesono.com/postcustomeraccounting', requestOption)
        const body = await response.text();
        setTimeout(() => {
            this.setState({
                receipt: true,
                postData: true,
                printbtn: true
            });
        }, 4000);
    }
    handleAppointmentStatus = async () => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.appointment.gynesono.com/setappointmentstatus', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                appointmentID: parseInt(this.props.appointmentId),
                customerID: this.state.customerId,
                appointmentStatus: "Completed",
                accessIDKey: this.state.token
            }),
        });
    }
    handleReceipt = async () => {
        this.setState({
            show: false,
            postData: false
        });
        const requestHeader = {
            "content-Type": "application/json",
        };
        const requestOption = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: this.state.customerId,
                role: this.state.userRole,
                customerCategory: "Diagnostic Center",
                patientID: this.state.patientId,
                patientFirstName: this.state.ptFirstName,
                patientLastName: this.state.ptLastName,
                totalNetAmount: this.state.totalNetAmount,
                totalGrossAmount: this.state.totalGrossAmount,
                totalDiscount: this.state.discount,
                paymentMode: this.state.paymentMode,
                paymentInfo: this.state.paymentInfo,
                paidAmount: this.state.receivedAmount,
                balance: this.state.totalNetAmount - this.state.receivedAmount,
                receiptDate: this.state.billDate,
                referDoctorName: this.state.referDoctorName,
                accessIDKey: this.state.token
            })
        }
        const response = await fetch('https://api.preprod.accounting.gynesono.com/postpatientreceipts', requestOption)
        const body = await response.text();
        this.setState({
            responseToPost: body,
            payBtn: true
        });
        var str1 = body.replace(/[^\d.]/g, '');
        this.setState({ str1: str1 });
        sessionStorage.setItem('receipt_id', str1);
        sessionStorage.setItem('serviceDetails', JSON.stringify(this.state.serviceDetails));
        this.handleBilling(str1);
        this.handleAppointmentStatus();
        setTimeout(() => {
            this.setState({
                receipt: true,
                postData: true,
                printbtn: true
            });
        }, 4000);
    }
    render() {
        if (!this.state.postData) {
            return (
                <>
                    <div>
                        <center><div className="spinner-border m-1" role="status" style={{ position: 'absolute', fontSize: '10px', height: '50px', width: '50px', color: 'Black' }}>
                            <span className="sr-only">Posting...</span>
                        </div><img className=' m-2' src='assets/img/logo1.png' height='40' width='40'></img></center>
                    </div>
                </>
            );
        }
        else {
            return (
                <>
                    <h4 style={{ color: '#24498a', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.responseToPost}</h4>
                    <div className="row" style={{ marginTop: '10%', position: 'absolute', marginLeft: '67%', zIndex: '99' }}>
                        <div style={{ marginLeft: '-20%', marginTop: '-10%' }}>
                            <label >Payment Remark:</label>
                            <input type="textarea" className="form-control" name='recived_account' value={this.state.paymentInfo} onChange={e => this.setState({ paymentInfo: e.target.value })} />
                        </div>
                        <div className="offset-lg-1" style={{ marginTop: '25px' }}>
                            <button onClick={() => this.handleReceipt()} disabled={this.state.payBtn} className="btn submit-btn" type="submit" style={{ backgroundColor: "#24498a", color: "white" }}>Submit</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn submit-btn" type="submit" disabled={!this.state.printbtn} style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.printIframe('receipt')}>{this.state.isLoading ? 'Print & Close' : 'Print Receipt'}</button> &nbsp;
                            {this.state.receipt === true && <iframe id="receipt" src="/receiptPrint" frameBorder="0" style={{ overflow: "hidden", display: "none", position: "absolute" }} title="Receipt" />}
                        </div>
                    </div>
                    <div style={{ marginLeft: '20%', width: '30%' }}>
                        <div className="row">
                            <div>
                                <label style={{ color: 'black' }}>Select Payment Method:</label>
                            </div>
                            <div>
                                <select name="paymentMethod" id="paymentMethod" className="form-control" style={{ marginBottom: '20px' }} defaultValue={this.state.paymentMode} onClick={e => this.setState({ paymentMode: e.target.value })} required>
                                    <option defaultselected >{this.state.paymentMode}</option>
                                    <option value='Cash'>Cash</option>
                                    <option value='UPI'>UPI</option>
                                    <option value='Credit Card'>Credit Card</option>
                                    <option value='Debit Card'>Debit Card</option>
                                    <option value='Cheque'>Cheque</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>
                                <label style={{ color: 'black' }}>Total Amount:</label>
                                <input className="form-control" type='number' name='total_account' style={{ marginBottom: '20px' }} value={this.state.totalNetAmount} onChange={e => this.setState({ totalNetAmount: e.target.value, receivedAmount: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ color: 'black' }}>Recived Amount:</label>
                                <input className="form-control" type='number' name='recived_account' style={{ marginBottom: '20px' }} value={this.state.receivedAmount} onChange={e => this.setState({ receivedAmount: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ color: 'black' }}>Left Amount:</label>
                                <input className="form-control" type='number' name='recived_account' value={this.state.totalNetAmount - this.state.receivedAmount} />
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
}
export default ConfirmPaymentModal;