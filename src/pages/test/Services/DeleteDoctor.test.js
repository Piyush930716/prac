import React from 'react';
import { render, fireEvent,screen } from '@testing-library/react';
import DeleteDoctor from '../../Services/DeleteDoctor';

describe('DeleteDoctor Component', () => {
  it('confirm delete modal text', () => {
    // Render the DeleteDoctor component
    render(<DeleteDoctor  />);
  
    // Check if the modal text is rendered correctly
    const deleteModalText = screen.getByText(/Do you really wants to delete that Doctor ?/i);
    expect(deleteModalText).toBeInTheDocument();
  }); 
  it('calls DeleteItems function when "Yes" button is clicked', () => {
    const props = {
      referral_Id: 1,
      ctrReferName: 'Test Doctor'
    };

    const { getByText } = render(<DeleteDoctor {...props} />);
    
    const yesButton = getByText('Yes');
    fireEvent.click(yesButton);

    // You can add more assertions here to verify the behavior
  });

  // Add more test cases as needed
});
