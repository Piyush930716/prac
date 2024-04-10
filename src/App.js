import Login from './Login';
import {BrowserRouter} from 'react-router-dom';
import {Routes } from 'react-router-dom';
import {Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReceiptPrint from './pages/Billing/ReceiptPrint';
import DetailPaymentHistory from './pages/FinancialReport/DetailPaymentHistory';
import DailyPaymentReport from './pages/FinancialReport/DailyPaymentReport';
import DetailedBillReport from './pages/FinancialReport/DetailedBillReport';
import DetailedCommisionReport from './pages/FinancialReport/DetailedCommisionReport';
import SummaryPaymentHistory from './pages/FinancialReport/SummaryPaymentHistory';
import AddServices from './pages/Services/AddServices';
import AddDoctor from './pages/Services/AddDoctor';
import AddCustomerImages from './pages/Services/AddCustomerImages';
import Logout from './pages/Logout';
import UpdateAppointment from './pages/Appointment/UpdateAppointment';
import DeleteAppointment from './pages/Appointment/DeleteAppointment';
import DeleteAppointmentModal from './pages/Appointment/DeleteAppointmentModal';
import AddCustomer from './pages/Customer/AddCustomer';

function App() {
  return (
   <>
         <BrowserRouter>
          <div >
            <Routes >
                <Route exact path='/' element={< Login />}></Route>
                <Route exact path="/login" element={< Login />}></Route>
                <Route exact path="/dashboard" element={<Dashboard/>}></Route>
                <Route exact path="/receiptPrint" element={< ReceiptPrint />}></Route>
                <Route exact path="/detailPaymentHistory" element={< DetailPaymentHistory />}></Route>
                <Route exact path="/dailyPaymentReport" element={< DailyPaymentReport />}></Route>
                <Route exact path="/detailedBillReport" element={< DetailedBillReport />}></Route>
                <Route exact path="/detailedCommisionReport" element={< DetailedCommisionReport />}></Route>
                <Route exact path="/summaryPaymentHistory" element={< SummaryPaymentHistory />}></Route>
                <Route exact path="/addServices" element={< AddServices />}></Route>
                <Route exact path="/addDoctor" element={< AddDoctor />}></Route>
                <Route exact path="/addCustomerImages" element={< AddCustomerImages />}></Route>                
                <Route exact path="/logout" element={< Logout />}></Route>                
            </Routes>
          </div>
      </BrowserRouter>
   </>
  );
}
export default App;

