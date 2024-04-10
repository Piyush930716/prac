

export default function LabReportPrint({ handleClose, show, children, responseToPostHeader, responseToPostFooter, signature }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main-print"> <br />
        <center> <button type="button" onClick={handleClose} style={{ textAlign: 'center', marginLeft: '95%', backgroundColor: 'blue', top: '22%' }}>
          x
        </button>
          <button  onClick={() => window.print()} style={{ textAlign: 'center', marginLeft: '1.5%', width: '35px' }}><img src="./assets/img/pr.png" width="15px" height="10px" /></button>
        </center><br /><br /><br />
        <embed data-testid="header-embed" src={responseToPostHeader} width="1100px" height="90px" ></embed>
        <div style={{ height: '76%', width: '1050px' }}><center>{children}</center></div>
        <embed data-testid="signature-embed" src={signature} width="150px" height="80px" style={{ marginLeft: '85%' }} />
        <div><embed data-testid="footer-embed" src={responseToPostFooter} width="1100px" height="60px" /></div>
      </section>
    </div>
  );
}; 
