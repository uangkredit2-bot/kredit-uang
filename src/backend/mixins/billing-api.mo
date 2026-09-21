import BillingLib "../lib/billing";
import Types "../types/billing";

mixin (bill : { var bill : Types.Bill }) {
  /// Return the active bill for display on the home screen.
  public query func getActiveBill() : async Types.BillView {
    bill.bill.toView();
  };

  /// Mark the active bill as paid and return its latest state.
  public shared func payActiveBill() : async Types.BillView {
    bill.markPaid();
  };
};
