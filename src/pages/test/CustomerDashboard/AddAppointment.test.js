
import React from 'react';
import { configure, render, screen, fireEvent, act} from '@testing-library/react';
import AddAppointment from '../../CustomerDashboard/AddAppointment.js';
// 1. heading testing
configure({testIdAttribute :'id'})

test('heading of AddAppointment', () => {
  render(<AddAppointment />);
  const heading = screen.getByText('Add Appointment',{exact:false});
  const service1 = screen.getByText('Select Time');
  expect(heading).toBeInTheDocument();
  expect(service1).toBeInTheDocument();
//  const inputs = screen.getAllByTestId("myDate");
 
});

//2 testing of select option 
test('Select options', () => {
    render(<AddAppointment />);
    const options = screen.getAllByRole("option")
   for (let i=0;i<options.length;i++){
      expect(options[i]).toBeInTheDocument();
    }
// testing of label and input tag 
const inputfileds = screen.getAllByRole('textbox');
for(let i=0;i<inputfileds.length;i++){
expect(inputfileds[i]).toBeInTheDocument

}
  });



// 3  testing pf buttons
  test('all Buttons ',()=>{
    render(<AddAppointment/>)
        const btn1 =screen.getAllByRole("button");
  for(let i=0;i<btn1.length;i++){
    expect(btn1[i]).toBeInTheDocument();
  }
  });

// // 4  input filed
test('input filed',() => {
    render(<AddAppointment/>);
    const first = screen.getAllByTestId('myDate');
    for(let i=0;i<first.length;i++){
    expect(first[i]).toBeInTheDocument();
  
    }
     });

