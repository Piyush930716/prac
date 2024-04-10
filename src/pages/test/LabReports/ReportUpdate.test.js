import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportUpdate from '../../LabReports/ReportUpdate';

// Mocking the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ Items: [{ report_value: [] }] }),
  })
);

describe('ReportUpdate component', () => {
  test('renders without crashing', () => {
    render(<ReportUpdate />);

  });    

  test('handles update button click', async () => {
    render(<ReportUpdate />);
    const button = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(button);
   
  });

});
