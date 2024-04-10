import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import AddCustomerImages from '../../Services/AddCustomerImages';
import { BrowserRouter } from 'react-router-dom';


describe('AddCustomerImages Component', () => {
test('displays Add Report Header / Footer title', () => {
    render(<BrowserRouter><AddCustomerImages /></BrowserRouter>);
    
    const pageTitleElement = screen.getByText(/Add Report Header \/ Footer/i);
    
    expect(pageTitleElement).toBeInTheDocument();
});
test(' select options ',  () => {
  render(<BrowserRouter><AddCustomerImages /></BrowserRouter>);
  
  const selectoption = screen.getAllByRole('option');
  for(let i=0;i<selectoption.length;i++){
  expect(selectoption[i]).toBeInTheDocument();
  }
});

test('Label and input rendering',  () => {
  render(<BrowserRouter><AddCustomerImages /></BrowserRouter>);
  
  const submitButton = screen.getByText('Select Header');
  expect(submitButton).toBeInTheDocument;
  
});
test('form submits correctly', async () => {
  render(<BrowserRouter><AddCustomerImages /></BrowserRouter>);
  
  const submitButton = screen.getByText('Add Header / Footer');
  fireEvent.click(submitButton);
  
});


});
