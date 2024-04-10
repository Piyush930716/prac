import React, { useEffect, Component, useState } from "react";
export default function Modal({ handleClose, show, children, visitID, dCenter, ptfName, ptlName}) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const [list, setList] = useState([]);
  const [response, setResponse] = useState([]);
  return (
    <div className={showHideClassName}>
        <center>
      <section className="modal-main1">
       
        <button type="button" onClick={handleClose} style={{textAlign:'center', marginLeft:'95%', backgroundColor: 'blue'}}>
          X
        </button>
        {children}               
      </section>
      </center>
    </div>
  );
};



