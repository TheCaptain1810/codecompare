"use client"

import { useState, useRef, useEffect } from "react"
import responseGenerator from "@/lib/api/api"
import { ModeToggle } from "@/components/mode-toggle"
import { useBenchmark, CodeSnippet } from "@/lib/hooks/useBenchmark"
import { useComplexityAnalysis } from "@/lib/hooks/useComplexityAnalysis"
import { CodeSnippetTabs } from "@/components/code-snippet-tabs"
import { HowToUseCard } from "@/components/how-to-use-card"
import { PerformanceChart } from "@/components/performance-chart"

export default function CodeComplexityAnalyzer() {
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([
    {
      name: "Algorithm A",
      code: `// Linear search
function algorithm(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr.length - 1) count++;
  }
  return count;
}`,
    },
    {
      name: "Algorithm B",
      code: `// Nested loop approach
function algorithm(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i === j) count++;
    }
  }
  return count;
}`,
    },
  ])

  const [inputSizes, setInputSizes] = useState("10,50,100,500,1000")
  const [activeTab, setActiveTab] = useState("0")
  const [error, setError] = useState<string | null>(null)

  // Use the complexity analysis hook
  const { analyzeComplexity } = useComplexityAnalysis(setCodeSnippets, setError, responseGenerator)

  // Use the benchmark hook
  const { results, isRunning, runBenchmark } = useBenchmark({
    codeSnippets,
    inputSizes,
    analyzeComplexity,
  })

  const chartData = results.reduce((acc, result) => {
    const existing = acc.find((item) => item.inputSize === result.inputSize)
    if (existing) {
      existing[result.codeName] = result.runtime
    } else {
      acc.push({
        inputSize: result.inputSize,
        [result.codeName]: result.runtime,
      })
    }
    return acc
  }, [] as { inputSize: number;[key: string]: number }[])

  const performanceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (results.length > 0 && performanceRef.current) {
      performanceRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [results])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col justify-between items-center sm:flex-row mb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Code Complexity Analyzer</h1>
          <p className="text-muted-foreground mb-2">Compare algorithm performance and visualize time complexity patterns</p>
        </div>
        <ModeToggle />
      </div>
      <div className="space-y-6">
        <CodeSnippetTabs
          codeSnippets={codeSnippets}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCodeSnippets={setCodeSnippets}
          inputSizes={inputSizes}
          setInputSizes={setInputSizes}
          runBenchmark={runBenchmark}
          isRunning={isRunning}
          error={error}
        />
        {results.length > 0 && (
          <div ref={performanceRef}>
            <PerformanceChart
              results={results}
              codeSnippets={codeSnippets}
              chartData={chartData}
            />
          </div>
        )}
      </div>
      <HowToUseCard />
    </div>
  )
}