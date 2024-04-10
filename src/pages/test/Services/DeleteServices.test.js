import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DeleteServices from '../../Services/DeleteServices';

describe('DeleteServices Component', () => {
  it('renders without crashing', () => {
    const props = {
      Service_id: 1,
      Service_Category: 'Test Category',
      Service_Name: 'Test Service'
    };

    const { getByText } = render(<DeleteServices {...props} />);
    
    // Assert that the component renders without crashing
    expect(getByText('Do you Really Wants to Delete that Service ?')).toBeInTheDocument();
  });

  it('calls DeleteItems function when "Yes" button is clicked', () => {
    const props = {
      Service_id: 1,
      Service_Category: 'Test Category',
      Service_Name: 'Test Service'
    };

    const { getByText } = render(<DeleteServices {...props} />);
    
    const yesButton = getByText('Yes');
    fireEvent.click(yesButton);

    // You can add more assertions here to verify the behavior
  });

  // Add more test cases as needed
});
