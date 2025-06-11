// Utility functions for benchmarking algorithms

export function generateTestData(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * size));
}

export function measurePerformance(
  fn: (arr: number[]) => unknown,
  data: number[]
): number {
  const iterations = 5;
  let totalTime = 0;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn([...data]); // Clone to avoid mutations affecting subsequent runs
    const end = performance.now();
    totalTime += end - start;
  }

  return totalTime / iterations;
}

export function executeCode(code: string): (arr: number[]) => unknown {
  try {
    const wrappedCode = `
      (function() {
        ${code}
        return algorithm;
      })()
    `;
    return eval(wrappedCode);
  } catch (e) {
    throw new Error(
      `Code execution failed: ${
        e instanceof Error ? e.message : "Unknown error"
      }`
    );
  }
}
