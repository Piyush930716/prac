import Login from '../Login';
import React, { Component } from "react";

class Logout extends Component {
    state = {

    };
    componentDidMount() {
        sessionStorage.setItem('token', JSON.stringify());
        sessionStorage.setItem('customerId', JSON.stringify());
        sessionStorage.setItem('userName', JSON.stringify());
        sessionStorage.setItem('userRole', JSON.stringify());
        sessionStorage.setItem('customerName', JSON.stringify());
    }
    render() {
        return (
            <div>
                <Login></Login>
            </div>
        );
    }
}
export default Logout;
