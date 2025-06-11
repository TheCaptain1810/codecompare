"use client"

import { useState } from "react"
import responseGenerator from "@/lib/api/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Play, AlertTriangle, TrendingUp } from "lucide-react"
import { ModeToggle } from "@/utils/mode-toggle"

interface BenchmarkResult {
  inputSize: number
  runtime: number
  codeIndex: number
  codeName: string
}

interface CodeSnippet {
  name: string
  code: string
  complexityAnalysis?: string;
}

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
  const [results, setResults] = useState<BenchmarkResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("0")

  const generateTestData = (size: number): number[] => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * size))
  }

  const measurePerformance = (fn: (arr: number[]) => unknown, data: number[]): number => {
    const iterations = 5
    let totalTime = 0

    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      fn([...data]) // Clone to avoid mutations affecting subsequent runs
      const end = performance.now()
      totalTime += end - start
    }

    return totalTime / iterations
  }

  const executeCode = (code: string): (arr: number[]) => unknown => {
    try {
      const wrappedCode = `
        (function() {
          ${code}
          return algorithm;
        })()
      `
      return eval(wrappedCode)
    } catch (e) {
      throw new Error(`Code execution failed: ${e instanceof Error ? e.message : "Unknown error"}`)
    }
  }

  const analyzeComplexity = async (code: string, index: number) => {
    try {
      const res = await responseGenerator(code);
      console.log(`Analysis for algorithm ${index}:`, res);

      setCodeSnippets(prevSnippets => {
        const updated = [...prevSnippets];
        updated[index] = { ...updated[index], complexityAnalysis: res as string };
        return updated;
      });

      return res;
    } catch (err) {
      setError(`Complexity analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      return null;
    }
  }

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
  }

  const updateCodeSnippet = (index: number, field: keyof CodeSnippet, value: string) => {
    const updated = [...codeSnippets]
    updated[index] = { ...updated[index], [field]: value }
    setCodeSnippets(updated)
  }

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

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col justify-between items-center sm:flex-row mb-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Code Complexity Analyzer</h1>
          <p className="text-muted-foreground mb-2">Compare algorithm performance and visualize time complexity patterns</p>
        </div>

        <ModeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Code Snippets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                {codeSnippets.map((snippet, index) => (
                  <TabsTrigger key={snippet.name} value={index.toString()}>
                    {snippet.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {codeSnippets.map((snippet, index) => (
                <TabsContent key={snippet.name} value={index.toString()} className="space-y-4">
                  <div>
                    <Label htmlFor={`name-${index}`} className="mb-2">Algorithm Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={snippet.name}
                      onChange={(e) => updateCodeSnippet(index, "name", e.target.value)}
                      placeholder="Algorithm name"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`code-${index}`} className="mb-2">Code (must export &apos;algorithm&apos; function)</Label>
                    <Textarea
                      id={`code-${index}`}
                      value={snippet.code}
                      onChange={(e) => updateCodeSnippet(index, "code", e.target.value)}
                      placeholder="Enter your algorithm code here..."
                      className="font-mono text-sm min-h-[200px]"
                    />
                  </div>

                </TabsContent>
              ))}
            </Tabs>

            <div>
              <Label htmlFor="input-sizes" className="mb-2">Input Sizes (comma-separated)</Label>
              <Input
                id="input-sizes"
                value={inputSizes}
                onChange={(e) => setInputSizes(e.target.value)}
                placeholder="10,50,100,500,1000"
              />
            </div>

            <Button onClick={runBenchmark} disabled={isRunning} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running Benchmark..." : "Run Benchmark"}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="inputSize"
                        label={{ value: "Input Size", position: "insideBottom", offset: -5 }}
                      />
                      <YAxis label={{ value: "Runtime (ms)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      {codeSnippets.map((snippet, index) => (
                        <Line
                          key={snippet.name}
                          type="monotone"
                          dataKey={snippet.name}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Complexity Analysis</h4>
                  {codeSnippets.map((snippet) => (
                    <div key={snippet.name} className="flex flex-col p-2 bg-muted rounded">
                      <div className="flex flex-col justify-between items-center">
                        <span className="font-medium">{snippet.name}:</span>
                        <span className="text-sm">{snippet.complexityAnalysis ?? "Not analyzed yet"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Run a benchmark to see performance visualization</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Write your algorithms in the code editors above. Each must export a function named &apos;algorithm&apos;.</p>
          <p>2. The function should accept an array as input and return a result.</p>
          <p>3. Specify input sizes to test (e.g., 10,50,100,500,1000).</p>
          <p>4. Click &apos;Run Benchmark&apos; to measure performance across different input sizes.</p>
          <p>5. View the results in the chart to compare time complexity patterns.</p>
        </CardContent>
      </Card>
    </div>
  )
}
