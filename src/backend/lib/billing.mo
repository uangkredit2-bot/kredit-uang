import Time "mo:core/Time";
import Types "../types/billing";

module {
  /// The single active bill seeded on first initialization.
  public func seed() : Types.Bill {
    {
      id = 1;
      title = "TAGIHAN SAAT INI";
      amount = 1_200_000;
      confirmationStatus = "TERKONFIRMASI";
      paymentStatus = "Belum Lunas";
      paid = false;
      updatedAt = 0;
    };
  };

  /// Project the internal bill onto the shared API view.
  public func toView(self : Types.Bill) : Types.BillView {
    {
      id = self.id;
      title = self.title;
      amount = self.amount;
      confirmationStatus = self.confirmationStatus;
      paymentStatus = self.paymentStatus;
      paid = self.paid;
      updatedAt = self.updatedAt;
    };
  };

  /// Mark the bill as paid and stamp the update time.
  public func markPaid(self : { var bill : Types.Bill }) : Types.BillView {
    self.bill := {
      id = self.bill.id;
      title = self.bill.title;
      amount = self.bill.amount;
      confirmationStatus = self.bill.confirmationStatus;
      paymentStatus = "Lunas";
      paid = true;
      updatedAt = Time.now().toNat();
    };
    toView(self.bill);
  };
};
