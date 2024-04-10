import React, { Component } from "react";

class DeleteBillModal extends Component {
    state = {
        open: true,
    };
    componentDidMount() {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        this.setState({ Token: userToken });
        const customerIDString = sessionStorage.getItem('customerID');
        const customerID = parseInt(customerIDString);
        this.setState({ customerID: customerID });
        this.setState({ receiptID: this.props.receiptID });
    }
    delete = () => {
        this.setState({ open: !this.state.open })
    }
    DeleteItems = async () => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.accounting.gynesono.com/deleteReceiptByID', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerID: this.state.customerID,
                receiptID: this.state.receiptID,
                accessIDKey: this.state.Token
            }),
        });
        window.location.reload(true);
    }
    render() {
        return (
            <><br /><br />
                <div className='main_view'>
                    <div className={this.state.open ? 'open' : 'close'}>
                        <div className="content">
                            <br></br>
                            <center><h5>Do You Really Want to Delete this Bill?</h5>
                                <br></br>
                                <button className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a" }} onClick={() => this.DeleteItems()}>Yes</button>&nbsp;
                                <button className="btn btn-primary submit-btn" style={{ backgroundColor: "#24498a" }} onClick={() => window.location.reload(true)}>No</button>
                            </center>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default DeleteBillModal;
