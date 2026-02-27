import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CheckRecord {
    id: bigint;
    wordCount: bigint;
    mode: string;
    text: string;
    plagiarismScore: number;
    timestamp: bigint;
    aiScore: number;
}
export interface Suggestion {
    id: bigint;
    name?: string;
    message: string;
    timestamp: bigint;
}
export interface backendInterface {
    deleteCheck(id: bigint): Promise<boolean>;
    deleteSuggestion(id: bigint): Promise<boolean>;
    getCheck(id: bigint): Promise<CheckRecord | null>;
    listChecks(): Promise<Array<CheckRecord>>;
    listSuggestions(): Promise<Array<Suggestion>>;
    saveCheck(text: string, plagiarismScore: number, aiScore: number, mode: string, wordCount: bigint): Promise<bigint>;
    submitSuggestion(name: string | null, message: string): Promise<bigint>;
}
