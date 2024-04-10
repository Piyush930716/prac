import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import UpdateAppointment from '../../Appointment/UpdateAppointment';

describe('UpdateAppointment component', () => {
  it('renders without crashing', () => {
    render(<UpdateAppointment />);
  });

  it('updates state when Select Time is changed', () => {
    const { getByLabelText } = render(<UpdateAppointment />);
    const selectTimeSelect = getByLabelText('Select Time');
    
    fireEvent.change(selectTimeSelect, { target: { value: '10' } });

    expect(selectTimeSelect.value).toBe('10');
  });

  it('inputs filed',() => {
   
    const {getAllByRole} = render(<UpdateAppointment />);

    for(let i=0;i<{getAllByRole}.length;i++){
    expect( getAllByRole('textbox'[i])).toHaveClass('form-control');
  
    }
     });

  it('clears state when Clear button is clicked', () => {
    const { getByText, getByLabelText } = render(<UpdateAppointment />);
    const clearButton = getByText('Clear');
    const selectTimeSelect = getByLabelText('Select Time');
    fireEvent.click(clearButton);
    expect(selectTimeSelect.value).toBe('');
  });
});
