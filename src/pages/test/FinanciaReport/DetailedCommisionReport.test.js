import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DetailedCommisionReport from '../../FinancialReport/DetailedCommisionReport';
import { BrowserRouter } from 'react-router-dom';

describe('DetailedCommisionReport Component', () => {
      
    it('showModal is called when Print button is clicked', () => {
        const { getByText } = render(<BrowserRouter><DetailedCommisionReport /></BrowserRouter>);
        const printButton = getByText('Print');
        fireEvent.click(printButton);
        // Add your assertions here
      });

  it('renders correctly without crashing', () => {
    render(<BrowserRouter><DetailedCommisionReport /></BrowserRouter>);
    // Add your assertions here to verify the component renders correctly
  });

  it('handlePaymentHistoryAndTotalCommision is called when Search button is clicked', () => {
    const { getByText } = render(<BrowserRouter><DetailedCommisionReport /></BrowserRouter>);
    const searchButton = getByText('Search');
    fireEvent.click(searchButton);
    // Add your assertions here 
  });
  
  it('handleexcel is called when Export button is clicked', () => {
    const { getByText } = render(<BrowserRouter><DetailedCommisionReport /></BrowserRouter>);
    const exportButton = getByText('Export');
    fireEvent.click(exportButton);
    // Add your assertions here
  });

  it('closes modal when close button is clicked', () => {
    render(<BrowserRouter><DetailedCommisionReport /></BrowserRouter>);

 
    const printButton = screen.getByText(/Print/);
    fireEvent.click(printButton);

    const closeButton = screen.getByText('x');
    fireEvent.click(closeButton);

    const modal = screen.queryByTestId('modal');
    expect(modal).not.toBeInTheDocument();
  });

  // Add more test cases as needed
});
