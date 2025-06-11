import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { CodeSnippet } from "@/lib/hooks/useBenchmark";
import { BenchmarkControls } from "@/components/benchmark-controls";

interface CodeSnippetTabsProps {
  codeSnippets: CodeSnippet[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setCodeSnippets: React.Dispatch<React.SetStateAction<CodeSnippet[]>>;
  inputSizes: string;
  setInputSizes: (value: string) => void;
  runBenchmark: () => void;
  isRunning: boolean;
  error: string | null;
}

export function CodeSnippetTabs({
  codeSnippets,
  activeTab,
  setActiveTab,
  setCodeSnippets,
  inputSizes,
  setInputSizes,
  runBenchmark,
  isRunning,
  error,
}: Readonly<CodeSnippetTabsProps>) {
  return (
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
              <TabsTrigger key={index} value={index.toString()}>
                {snippet.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {codeSnippets.map((snippet, index) => (
            <TabsContent key={index} value={index.toString()} className="space-y-4">
              <div>
                <Label htmlFor={`name-${index}`} className="mb-2">Algorithm Name</Label>
                <Input
                  id={`name-${index}`}
                  value={snippet.name}
                  onChange={(e) => setCodeSnippets(prevSnippets => {
                    const updated = [...prevSnippets];
                    updated[index] = { ...updated[index], name: e.target.value };
                    return updated;
                  })}
                  placeholder="Algorithm name"
                />
              </div>

              <div>
                <Label htmlFor={`code-${index}`} className="mb-2">Code (must export &apos;algorithm&apos; function)</Label>
                <Textarea
                  id={`code-${index}`}
                  value={snippet.code}
                  onChange={(e) => setCodeSnippets(prevSnippets => {
                    const updated = [...prevSnippets];
                    updated[index] = { ...updated[index], code: e.target.value };
                    return updated;
                  })}
                  placeholder="Enter your algorithm code here..."
                  className="font-mono text-sm min-h-[200px] w-full"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <BenchmarkControls
          inputSizes={inputSizes}
          setInputSizes={setInputSizes}
          runBenchmark={runBenchmark}
          isRunning={isRunning}
          error={error}
        />
      </CardContent>
    </Card>
  );
}
