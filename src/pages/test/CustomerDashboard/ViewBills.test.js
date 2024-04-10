import React from 'react';
import { render, screen } from '@testing-library/react';
import ViewBills from '../../CustomerDashboard/ViewBills';

describe('YourComponent', () => {
  it('renders table headers correctly', () => {
    // Render the component
    render(<ViewBills />);

    // Assert that each table header is rendered with the correct text
    expect(screen.getByText('Receipt ID')).toBeInTheDocument();
    expect(screen.getByText('Bill Amount')).toBeInTheDocument();
    expect(screen.getByText('Paid Amount')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText('Payment Mode')).toBeInTheDocument();
    expect(screen.getByText('Date of Bill')).toBeInTheDocument();
    expect(screen.getByText('Remaining Pay')).toBeInTheDocument();
    expect(screen.getByText('#')).toBeInTheDocument();
  }); 

  it('does not render the envelope button when ptEmail prop is false', () => {
    const { queryByText } = render(<ViewBills ptEmail={false} />);
    const envelopeButton = queryByText('Envelope');
    expect(envelopeButton).not.toBeInTheDocument();
  });

});
