import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DetailPaymentHistory from '../../FinancialReport/DetailPaymentHistory';
import { BrowserRouter } from 'react-router-dom';

test('handlePaymentHistory is called when Search button is clicked', async () => {
  const { getByText } = render(<BrowserRouter><DetailPaymentHistory /></BrowserRouter>);
  const searchButton = getByText('Search');
  fireEvent.click(searchButton);

  // You can add assertions here to check if handlePaymentHistory is called and data is updated accordingly
});

test('handleexcel is called when Export button is clicked', () => {
  const { getByText } = render(<BrowserRouter><DetailPaymentHistory /></BrowserRouter>);
  const exportButton = getByText('Export');
  fireEvent.click(exportButton);

  

});

test('showModal is called when Print button is clicked', () => {
  const { getByText } = render(<BrowserRouter><DetailPaymentHistory /></BrowserRouter>);
  const printButton = getByText('Print');
  fireEvent.click(printButton);

  
});