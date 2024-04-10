
import React, { Component } from "react";
import PrintServices from './PrintServices';
import DeleteServices from "./DeleteServices";
import Login from '../../Login';
import Header from "../Header";

class AddServices extends Component {
    constructor() {
        super();
        this.state = {
            response: '',
            post: '',
            responseToPost: '',
            responseToPostt: '',
            Isprint: true,
            open: true,
            show: false,
            sName: '',
            sCost: '',
            sCategory: '',
            unAuthorized: false
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal = () => {
        this.setState({ show: true });
        // Do not call handleModelTable here
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    async componentDidMount() {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        const customerIDString = sessionStorage.getItem('customerID');
        const customerID = parseInt(customerIDString);
        this.setState({ Token: userToken, customerID: customerID });
        await this.handleOnload(customerID);
    }

    handleOnload = async (customerID) => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const tokenString = sessionStorage.getItem('token');
            const userToken = JSON.parse(tokenString);
            const response = await fetch('https://api.preprod.services.gynesono.com/getservicesmasterdata', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: customerID,
                    accessIDKey: userToken
                }),
            });
            const body = await response.json();
            this.setState({ responseToPost: body.Items });
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }
    }

    handleDate = (str) => {
        const m = str.split("-");
        let str_date = m[2] + "/" + m[1] + "/" + m[0];
        this.setState({ datee: str_date })
    }
    handleEdit = async (key) => {
        const requestHeader = {
            "content-Type": "application/json"
        };
        const response = await fetch('https://api.preprod.services.gynesono.com/getservicemasterdatabyid', {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                serviceID: key,
                customerID: this.state.customerID,
                accessIDKey: this.state.Token
            }),
        });


        const body = await response.json();
        this.setState({
            id: body.Items[0].service_id,
            sName: body.Items[0].serviceName,
            sCost: body.Items[0].serviceCost,
            sCategory: body.Items[0].serviceCategory,
        });
    }


    DeleteItems = async (key) => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            window.location.reload(true);
            const response = await fetch('https://api.preprod.services.gynesono.com/deleteservicebyid', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    serviceID: key,
                    customerID: this.state.customerID,
                    accessIDKey: this.state.Token
                }),
            });
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }

    }


    print = () => {
        window.print();
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
        this.exportTableToExcel('myTable', 'services-data');
    }
    clear = () => {
        window.location.reload(true)
    }
    delete = (items) => {
        this.setState({ open: !this.state.open })
        this.setState({ svid: items.service_id });
        this.setState({ svName: items.serviceName });
        this.setState({ svCategory: items.serviceCategory });
    }
    handleSubmit = async e => {
        e.preventDefault();
        const requestHeader = {
            "content-Type": "application/json"
        };
        const requestOptions = {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify({
                customerCategory: "Diagnostic Center",
                serviceCategory: this.state.sCategory,
                serviceName: this.state.sName,
                serviceCost: this.state.sCost,
                customerID: this.state.customerID,
                accessIDKey: this.state.Token
            }),

        }
        const response = await fetch('https://api.preprod.services.gynesono.com/postservicemasterdata', requestOptions)
        const body = await response.text();
        this.setState({ responseToPostt: body });
        this.handleOnload(this.state.customerID);
        this.setState({ sCost: '' });
    };


    render() {
        if (this.state.unAuthorized) {
            return (
                <div>
                    <Login />
                </div>
            );
        }

        else if (!this.state.open) {
            return (
                <DeleteServices Service_id={this.state.svid} Service_Name={this.state.svName} Service_Category={this.state.svCategory} />
            )
        }
        else {
            return (
                <div className="main-wrapper">
                    <Header /><br /><br /><br />
                    <div className="page-wrapper">
                        <div className="content">
                            <div className="row">
                                <div className="col-lg-8 offset-lg-2"><h4 className="page-title">Add Services</h4></div>
                            </div>
                            <p style={{ color: 'blue', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.responseToPostt}</p>
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-8 offset-lg-2">
                                        <div className="mb-2 row">
                                            <div className="col-sm-2">
                                                <label>Service Category</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select className="form-control" aria-label="Default select example" value={this.state.sCategory} onChange={(e) => this.setState({ sCategory: e.target.value })} required>
                                                    <option>Select</option>
                                                    <option value="Blood Test" >Blood Test</option>
                                                    <option value="USG">USG</option>
                                                    <option value="OPD" >OPD</option>
                                                    <option value="First Visit">First Visit</option>
                                                    <option value="Second Visit">Second Visit</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-2">
                                                <label>Service Name</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" name="sName" value={this.state.sName} onChange={e => this.setState({ sName: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="mb-2 row">
                                            <div className="col-sm-2">
                                                <label>Service Cost</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control" maxLength="10" name="sCost" value={this.state.sCost} onChange={e => this.setState({ sCost: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="mb-2 row">
                                            <div className="m-t-20 text-center">
                                                <div className="col-sm-4" ></div>
                                                <center>
                                                    <button className="btn submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} type="submit" >Save Services</button> &nbsp;
                                                    <button className="btn submit-btn" style={{ backgroundColor: "#24498a", color: "white" }} onClick={() => this.clear()}>Cancel</button>
                                                </center>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="row" style={{ width: "97%" }}>
                                <div className="card">
                                    <table data-testid="myTable" className="table table-border table-striped custom-table datatable mb-0">
                                        <tr>
                                            <th className="ant-table-cell">Service ID</th>
                                            <th className="ant-table-cell">Service Category</th>
                                            <th className="ant-table-cell">Service Name</th>
                                            <th className="ant-table-cell">Service Cost</th>
                                            <th className="ant-table-cell">Action</th>
                                        </tr>
                                        {this.state.responseToPost.length > 0 && (
                                            <tbody>
                                                {this.state.responseToPost.map((items) => (
                                                    <tr key={items.service_id}>
                                                        <td className="ant-table-cell">{items.service_id}</td>
                                                        <td className="ant-table-cell">{items.serviceCategory}</td>
                                                        <td className="ant-table-cell">{items.serviceName}</td>
                                                        <td className="ant-table-cell">{items.serviceCost}</td>
                                                        <td className="ant-table-cell text-right">
                                                            <i className="fa fa-trash-o" style={{ fontSize: "25px", color: "red", cursor: "pointer" }} onClick={(e) => this.delete(items)}></i>&nbsp;&nbsp;
                                                            <i className="fa fa-pencil" style={{ fontSize: "25px", color: "green", cursor: "pointer" }} onClick={(e) => this.handleEdit(items.service_id)}></i>
                                                        </td>
                                                    </tr>
                                                ))}</tbody>
                                        )}
                                    </table>
                                </div>
                            </div>
                            <div className="mb-3 row">

                                <div className="col-xl-3 col-md-2">


                                </div>
                                <div className="col-xl-4 col-md-2">
                                    <PrintServices show={this.state.show} visitID={this.state.counterValue} ptfName={this.state.ptfName} ptlName={this.state.ptlName} dCenter={this.state.dCenter} handleClose={this.hideModal}  >
                                        <button type="submit" onClick={() => this.print()}>print</button><div>   </div><br></br><br></br><br></br><br></br>
                                        <table className="table table-border table-striped custom-table datatable mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="ant-table-cell">Service ID</th>
                                                    <th className="ant-table-cell">Service Category</th>
                                                    <th className="ant-table-cell">Service Name</th>
                                                    <th className="ant-table-cell">Service Cost</th>
                                                </tr>
                                            </thead>
                                            {this.state.responseToPost.length > 0 && (
                                                <tbody>
                                                    {this.state.responseToPost.map((items) => (
                                                        <tr className="ant-table-cell" key={items.service_id}>
                                                            <td className="ant-table-cell">{items.service_id}</td>
                                                            <td className="ant-table-cell">{items.serviceCategory}</td>
                                                            <td className="ant-table-cell">{items.serviceName}</td>
                                                            <td className="ant-table-cell">{items.serviceCost}</td>
                                                        </tr>
                                                    ))}</tbody>
                                            )}
                                        </table>
                                    </PrintServices>
                                </div>
                            </div>
                            <center><button className="btn submit-btn" type="submit" onClick={() => this.handleexcel()} style={{ backgroundColor: "#24498a", color: "white" }}>Download</button> &nbsp;
                                <button className="btn submit-btn" type="submit" onClick={() => this.showModal()} style={{ backgroundColor: "#24498a", color: "white" }}>Print</button> &nbsp;</center>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
export default AddServices;
