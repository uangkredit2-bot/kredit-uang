import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type Bill = {
    id : Nat;
    title : Text;
    amount : Nat;
    confirmationStatus : Text;
    paymentStatus : Text;
    paid : Bool;
    updatedAt : Nat;
  };

  type BillState = {
    var bill : Bill;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    billState : BillState;
  };

  public func migration(_old : {}) : NewActor {
    {
      accessControlState = AccessControl.initState();
      billState = {
        var bill = {
          id = 1;
          title = "TAGIHAN SAAT INI";
          amount = 1_200_000;
          confirmationStatus = "TERKONFIRMASI";
          paymentStatus = "Belum Lunas";
          paid = false;
          updatedAt = 0;
        };
      };
    };
  };
};
