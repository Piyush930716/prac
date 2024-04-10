import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportSearch from '../../LabReports/ReportSearch';

describe('ReportSearch component', () => {
  test('renders page title', () => {
    render(<ReportSearch />);
    const pageTitle = screen.getByText('Report Search');
    expect(pageTitle).toBeInTheDocument();
    expect(pageTitle.tagName).toBe('H4');
    expect(pageTitle).toHaveClass('page-title');
  });
  test('ReportSearch component renders table header with correct columns', () => {
    render(<ReportSearch />);
  
    const tableHeaderRow = screen.getByRole('row');

    expect(tableHeaderRow).toBeInTheDocument();
  });

  test('renders table header with correct columns', () => {
    // Render the ReportSearch component
    render(<ReportSearch />);
  
    // Assert the presence of each table header column
    const columnHeaders = ['#', 'Report Category', 'Report Name', 'Calibration Type', 'Date', 'Action'];
    columnHeaders.forEach(headerText => {
      const columnHeader = screen.getByText(headerText);
      expect(columnHeader).toBeInTheDocument();
    });
  });
});
