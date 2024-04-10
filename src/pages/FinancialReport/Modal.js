export default function Modal({ handleClose, show, children }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <center>
        <section className="modal-main"> <br />
          <button type="button" onClick={handleClose} style={{ textAlign: 'center', marginLeft: '95%', backgroundColor: 'blue' }}>
            x
          </button>
          <button onClick={() => window.print()} style={{ textAlign: 'center', marginLeft: '1.5%', width: '35px' }}><img src="./assets/img/pr.png" width="25px" height="20px" /></button>
          {children}

        </section>
      </center>
    </div>
  );
};
