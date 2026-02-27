import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {
  type OldCheckRecord = {
    id : Nat;
    timestamp : Int;
    text : Text;
    plagiarismScore : Float;
    aiScore : Float;
    mode : Text;
    wordCount : Nat;
  };

  type OldActor = {
    checks : Map.Map<Nat, OldCheckRecord>;
    nextId : Nat;
  };

  type NewCheckRecord = {
    id : Nat;
    timestamp : Int;
    text : Text;
    plagiarismScore : Float;
    aiScore : Float;
    mode : Text;
    wordCount : Nat;
  };

  type Suggestion = {
    id : Nat;
    timestamp : Int;
    name : ?Text;
    message : Text;
  };

  type NewActor = {
    checks : Map.Map<Nat, NewCheckRecord>;
    suggestions : Map.Map<Nat, Suggestion>;
    nextCheckId : Nat;
    nextSuggestionId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      checks = old.checks;
      suggestions = Map.empty<Nat, Suggestion>();
      nextCheckId = old.nextId;
      nextSuggestionId = 1; // Start from 1 as there were no suggestions before
    };
  };
};
