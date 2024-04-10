import React, { Component } from "react";
import Login from '../../Login';

class DeleteServices extends Component {
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
        "content-Type": "application/json"
      };
      const response = await fetch('https://api.preprod.services.gynesono.com/deleteservicebyid', {
        method: 'POST',
        headers: requestHeader,
        body: JSON.stringify({
          serviceID: this.props.Service_id,
          customerID: this.state.customerID,
          accessIDKey: this.state.Token
        }),
      });
    }
    catch (error) {
      this.setState({ unAuthorized: true });
    }
    window.location.reload(true);
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
        <>
          <br /><br /><br /><br /><br />
          <div className='main_view'>
            <div className={this.state.open ? 'open' : 'close'}>
              <div className="content">
                <center><h4>Do you Really Wants to Delete that Service ? </h4><h5>Service Category:{this.props.Service_Category}</h5><h5>Service Name: {this.props.Service_Name}</h5>
                  <button className="btn btn-danger submit-btn" onClick={() => window.location.reload(true)}>No</button> &nbsp;
                  <button className="btn btn-danger submit-btn" onClick={() => this.DeleteItems()}>Yes</button>
                </center>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}
export default DeleteServices;
