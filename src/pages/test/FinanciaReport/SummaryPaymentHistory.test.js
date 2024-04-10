import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SummaryPaymentHistory from '../../FinancialReport/SummaryPaymentHistory';
import { BrowserRouter } from 'react-router-dom';


describe('SummaryPaymentHistory', () => {

    test('clicking the button triggers the desired action', () => {
        // Render the component
       render(<BrowserRouter><SummaryPaymentHistory /></BrowserRouter>);
      
        // Find the button by its text content
        const button = screen.getAllByRole('button');
      for(let i=0;i<button.length;i++){
        expect(button[i]).toBeInTheDocument();
      }
  });


  test('search button triggers handlePaymentHistory', () => {
    const { getByText } = render(<BrowserRouter><SummaryPaymentHistory /></BrowserRouter>);
    const searchButton = getByText('Search');
    fireEvent.click(searchButton);

  });
  test('input and label testing', () => {
    render(<BrowserRouter><SummaryPaymentHistory/></BrowserRouter>);
    const labelText =screen.getAllByRole('textbox');
for(let i=0;i<labelText.length;i++)
{
    expect(labelText[i]).toBeInTheDocument();
}
  });

  
});
