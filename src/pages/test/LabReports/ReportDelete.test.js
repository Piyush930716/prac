import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportDelete from '../../LabReports/ReportDelete';

test('renders delete confirmation message', () => {
  render(<ReportDelete reportID="123" />);

  const confirmationMessage = screen.getByText(/Do you really want to delete this report?/i);
  expect(confirmationMessage).toBeInTheDocument();
});

test('calls DeleteItems function when "Yes" button is clicked', () => {
  render(<ReportDelete reportID="123" />);

  const yesButton = screen.getByText(/Yes/i);
  fireEvent.click(yesButton);

  const noButton = screen.getByText(/No/i);
  fireEvent.click(noButton);
});


