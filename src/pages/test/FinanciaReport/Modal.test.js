import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Modal from '../../FinancialReport/Modal';

test('Modal renders correctly', () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <Modal handleClose={handleClose} show={true}>
      <div>Modal content</div>
    </Modal>
  );

  expect(getByText('Modal content')).toBeInTheDocument();
});

test('Modal close button calls handleClose function', () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <Modal handleClose={handleClose} show={true}>
      <div>Modal content</div>
    </Modal>
  );

  fireEvent.click(getByText('x'));
  expect(handleClose).toHaveBeenCalledTimes(1);
});
