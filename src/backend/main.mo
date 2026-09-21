import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import BillingApiMixin "mixins/billing-api";
import ApiDocMixin "mixins/api-doc";
import Types "types/billing";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let billState : { var bill : Types.Bill };

  include BillingApiMixin(billState);

  include ApiDocMixin();

  include Expose({ entities = [] });
};
