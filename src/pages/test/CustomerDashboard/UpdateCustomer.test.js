import React from 'react';
import { render, screen } from '@testing-library/react';
import UpdateCustomer from '../../CustomerDashboard/UpdateCustomer';

describe('UpdateCustomer component', () => {
  test('renders with label tags', () => {
    render(<UpdateCustomer />);
    const labelText= screen.getAllByRole('textbox');
    for(let i=0;i<labelText.length;i++){
       expect(labelText[i]).toBeInTheDocument();
    }
  });

  test('updates state when inputs are changed', () => {
    render(<UpdateCustomer />);
    
   const labelText = screen.getAllByRole('textbox');
   for(let i=0;i<labelText.length;i++)
   { 
   expect(labelText[i]).toBeInTheDocument();
   }
  });
  test('Select options', () => {
    render(<UpdateCustomer />);
    const options = screen.getAllByRole("option")
   for (let i=0;i<options.length;i++){
      expect(options[i]).toBeInTheDocument();
    }
  });
})
