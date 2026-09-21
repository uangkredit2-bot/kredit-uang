import Common "../types/common";

module {
  /// A single active bill shown on the home screen.
  public type Bill = {
    id : Common.BillId;
    /// Display title, e.g. "TAGIHAN SAAT INI".
    title : Text;
    /// Amount in whole rupiah, e.g. 1_200_000.
    amount : Nat;
    /// Confirmation badge text, e.g. "TERKONFIRMASI".
    confirmationStatus : Text;
    /// Payment status text, e.g. "Belum Lunas" / "Lunas".
    paymentStatus : Text;
    /// Whether the bill has been marked as paid.
    paid : Bool;
    /// When the bill was last updated, in nanoseconds since the epoch.
    updatedAt : Common.Timestamp;
  };

  /// Shared view of a bill returned across the API boundary.
  public type BillView = {
    id : Common.BillId;
    title : Text;
    amount : Nat;
    confirmationStatus : Text;
    paymentStatus : Text;
    paid : Bool;
    updatedAt : Common.Timestamp;
  };
};
