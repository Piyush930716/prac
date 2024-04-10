import React, { Component } from 'react';
class ViewBills extends Component {
  constructor() {
    super();
    this.state = {
      printWindow: false,
      render: true
    }; 
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
     this.printIframe("receipt");
  };
  printIframe = (id) => {
    const iframe = document.frames
        ? document.frames[id]
        : document.getElementById(id);
    const iframeWindow = iframe.contentWindow || iframe;
    iframe.focus();
    iframeWindow.print();
    setTimeout(() => {
      window.location.reload(true);
   }, 2000);
  };
  render() {
      return (
        <>
            <iframe id="receipt" src="/receiptPrint" frameBorder="0" style={{ overflow: "hidden", display: "none", position: "absolute" }} title="Receipt"/>
        </>
      );
    }
  }    
export default ViewBills; 
