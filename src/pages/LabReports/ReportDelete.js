import React, { Component } from "react";
class ReportDelete extends Component {
    state = {
        open: true,
        unAuthorized: false
    };
    componentDidMount() {
        this.setState({ token: JSON.parse(sessionStorage.getItem('token')) });
        this.setState({ customerId: JSON.parse(sessionStorage.getItem('customerID')) });
        this.setState({ userName: JSON.parse(sessionStorage.getItem('userName')) });
        this.setState({ userRole: JSON.parse(sessionStorage.getItem('userRole')) });
        this.setState({ customerName: JSON.parse(sessionStorage.getItem('customerName')) });
    }
    delete = () => {
        this.setState({ open: !this.state.open })
    }
    DeleteItems = async () => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://api.preprod.reports.dcsono.com/deletebloodreportbyid', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: this.state.customerId,
                    reportID: this.props.reportID,
                    accessIDKey: this.state.token
                }),
            });
            window.location.reload(true);
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }
    }
    render() {
        return (
            <div className='main_view'>
                <div className={this.state.open ? 'open' : 'close'}>
                    <div className="content">
                        <center><h4 style={{ color: 'white', fontSize: '18px', textAlign: 'center' }}>Do you really want to delete this report?</h4>
                            <br></br>
                            <button className="submit-btn" style={{ color: 'blue', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }} onClick={() => window.location.reload(true)}>No</button> &nbsp;
                            <button className="submit-btn" style={{ color: 'blue', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }} onClick={() => this.DeleteItems()}>Yes</button>
                        </center>
                    </div>
                </div>
            </div>
        );
    }
}
export default ReportDelete;
