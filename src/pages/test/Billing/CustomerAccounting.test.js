import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomerAccounting from '../../Billing/CustomerAccounting';

describe('CustomerAccounting Component', () => {
  it('renders label and input ', () => {
     render(<CustomerAccounting />);
  });

  it('updates state when inputs change', () => {
    const { getByLabelText } = render(<CustomerAccounting />);
    
    fireEvent.change(getByLabelText('Select Doctor'));
    fireEvent.change(getByLabelText('Date'));
    expect(getByLabelText('Select Doctor')).toBeInTheDocument();
    expect(getByLabelText('Date')).toBeInTheDocument();
  });

  it('handles adding service correctly', () => {
    const { getByText } = render(<CustomerAccounting />);
    fireEvent.click(getByText('Add Service'));
   
    expect(getByText('Service Category')).toBeInTheDocument();
    expect(getByText('Service Name')).toBeInTheDocument();
    expect(getByText('Price')).toBeInTheDocument();
  });

  it('handles confirming payment correctly', () => {
    const { getByText } = render(<CustomerAccounting />);
    fireEvent.click(getByText('Pay'));
    expect(getByText('Confirm Payment')).toBeInTheDocument();
    expect(getByText('Total Amount:')).toBeInTheDocument();
    expect(getByText('Discount:')).toBeInTheDocument();
    expect(getByText('Net Amount:')).toBeInTheDocument();
    expect(getByText('Gross Amount:')).toBeInTheDocument();
  });
});


