import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Segment {
    segmentId: bigint;
    text: string;
    score: number;
    alternatives: Array<string>;
    flagged: boolean;
}
export interface CheckSummary {
    id: bigint;
    overallScore: number;
    wordCount: bigint;
    preview: string;
    timestamp: bigint;
}
export interface CheckResult {
    id: bigint;
    overallScore: number;
    segments: Array<Segment>;
}
export interface backendInterface {
    deleteCheck(id: bigint): Promise<boolean>;
    getCheck(id: bigint): Promise<CheckResult | null>;
    getHistory(): Promise<Array<CheckSummary>>;
    submitCheck(text: string): Promise<CheckResult>;
}
