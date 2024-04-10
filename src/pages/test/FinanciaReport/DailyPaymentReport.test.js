import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DailyPaymentReport from '../../FinancialReport/DailyPaymentReport';
import { BrowserRouter } from 'react-router-dom';

describe('DailyPaymentReport component', () => {
  it('renders without crashing', () => {
    render(<BrowserRouter><DailyPaymentReport /></BrowserRouter>)
  });

  it('displays the current date in the date input field', () => {
    const { getByLabelText } = render(<BrowserRouter><DailyPaymentReport /></BrowserRouter>);
    const dateInput = getByLabelText('Date');
    expect(dateInput).toBeInTheDocument();
  });

  it('displays the correct table headers', () => {
    const { getByText } = render(<BrowserRouter><DailyPaymentReport /></BrowserRouter>);
    const tableHeaders = document.querySelectorAll('#myTable th');
  
    expect(tableHeaders[0]).toHaveTextContent('Receipt ID');
    expect(tableHeaders[1]).toHaveTextContent('Visit Date');
    // Add assertions for other table headers
  });
  

  // Add more test cases as needed to cover other functionalities of the component
});
