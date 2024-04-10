import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomerDashboardForAppointment from '../../CustomerDashboard/CustomerDashboardForAppointment';

describe('CustomerDashboardForAppointment', () => {
  it('renders without crashing', () => {
    render(<CustomerDashboardForAppointment />);
  });

  it('displays customer information', () => {
    const props = {
      ptFirstName: 'John',
      ptLastName: 'Doe',
      ptContactNo: '1234567890',
      ptAge: 30,
      ptGender: 'Male',
      ptEmail: 'john@example.com',
      patientId: '123',
      referDoctorName: 'Dr. Smith',
      remarks: 'Some remarks',
      serviceDetails: [],
    };

    const { getByText } = render(<CustomerDashboardForAppointment {...props} />);

    expect(getByText(/John/)).toBeInTheDocument();
    expect(getByText(/Doe/)).toBeInTheDocument();
    expect(getByText(/30y/)).toBeInTheDocument();
    expect(getByText(/Male/)).toBeInTheDocument();
    expect(getByText(/1234567890 john@example.com/)).toBeInTheDocument();
    expect(getByText(/Refer By : Dr. Smith/)).toBeInTheDocument();
  });


  it('clicking on "Appt." button calls handlChangeAppt function', () => {
    const { getByText } = render(<CustomerDashboardForAppointment />);
    const apptButton = getByText('Appt.', 'Add Bills', 'Bills', 'Add Reports', 'View Reports', 'Edit', '');
  
    fireEvent.click(apptButton);
  
    // Add your assertions here to verify the expected behavior
  });
  
});
