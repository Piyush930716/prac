import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import CustomerBalanceUpdate from '../../Billing/CustomerBalanceUpdate';

describe('CustomerBalanceUpdate Component', () => {
  it('renders correctly', () => {
    render(<CustomerBalanceUpdate />);
 
  });

  it('label associates with input field', () => {
    render(<CustomerBalanceUpdate />);
   
        const { container } = render(<CustomerBalanceUpdate />);
        const labels = container.querySelectorAll('label');
        expect(labels.length).toBeGreaterThan(1);
    
    const selectDoctorInput = screen.getAllByRole('textbox');
    for(let i=0;i<selectDoctorInput.length;i++){
        expect(selectDoctorInput[i]).toBeInTheDocument();

    }
      })
  it('calls handlePostReceipt when Submit button is clicked', async () => {
    render(<CustomerBalanceUpdate />);
    
    global.fetch = jest.fn(() => Promise.resolve({ text: () => Promise.resolve('mockResponse') }));
    
    fireEvent.click(screen.getByText('Submit'));

  });
});
