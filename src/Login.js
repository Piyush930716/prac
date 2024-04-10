import React, { useState, useEffect } from 'react';

const Login = ({ setToken }) => {
  const SECURITY_CODE_LENGTH = 5;
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [responseToPost, setPost] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [txtInput, setTxtInput] = useState('');
  const [txtError, setTxtError] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const generateSecurityCodeImage = () => {
    const code = Array.from(Array(SECURITY_CODE_LENGTH), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");

    setSecurityCode(code);
  };

  const handleSubmit = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          password: password,
          email: email,
          customerCategory: 'Diagnostic Center',
        }),
        isBase64Encoded: false,
      };

      const response = await fetch('https://api.preprod.gynesono.com/getlogin', requestOptions);
      const body = await response.text();

      if (body.length > 100) {
        const token = JSON.parse(body).Attributes.accessKeyId;
        const customerID = JSON.parse(body).Attributes.customer_id;
        const userName = JSON.parse(body).Attributes.user_name;
        const customerName = JSON.parse(body).Attributes.customerName;
        const role = JSON.parse(body).Attributes.role_name;

        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('customerID', JSON.stringify(customerID));
        sessionStorage.setItem('userName', JSON.stringify(userName));
        sessionStorage.setItem('userRole', JSON.stringify(role));
        sessionStorage.setItem('customerName', JSON.stringify(customerName));
        setIsLoggedIn(true);
        redirectToDashboard();
      } else {
        setPost('Invalid user name, password, or email address');
      }
    } catch (error) {
      console.error('Error:', error);
      setPost('An error occurred. Please try again later.');
    }
  };

  const redirectToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const CheckValidCaptcha = async () => {
    if (!username || !password || !email) {
      setTxtError('Please enter all the required fields.');
      return;
    }

    if (txtInput !== securityCode) {
      setTxtError('Invalid captcha entered. Please try again.');
      return;
    }

    try {
      await handleSubmit();
    } catch (error) {
      console.error('Error:', error);
      setPost('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    generateSecurityCodeImage();
  }, []);

  useEffect(() => {
    setIsSubmitDisabled(!(username && password && email && txtInput && txtInput === securityCode));
  }, [username, password, email, txtInput, securityCode]);

  const fontSize = Math.min(160 / securityCode.length, 50); 

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><foreignObject width="200%" height="200%"><div xmlns="http://www.w3.org/1999/xhtml" style="display:block; color: #0036B1; font-size: ${fontSize}px; font-weight: bold;">${securityCode}</div></foreignObject></svg>`;
  const encodedSvgString = encodeURIComponent(svgString);

  return (
    <div>
      <div className="content">
        <div className="loginrow">
          <div className="container_main">
            <center>
              <h2 style={{ color: 'Black', paddingBottom: '10px' }}>Login</h2>
              <div style={{ display: 'flex' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i alt="" className="fa fa-user-md rounded-circle" style={{ color: '#0036B1', fontSize: '32px' }} /><h3 className="logtitle" style={{ color: '#0036B1' }}>DC SONO</h3>
              </div>
              <p style={{ color: 'red', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{responseToPost}</p>
              <h4 style={{ color: 'black' }}>Please sign in</h4>
              <div>
                <div>
                  <input type="text" className="field" id="floatingInput" placeholder="User Name" name="un" onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div>
                  <input type="password" className="field" id="floatingPassword" placeholder="Password" name="pw" onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <div>
                <input type="email" className="field" id="floatingInput" placeholder="Email" name="em" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ marginRight: '10px', width: '100px', height: '50px' }}>
                    <img
                      id="securityCodeImage"
                      alt="Security Code Challenge"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        fontSize: "20px", 
                        color: '#0036B1', 
                        fontWeight: 'bold', 
                      }}
                      src={`data:image/svg+xml,${encodedSvgString}`}
                    />
                  </div>
                  <button
                    id="refresh"
                    className="fa fa-refresh"
                    onClick={generateSecurityCodeImage}
                    style={{
                      backgroundColor: '#0036B1',
                      color: 'white',
                      height: '50px',
                      width: '50px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      fontSize: '20px',
                      outline: 'none',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    className="field"
                    id="txtInput"
                    placeholder="Enter Captcha"
                    onChange={(e) => setTxtInput(e.target.value)}
                    value={txtInput}
                  />
                  <div style={{ color: 'red', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{txtError}</div>
                </div>
              </div>
              <div>&nbsp;</div>
              <button type="submit" className="w-100 btn btn btn-lg btn-primary" onClick={CheckValidCaptcha} style={{ backgroundColor: '#0036B1', color: 'white', fontWeight: 'bold', fontSize: '20px', width: '100%', textAlign: 'center' }}><b>Submit</b></button>
              <center><p className="mt-5 mb-3 text-muted">&copy; InfyComp : 2022</p></center>
            </center>
          </div>
        </div>
        <div className="sidebar-overlay" data-reff=""></div>
      </div>
    </div>
  );
};

export default Login;