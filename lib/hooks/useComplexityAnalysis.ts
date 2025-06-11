import { CodeSnippet } from "./useBenchmark";

export function useComplexityAnalysis(
  setCodeSnippets: React.Dispatch<React.SetStateAction<CodeSnippet[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  responseGenerator: (code: string) => Promise<unknown>
) {
  const analyzeComplexity = async (code: string, index: number) => {
    try {
      const res = await responseGenerator(code);
      setCodeSnippets((prevSnippets) => {
        const updated = [...prevSnippets];
        updated[index] = {
          ...updated[index],
          complexityAnalysis: res as string,
        };
        return updated;
      });
      return res;
    } catch (err) {
      setError(
        `Complexity analysis failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      return null;
    }
  };

  return { analyzeComplexity };
}
