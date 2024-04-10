import React from 'react';
import { render, screen } from '@testing-library/react';
import ViewBills from '../../CustomerDashboard/ViewBillsPrint';

describe('ViewBills component', () => {
  it('renders without crashing', () => {
    render(<ViewBills />);
  });

  it('displays the iframe with correct attributes', () => {
    const { getByTitle } = render(<ViewBills />);
    const iframeElement = getByTitle('Receipt');

    // Check if the iframe element exists
    expect(iframeElement).toBeInTheDocument();

    // Check attributes of the iframe element
    expect(iframeElement).toHaveAttribute('id', 'receipt');
    expect(iframeElement).toHaveAttribute('src', '/receiptPrint');
    expect(iframeElement).toHaveAttribute('frameBorder', '0');
    expect(iframeElement).toHaveStyle({
      overflow: 'hidden',
      display: 'none',
      position: 'absolute',
    });
  });
  });


