import React, { Component } from "react";
import Login from '../../Login';

class DeleteDoctor extends Component {
  state = {
    open: true,
    unAuthorized: false
  };
  componentDidMount() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    const customerIDString = sessionStorage.getItem('customerID');
    const customerID = parseInt(customerIDString);
    this.setState({ Token: userToken });
    this.setState({ customerID: customerID });
    var appID = parseInt(window.location.href.split("/")[4])
    this.setState({ id: appID });
  }
  delete = () => {
    this.setState({ open: !this.state.open })
  }
  DeleteItems = async () => {
    try {
      const requestHeader = {
        "content-Type": "application/json",
      };
     const response = await fetch('https://api.preprod.customer.gynesono.com/deletecustomerlocaldatabyid', {
        method: 'POST',
        headers: requestHeader,
        body: JSON.stringify({
          customerReferId: this.props.referral_Id,
          customerID: this.state.customerID,
          accessIDKey: this.state.Token
        }),
      });
      window.location.reload(true);
    }
    catch (error) {
    }
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
        <><br/><br/><br/><br/><br/><br/>
          <div className='main_view'>
          <div className={this.state.open ? 'open' : 'close'}>
            <div className="content">
              <br></br>
              <center><h4>Do you really wants to delete that Doctor ? </h4><h5>Doctor:{this.props.ctrReferName}</h5>
                <br></br>
                <button className="btn btn-primary submit-btn" onClick={() => window.location.reload(true)}>No</button> &nbsp;
                <button className="btn btn-primary submit-btn" onClick={() => this.DeleteItems()}>Yes</button>
              </center>
            </div>
          </div>
        </div>
        </>
      );
    }
  }
}
export default DeleteDoctor;
