import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DeleteAppointmentModal from '../../Appointment/DeleteAppointmentModal';

describe('DeleteAppointmentModal Component', () => {
  it('should render properly', () => {
    const { getByText } = render(<DeleteAppointmentModal />);
    expect(getByText('Do You Really Want to Delete Appointment?')).toBeInTheDocument();
  });

  it('should call DeleteItems function when "Yes" button is clicked', async () => {
    const { getByText } = render(<DeleteAppointmentModal />);
    const deleteButton = getByText('Yes');
    fireEvent.click(deleteButton);

  });

  it('should reload the page when "No" button is clicked', () => {
    // Mock the window.location.reload function
    const reloadMock = jest.fn();
    delete window.location;
    window.location = { reload: reloadMock };

    const { getByText } = render(<DeleteAppointmentModal />);
    const cancelButton = getByText('No');
    fireEvent.click(cancelButton);

    expect(reloadMock).toHaveBeenCalled();
  });
});
