import React from 'react';
import { render, fireEvent, getByTitle } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LabReportPrint from '../../LabReports/LabReportPrint';

describe('LabReportPrint Component', () => {

  test('calls handleClose when "x" button is clicked', () => {
    // Mock handleClose function
    const handleClose = jest.fn();
    const show = true;
    const responseToPostHeader = 'header.pdf';
    const responseToPostFooter = 'footer.pdf';
    const signature = 'signature.pdf';

    // Render the component with props
    const { getByText } = render(
      <LabReportPrint
        handleClose={handleClose}
        show={show}
        responseToPostHeader={responseToPostHeader}
        responseToPostFooter={responseToPostFooter}
        signature={signature}
      />
    );
    fireEvent.click(getByText('x'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('renders embedded elements with correct attributes', () => {
    const responseToPostHeader = 'header.pdf'; // Mock data for responseToPostHeader
    const responseToPostFooter = 'footer.pdf'; // Mock data for responseToPostFooter
    const signature = 'signature.pdf'; // Mock data for signature

    // Render the component with mock data
    const { getByRole, getByTestId } = render(
      <LabReportPrint
        responseToPostHeader={responseToPostHeader}
        responseToPostFooter={responseToPostFooter}
        signature={signature}
      />
    );

    // Test the embedded elements
    const headerEmbed = getByTestId('header-embed');
    expect(headerEmbed).toHaveAttribute('src', responseToPostHeader);
    expect(headerEmbed).toHaveAttribute('width', '1100px');
    expect(headerEmbed).toHaveAttribute('height', '90px');

    const signatureEmbed = getByTestId('signature-embed');
    expect(signatureEmbed).toHaveAttribute('src', signature);
    expect(signatureEmbed).toHaveAttribute('width', '150px');
    expect(signatureEmbed).toHaveAttribute('height', '80px');

    const footerEmbed = getByTestId('footer-embed');
    expect(footerEmbed).toHaveAttribute('src', responseToPostFooter);
    expect(footerEmbed).toHaveAttribute('width', '1100px');
    expect(footerEmbed).toHaveAttribute('height', '60px');
  });
});
