
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import AddServices from '../../Services/AddServices';
import { BrowserRouter } from 'react-router-dom';

describe('AddServices Component', () => {
  test('renders Add Services page title', () => {
    render(<BrowserRouter><AddServices /></BrowserRouter>);
    const pageTitleElement = screen.getAllByRole('heading');
    for(let i=0;i<pageTitleElement.length;i++){
    expect(pageTitleElement[i]).toBeInTheDocument();
    }
  });

  test('Select options', () => {
    render(<BrowserRouter><AddServices /></BrowserRouter>);
  
    // Find the label element
    const options = screen.getAllByRole('option');
  for(let i=0;i<options.length;i++)
  {
    expect(options[i]).toBeInTheDocument();
  }
  
  });
  test('label is associated with input radio button', () => {
    render(<BrowserRouter><AddServices/></BrowserRouter>);
  
    // Find the label element
    const labelElement = screen.getAllByRole('textbox');
  for(let i=0;i<labelElement.length;i++)
  {
    expect(labelElement[i]).toBeInTheDocument();
  }
  
  });
  test('renders table headers', () => {
    render(<BrowserRouter><AddServices/></BrowserRouter>);

    const table = screen.getByTestId('myTable'); // Replace 'your-table-id' with the actual ID of your table
    const serviceIdHeader = within(table).getByText('Service ID');
    const serviceCategoryHeader = within(table).getByText('Service Category');
    const serviceNameHeader = within(table).getByText('Service Name');
    const serviceCostHeader = within(table).getByText('Service Cost');
    const actionHeader = within(table).getByText('Action');

    expect(serviceIdHeader).toBeInTheDocument();
    expect(serviceCategoryHeader).toBeInTheDocument();
    expect(serviceNameHeader).toBeInTheDocument();
    expect(serviceCostHeader).toBeInTheDocument();
    expect(actionHeader).toBeInTheDocument();
  });

});
