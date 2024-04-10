import { render, screen } from "@testing-library/react";
import ConfirmPaymentModal from "../../Billing/ConfirmPaymentModal";
describe('update Appoiniment Component', () => {
    // 1. select option
  test('Select options', () => {
    render(<ConfirmPaymentModal />);
    const options = screen.getAllByRole("option")
   for (let i=0;i<options.length;i++){
      expect(options[i]).toBeInTheDocument();
    }

  });
  //  buttons
  test('Update Appoinment Button', () => {
    render(<ConfirmPaymentModal />);

    const UpdateButton = screen.getAllByRole('button')
    for(let i=0; i<UpdateButton.length;i++)
    expect (UpdateButton[i]).toBeInTheDocument();

  });

//  input and labal
test('inputs filed',() => {

  render(<ConfirmPaymentModal/>);
  const inputfileds = screen.getAllByRole('textbox');
  for(let i=0;i<inputfileds.length;i++){
  expect(inputfileds[i]).toBeInTheDocument();

  }
   });
});
    
