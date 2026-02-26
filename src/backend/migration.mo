import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";

module {
  type Segment = {
    segmentId : Nat;
    text : Text;
    score : Float;
    flagged : Bool;
    alternatives : [Text];
  };

  type CheckResult = {
    id : Nat;
    overallScore : Float;
    segments : [Segment];
  };

  type OldActor = {
    checkHistory : Map.Map<Nat, (CheckResult, { id : Nat; timestamp : Int; preview : Text; overallScore : Float; wordCount : Nat })>;
    nextId : Nat;
    plagiarismWords : [Text];
  };

  type NewActor = {
    segmentIdCounter : Nat;
    checkIdCounter : Nat;
    checkHistory : Map.Map<Nat, CheckResult>;
  };

  public func run(old : OldActor) : NewActor {
    let migratedCheckHistory = old.checkHistory.map<Nat, (CheckResult, { id : Nat; timestamp : Int; preview : Text; overallScore : Float; wordCount : Nat }), CheckResult>(
      func(_nat, tuple) { tuple.0 }
    );
    {
      segmentIdCounter = 0;
      checkIdCounter = 0;
      checkHistory = migratedCheckHistory;
    };
  };
};
