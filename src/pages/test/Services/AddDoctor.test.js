import { render, screen } from '@testing-library/react';
import DoctorAdd from '../../Services/AddDoctor';
import { BrowserRouter } from 'react-router-dom';

test('label is associated with input radio button', () => {
  render(<BrowserRouter><DoctorAdd /></BrowserRouter>);

  // Find the label element
  const labelElement = screen.getAllByRole('textbox');
for(let i=0;i<labelElement.length;i++)
{
  expect(labelElement[i]).toBeInTheDocument();
}

});
test('Select options', () => {
  render(<BrowserRouter><DoctorAdd /></BrowserRouter>);

  // Find the label element
  const options = screen.getAllByRole('option');
for(let i=0;i<options.length;i++)
{
  expect(options[i]).toBeInTheDocument();
}

});
