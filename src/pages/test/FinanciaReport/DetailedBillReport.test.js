import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DetailedBillReport from '../../FinancialReport/DetailedBillReport';
import { BrowserRouter } from 'react-router-dom';

describe('DetailedBillReport component', () => {
  it('renders the component correctly', () => {
    render(<BrowserRouter><DetailedBillReport /></BrowserRouter>);
    
    // Add test assertions here to check if the component renders correctly
  });

  it('performs search operation when Search button is clicked', async () => {
    const { getByText, getByLabelText } = render(<BrowserRouter><DetailedBillReport /></BrowserRouter>);
    const searchButton = getByText('Search');

    fireEvent.click(searchButton);

  });

  it('exports table to Excel when Export button is clicked', () => {
    const { getByText } = render(<BrowserRouter><DetailedBillReport /></BrowserRouter>);
    const exportButton = getByText('Export');

    fireEvent.click(exportButton);

    // Add test assertions here to check if table is exported to Excel
  });

  it('opens modal when Print button is clicked', () => {
    const { getByText } = render(<BrowserRouter><DetailedBillReport /></BrowserRouter>);
    const printButton = getByText('Print');

    fireEvent.click(printButton);

    // Add test assertions here to check if modal is opened
  });

  // Add more test cases as needed for other functionalities of the component
});
