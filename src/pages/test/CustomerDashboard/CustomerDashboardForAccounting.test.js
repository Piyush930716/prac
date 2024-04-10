import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomerAccounting from './CustomerAccounting';

describe('CustomerAccounting component', () => {
  it('renders without crashing', () => {
    render(<CustomerAccounting />);
  });

  it('renders correct initial state', () => {
    const { getByLabelText, getByText } = render(<CustomerAccounting />);
    expect(getByLabelText('Select Category')).toBeInTheDocument();
    expect(getByText('Total Amount:')).toBeInTheDocument();
    expect(getByText('Discount:')).toBeInTheDocument();
    expect(getByText('Pay')).toBeInTheDocument();
  });

  it('allows adding a service', () => {
    const { getByLabelText, getByText } = render(<CustomerAccounting />);
    fireEvent.change(getByLabelText('Select Category'), { target: { value: 'Blood Test' } });
    fireEvent.change(getByLabelText('Select Service'), { target: { value: 'Test Service' } });
    fireEvent.click(getByText('Add Service'));
    expect(getByText('Test Service')).toBeInTheDocument();
  });

  it('allows removing a service', () => {
    const { getByLabelText, getByText, queryByText } = render(<CustomerAccounting />);
    fireEvent.change(getByLabelText('Select Category'), { target: { value: 'Blood Test' } });
    fireEvent.change(getByLabelText('Select Service'), { target: { value: 'Test Service' } });
    fireEvent.click(getByText('Add Service'));
    expect(getByText('Test Service')).toBeInTheDocument();
    fireEvent.click(getByText('Remove Service'));
    expect(queryByText('Test Service')).not.toBeInTheDocument();
  });

  it('allows confirming payment', () => {
    const { getByText } = render(<CustomerAccounting />);
    fireEvent.click(getByText('Pay'));
    // Write expectations for confirming payment modal rendering
  });
});
