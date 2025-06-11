import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CodeSnippet, BenchmarkResult } from "@/lib/hooks/useBenchmark";

interface PerformanceChartProps {
  results: BenchmarkResult[];
  codeSnippets: CodeSnippet[];
  chartData: { inputSize: number;[key: string]: number }[];
}

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

export function PerformanceChart({ results, codeSnippets, chartData }: Readonly<PerformanceChartProps>) {
  return (
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
  );
} 