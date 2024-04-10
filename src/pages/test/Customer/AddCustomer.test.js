import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCustomer from '../../Customer/AddCustomer';

describe('AddCustomer Component', () => {
// 1. heading
    test('renders without errors', () => {
    render(<AddCustomer />);
    expect(screen.getByText('Add Customer')).toBeInTheDocument();
  });
// 2. input and labal

test('inputs filed',() => {
    render(<AddCustomer />);
    const inputfileds = screen.getAllByRole('textbox');
    for(let i=0;i<inputfileds.length;i++){
    expect(inputfileds[i]).toHaveClass('form-control');
  
    }
     });
  //3. select option
  test('Select options', () => {
    render(<AddCustomer />);
    const options = screen.getAllByRole("option")
   for (let i=0;i<options.length;i++){
      expect(options[i]).toBeInTheDocument();
    }

  });

// 4. button
  test('handles patient submission', () => {
    render(<AddCustomer />);
    const registerButton = screen.getByText('Register Customer');
    fireEvent.click(registerButton);

  });
});

































// import {  render, screen} from "@testing-library/react";
// import AddCustomer from "./AddCustomer";

// test('test header point of form', () => {
//     render(< AddCustomer />);
//    const head = screen.getByText('Add Customer');
// expect(head).toBeInTheDocument();
// });