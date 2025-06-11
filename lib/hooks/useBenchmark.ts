import { useState } from "react";
import { generateTestData, measurePerformance, executeCode } from "@/lib/benchmarkUtils";

export interface BenchmarkResult {
  inputSize: number;
  runtime: number;
  codeIndex: number;
  codeName: string;
}

export interface CodeSnippet {
  name: string;
  code: string;
  complexityAnalysis?: string;
}

interface UseBenchmarkProps {
  codeSnippets: CodeSnippet[];
  inputSizes: string;
  analyzeComplexity: (code: string, index: number) => Promise<unknown>;
}

export function useBenchmark({ codeSnippets, inputSizes, analyzeComplexity }: UseBenchmarkProps) {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runBenchmark = async () => {
    setIsRunning(true);
    setError(null);
    setResults([]);

    try {
      const sizes = inputSizes
        .split(",")
        .map((s) => Number.parseInt(s.trim()))
        .filter((n) => !isNaN(n));

      if (sizes.length === 0) {
        throw new Error("Please provide valid input sizes");
      }

      const newResults: BenchmarkResult[] = [];

      for (let i = 0; i < codeSnippets.length; i++) {
        const snippet = codeSnippets[i];
        if (!snippet.code.trim()) continue;

        try {
          await analyzeComplexity(snippet.code, i);
          const fn = executeCode(snippet.code);

          for (const size of sizes) {
            const testData = generateTestData(size);
            const runtime = measurePerformance(fn, testData);

            newResults.push({
              inputSize: size,
              runtime,
              codeIndex: i,
              codeName: snippet.name,
            });
          }
        } catch (e) {
          throw new Error(`Error in ${snippet.name}: ${e instanceof Error ? e.message : "Unknown error"}`);
        }
      }

      setResults(newResults);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  return { results, isRunning, error, runBenchmark };
} 