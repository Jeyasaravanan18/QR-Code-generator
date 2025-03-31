import React from 'react';
import ReactDOM from 'react-dom/client';
import './Qrcss.css';
import reportWebVitals from './reportWebVitals';
import  Qrcode from './Qrcode';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*<App />*/}
   { /*<UserCard/> */}
   <Qrcode/>
  </React.StrictMode>
);

reportWebVitals();
