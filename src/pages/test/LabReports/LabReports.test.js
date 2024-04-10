import React from 'react';
import { render, screen } from '@testing-library/react';
import LabReports from '../../LabReports/LabReports';

test('renders "Lab Reports" as page title', () => {
  render(<LabReports />);

  const pageTitleElement = screen.getByText('Lab Reports');

  expect(pageTitleElement).toBeInTheDocument();

  expect(pageTitleElement).toHaveClass('page-title');
});
test('renders table headers correctly', () => {
    render(<LabReports />);
  
  
    const snoHeader = screen.getByText('S. No.');
    const reportCategoryHeader = screen.getByText('Report Category');
    const reportNameHeader = screen.getByText('Report Name');
    const calibrationTypeHeader = screen.getByText('Calibration Type');
    const actionHeader = screen.getByText('Action');
  
    expect(snoHeader).toBeInTheDocument();
    expect(reportCategoryHeader).toBeInTheDocument();
    expect(reportNameHeader).toBeInTheDocument();
    expect(calibrationTypeHeader).toBeInTheDocument();
    expect(actionHeader).toBeInTheDocument();
  });
