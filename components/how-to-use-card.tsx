import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HowToUseCard() {
  return (
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
  );
} 