import React from 'react';
import { render } from '@testing-library/react';
import ReceiptPrint from '../../Billing/ReceiptPrint';

it('renders an image with the correct source', () => {

  const { getByAltText } = render(<ReceiptPrint />);

  const imageElement = getByAltText('header image');
  expect(imageElement).toBeInTheDocument();
  expect(imageElement).toHaveAttribute('src');
});
