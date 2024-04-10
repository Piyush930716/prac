import React, { Component } from "react";
import Login from '../../Login';
import Header from "../Header";

class AddCustomerImages extends Component {
    state = {
        response: '',
        post: '',
        responseToPost: '',
        responseToPostt: '',
        responseToPostHeader: '',
        responseToPostFooter: '',
        imageType: '',
        fileName: '',
        open: true,
        isSelected: false,
        selectedFile: '',
        IsLogin: true,
        unAuthorized: false,
        signature : '',
    };
    componentDidMount() {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        const customerIDString = sessionStorage.getItem('customerID');
        const customerID = parseInt(customerIDString);
        this.setState({ Token: userToken });
        this.setState({ customerID: customerID });
        this.handleOnLoad(customerID, userToken);
    }
    handleOnLoad = async (customerID, userToken) => {
        try {
            const requestHeader = {
                "content-Type": "application/json"
            };
            const response = await fetch('https://api.preprod.gynesono.com/getcustomerimages', {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: customerID,
                    accessIDKey: userToken
                }),
            });
            const body = await response.json();
            this.setState({
                responseToPostHeader: body[0].Header,
                responseToPostFooter: body[1].Footer,
                signature : body[2].Signature
            });
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }
    }
    handleSubmit = async e => {
        try {
            e.preventDefault();
            const requestHeader = {
                "content-Type": "application/json"
            };
            const requestOptions = {
                method: 'POST',
                headers: requestHeader,
                body: JSON.stringify({
                    customerID: this.state.customerID,
                    accessIDKey: this.state.Token,
                    imageType: this.state.imageType,
                    fileName: this.state.selectedFile
                }),
            }
            const response = await fetch('https://api.preprod.gynesono.com/postcustomerimages', requestOptions)
            const body = JSON.parse(JSON.stringify(await response.text()));
            this.setState({ responseToPostt: body });
            var jsonString = JSON.parse(body);
            this.postFile(jsonString.uploadURL);
            this.handleOnLoad(this.state.customerID, this.state.Token);
        }
        catch (error) {
            this.setState({ unAuthorized: true });
        }
    };
    postFile = (strURL) => {
        const formData = new FormData();
        formData.append('File', this.state.selectedFile);
        this.state.selectedFile.arrayBuffer()
            .then((arrayBuffer) => {
                const blobData = new Blob([new Uint8Array(arrayBuffer)],
                    {
                        type: this.state.selectedFile.type
                    });
                const requestHeader = {
                    "Access-Control-Allow-Origin": "*"
                };
                const result = fetch(strURL, { method: 'PUT', headers: requestHeader, body: blobData });
            });
    };
    changeHandler = (event) => {
        this.setState({ selectedFile: event.target.files[0] });
        this.setState({ isSelected: true });
    };
    render() {
        if (this.state.unAuthorized) {
            return (
                <Login />)
        }
        else {
            return (
                <div className="main-wrapper">
                    <Header/><br/><br/><br/><br/>
                    <div className="page-wrapper">
                        <div className="content">
                            <div className="row">
                                <div className="col-lg-8 offset-lg-2"><h4 className="page-title">Add Report Header / Footer</h4></div>
                            </div>
                            <p style={{ color: 'blue', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{this.state.responseToPostt}</p>
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-8 offset-lg-2">
                                        <div className="mb-2 row">
                                            <div className="col-sm-2">
                                                <label>Report Header</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select className="form-control" aria-label="Default select exampe" style={{ width: '185px' }} value={this.state.imageType} onChange={(e) => this.setState({ imageType: e.target.value })} >
                                                    <option>Select</option>
                                                    <option value="header">Header</option>
                                                    <option value="footer">Footer</option>
                                                    <option value="signature">Signature</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-2 row">
                                            <div className="col-sm-2">
                                                <label >Select Header</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input className="fileupload input.upload" type="file" name="header" onChange={this.changeHandler} />                                         </div>
                                        </div>
                                        <div className="mb-2 row">
                                            <div className="m-t-20 text-center">
                                                <button className="btn btn-danger submit-btn" type="submit">Add Header / Footer</button> &nbsp;
                                            </div>
                                            {/* <div><embed src={this.state.responseToPostHeader} width="800px" height="2100px" /></div> */}
                                        </div>
                                        <div className="mb-2 row">
                                            <table>
                                                <tr>
                                                    <th><h4>Header</h4></th>
                                                </tr>
                                                <tr>
                                                    <td><embed src={this.state.responseToPostHeader} width="1100px" height="100px" /></td>
                                                </tr>
                                                <tr>
                                                    <th><h4>Footer</h4></th>
                                                </tr>
                                                <tr>
                                                    <td><embed src={this.state.responseToPostFooter} width="1100px" height="100px" /></td>
                                                </tr>
                                                <tr>
                                                    <th><h4>Signature</h4></th>
                                                </tr>
                                                <tr>
                                                    <td><embed src={this.state.signature} width="300px" height="100px" /></td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div><br />
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
export default AddCustomerImages;