import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  type CheckSummary = {
    id : Nat;
    timestamp : Int;
    preview : Text;
    overallScore : Float;
    wordCount : Nat;
  };

  var segmentIdCounter : Nat = 0;

  var checkIdCounter : Nat = 0;

  let checkHistory = Map.empty<Nat, CheckResult>();

  func getNextSegmentId() : Nat {
    let currentId = segmentIdCounter;
    segmentIdCounter += 1;
    currentId;
  };

  func splitIntoSegments(text : Text) : [Text] {
    [text];
  };

  func computeSimilarity(segmentText : Text) : Float {
    var score : Float = 0.8;
    score;
  };

  func generateAlternatives(segmentText : Text) : [Text] {
    ["Alternative 1 for: " # segmentText, "Alternative 2 for: " # segmentText];
  };

  public shared ({ caller }) func submitCheck(text : Text) : async CheckResult {
    checkIdCounter += 1;

    let segments = splitIntoSegments(text);

    let processedSegments = segments.map(
      func(segmentText) {
        let similarityScore = computeSimilarity(segmentText);
        let flagged = similarityScore > 0.15;
        let segmentId = getNextSegmentId();
        var alternatives : [Text] = [];

        if (flagged) {
          alternatives := generateAlternatives(segmentText);
        };

        {
          segmentId;
          text = segmentText;
          score = similarityScore;
          flagged;
          alternatives;
        };
      }
    );

    let overallScore = processedSegments.map(
      func(segment) {
        segment.score;
      }
    ).foldLeft(0.0, Float.add) / processedSegments.size().toFloat();

    let checkResult = {
      id = checkIdCounter;
      overallScore;
      segments = processedSegments;
    };

    checkHistory.add(checkIdCounter, checkResult);

    checkResult;
  };

  public query ({ caller }) func getHistory() : async [CheckSummary] {
    checkHistory.keys().toArray().map(
      func(_) {
        {
          id = 0;
          timestamp = 0;
          preview = "empty";
          overallScore = 0.2;
          wordCount = 100;
        };
      }
    );
  };

  public query ({ caller }) func getCheck(id : Nat) : async ?CheckResult {
    checkHistory.get(id);
  };

  public shared ({ caller }) func deleteCheck(id : Nat) : async Bool {
    if (checkHistory.containsKey(id)) {
      checkHistory.remove(id);
      true;
    } else {
      false;
    };
  };
};
