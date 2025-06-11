import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, AlertTriangle } from "lucide-react";

interface BenchmarkControlsProps {
  inputSizes: string;
  setInputSizes: (value: string) => void;
  runBenchmark: () => void;
  isRunning: boolean;
  error: string | null;
}

export function BenchmarkControls({ inputSizes, setInputSizes, runBenchmark, isRunning, error }: Readonly<BenchmarkControlsProps>) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2">
        <Label htmlFor="input-sizes" className="mb-2 text-center">Input Sizes (comma-separated)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="input-sizes"
            value={inputSizes}
            onChange={(e) => setInputSizes(e.target.value)}
            placeholder="10,50,100,500,1000"
            className="max-w-xs"
          />
          <Button onClick={runBenchmark} disabled={isRunning} className="w-auto">
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running..." : "Run"}
          </Button>
        </div>
      </div>
      {error && (
        <div className="flex justify-center">
          <Alert variant="destructive" className="max-w-xs">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
} 