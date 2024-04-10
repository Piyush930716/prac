import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers
import AddReport from '../../LabReports/AddReport';
import { fireEvent } from '@testing-library/react';

describe('AddReport component', () => {

  test('displays correct report category and name', () => {
    const reportCategory = 'Some Category';
    const reportName = 'Some Report';
    render(<AddReport reportCategory={reportCategory} reportName={reportName} />);
    
    expect(screen.getByText(reportCategory)).toBeInTheDocument();
    expect(screen.getByText(reportName)).toBeInTheDocument();
  });
 

  test('handles button click event', () => {
  
    render(<AddReport />);
   
    const submitButton = screen.getByText('Submit');
   
    fireEvent.click(submitButton);

  });
  test('renders rows with correct data', () => {
    render(<AddReport />);
    const rows = screen.getAllByRole('row');
    // Assuming there are multiple rows with data
    expect(rows.length).toBeGreaterThan(0);  
  });



});
