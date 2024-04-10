import React from "react";
import { render} from "@testing-library/react";
import DeleteBillModal from "../../CustomerDashboard/DeleteBillModal";

describe("DeleteBillModal", () => {
  it("renders modal with correct message and buttons", () => {
    const { getByText } = render(<DeleteBillModal receiptID="mockReceiptID" />);

    expect(getByText("Do You Really Want to Delete this Bill?")).toBeInTheDocument();

    expect(getByText("Yes")).toBeInTheDocument();
    expect(getByText("No")).toBeInTheDocument();
  });

});
