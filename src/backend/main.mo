import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Migration "migration";
(with migration = Migration.run)
actor {
  type CheckRecord = {
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

  var nextCheckId = 1;
  var nextSuggestionId = 1;

  let checks = Map.empty<Nat, CheckRecord>();
  let suggestions = Map.empty<Nat, Suggestion>();

  // Helper function to truncate text to a maximum length
  func truncateText(text : Text, maxLength : Nat) : Text {
    if (text.size() <= maxLength) { return text };
    Text.fromIter(text.toIter().take(maxLength));
  };

  // Check History Functions
  public shared ({ caller }) func saveCheck(text : Text, plagiarismScore : Float, aiScore : Float, mode : Text, wordCount : Nat) : async Nat {
    let id = nextCheckId;

    let record : CheckRecord = {
      id;
      timestamp = Time.now();
      text = truncateText(text, 2000);
      plagiarismScore;
      aiScore;
      mode;
      wordCount;
    };

    checks.add(id, record);
    nextCheckId += 1;
    id;
  };

  public query ({ caller }) func listChecks() : async [CheckRecord] {
    checks.values().toArray();
  };

  public query ({ caller }) func getCheck(id : Nat) : async ?CheckRecord {
    checks.get(id);
  };

  public shared ({ caller }) func deleteCheck(id : Nat) : async Bool {
    let existed = checks.containsKey(id);
    checks.remove(id);
    existed;
  };

  // Suggestion Feature Functions
  public shared ({ caller }) func submitSuggestion(name : ?Text, message : Text) : async Nat {
    let id = nextSuggestionId;

    let suggestion : Suggestion = {
      id;
      timestamp = Time.now();
      name;
      message;
    };

    suggestions.add(id, suggestion);
    nextSuggestionId += 1;
    id;
  };

  public query ({ caller }) func listSuggestions() : async [Suggestion] {
    suggestions.values().toArray();
  };

  public shared ({ caller }) func deleteSuggestion(id : Nat) : async Bool {
    let existed = suggestions.containsKey(id);
    suggestions.remove(id);
    existed;
  };
};
