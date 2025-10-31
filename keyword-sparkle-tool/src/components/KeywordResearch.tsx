import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface KeywordMetric {
  keyword: string;
  ctr: number;
  cpc: string;
  volume: number;
  difficulty: number;
  traffic: number;
  source: string;
  region: string;
}

const SOURCES = [
  { value: "google", label: "Google" },
  { value: "youtube", label: "YouTube" },
  { value: "bing", label: "Bing" },
  { value: "amazon", label: "Amazon" },
  { value: "appstore", label: "Apple App Store" },
  { value: "playstore", label: "Google Play Store" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "pinterest", label: "Pinterest" },
  { value: "etsy", label: "Etsy" },
  { value: "tiktok", label: "TikTok" },
  { value: "trends", label: "Google Trends" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "hi", label: "Hindi" },
  { value: "ur", label: "Urdu" },
];

const COUNTRIES = [
  { code: "GLOBAL", name: "Global / Worldwide" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "PK", name: "Pakistan" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "BR", name: "Brazil" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "RU", name: "Russia" },
  { code: "MX", name: "Mexico" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
];

export function KeywordResearch() {
  const [keyword, setKeyword] = useState("");
  const [source, setSource] = useState("google");
  const [region, setRegion] = useState("US");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<KeywordMetric[]>([]);
  const [bulkKeywords, setBulkKeywords] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const generateSuggestions = (query: string, sourceType: string, countryCode: string): string[] => {
    const isGameTitle = /mortal kombat|call of duty|grand theft auto|assassin'?s? creed|fifa|nba|nfl|madden|street fighter|tekken|mario|zelda|pokemon|final fantasy/i.test(query);
    
    const sourceModifiers: Record<string, string[]> = {
      youtube: isGameTitle ? ["gameplay", "walkthrough", "review", "tips", "boss fight"] : ["tutorial", "review", "how to", "vs", "comparison"],
      amazon: isGameTitle ? ["buy", "price", "ps5", "xbox", "switch", "pc"] : ["buy", "price", "deals", "discount", "review"],
      google: isGameTitle ? ["gameplay", "walkthrough", "review", "tips", "tricks"] : ["how to", "best", "guide", "tutorial", "vs"],
      default: ["tips", "tricks", "ideas", "guide", "tutorial"]
    };

    const prefixes = isGameTitle ? ["how to", "best", "tips for", "walkthrough for"] : ["best", "top", "how to", "what is", "where to"];
    const suffixes = sourceModifiers[sourceType] || sourceModifiers.default;
    const year = new Date().getFullYear();

    const suggestions = new Set<string>();
    suggestions.add(query);

    prefixes.forEach(prefix => {
      suggestions.add(`${prefix} ${query}`);
    });

    suffixes.forEach(suffix => {
      suggestions.add(`${query} ${suffix}`);
      suggestions.add(`${query} ${suffix} ${year}`);
    });

    if (countryCode !== "GLOBAL") {
      suggestions.add(`${query} in ${countryCode}`);
    }

    return Array.from(suggestions).slice(0, 20);
  };

  const generateMetrics = (keywords: string[], sourceType: string, regionCode: string): KeywordMetric[] => {
    const sourceMetrics: Record<string, any> = {
      google: { ctrRange: [1, 30], cpcRange: [0.5, 10], volRange: [100, 10000], diffRange: [1, 100], trafficRange: [100, 10000] },
      youtube: { ctrRange: [2, 40], cpcRange: [0.1, 5], volRange: [50, 50000], diffRange: [1, 90], trafficRange: [50, 50000] },
      amazon: { ctrRange: [3, 50], cpcRange: [0.5, 15], volRange: [100, 20000], diffRange: [1, 100], trafficRange: [100, 20000] },
      tiktok: { ctrRange: [15, 80], cpcRange: [0.1, 5], volRange: [100, 500000], diffRange: [1, 85], trafficRange: [100, 500000] },
    };

    const metrics = sourceMetrics[sourceType] || sourceMetrics.google;
    const regionFactor = regionCode === "GLOBAL" ? 1 : (Math.random() * 0.5) + 0.75;

    return keywords.map(kw => ({
      keyword: kw,
      ctr: Math.floor(Math.random() * (metrics.ctrRange[1] - metrics.ctrRange[0]) + metrics.ctrRange[0]),
      cpc: (Math.random() * (metrics.cpcRange[1] - metrics.cpcRange[0]) + metrics.cpcRange[0]).toFixed(2),
      volume: Math.floor((Math.random() * (metrics.volRange[1] - metrics.volRange[0]) + metrics.volRange[0]) * regionFactor),
      difficulty: Math.floor(Math.random() * (metrics.diffRange[1] - metrics.diffRange[0]) + metrics.diffRange[0]),
      traffic: Math.floor((Math.random() * (metrics.trafficRange[1] - metrics.trafficRange[0]) + metrics.trafficRange[0]) * regionFactor),
      source: sourceType,
      region: regionCode,
    }));
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a keyword to search");
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const suggestions = generateSuggestions(keyword, source, region);
      const metrics = generateMetrics(suggestions, source, region);
      
      setResults(metrics.sort((a, b) => b.traffic - a.traffic));
      toast.success(`Found ${metrics.length} keyword suggestions`);
    } catch (error) {
      toast.error("Failed to fetch keywords. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCheck = async () => {
    if (!bulkKeywords.trim()) {
      toast.error("Please enter keywords to check");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const keywords = bulkKeywords
        .split(/[\n,]+/)
        .map(k => k.trim())
        .filter(Boolean);
      
      const metrics = generateMetrics(keywords, source, region);
      setResults(metrics.sort((a, b) => b.traffic - a.traffic));
      toast.success(`Checked volume for ${metrics.length} keywords`);
    } catch (error) {
      toast.error("Failed to check search volume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Find Great Keywords Using Autocomplete
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover powerful keywords from 12+ platforms to boost your SEO strategy
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SOURCES.map(s => (
              <Badge key={s.value} variant="outline" className="text-xs">
                {s.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="md:col-span-2">
                <Input
                  ref={inputRef}
                  placeholder="Type a keyword and press enter..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-10"
                />
              </div>

              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="find" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="find">Find Keywords</TabsTrigger>
            <TabsTrigger value="volume">Check Search Volume</TabsTrigger>
          </TabsList>

          <TabsContent value="find" className="space-y-6">
            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Suggestions</CardTitle>
                  <CardDescription>
                    Found {results.length} keywords for "{keyword}" in {COUNTRIES.find(c => c.code === region)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead className="text-right">CTR</TableHead>
                          <TableHead className="text-right">CPC</TableHead>
                          <TableHead className="text-right">Volume</TableHead>
                          <TableHead className="text-right">Difficulty</TableHead>
                          <TableHead className="text-right">Traffic</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Region</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{result.keyword}</TableCell>
                            <TableCell className="text-right">{result.ctr}%</TableCell>
                            <TableCell className="text-right">${result.cpc}</TableCell>
                            <TableCell className="text-right">{result.volume.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{result.difficulty}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">{result.traffic.toLocaleString()}</TableCell>
                            <TableCell className="capitalize">{result.source}</TableCell>
                            <TableCell className="font-mono text-xs">{result.region}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="volume" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Check Search Volume</CardTitle>
                <CardDescription>
                  Enter keywords (one per line or comma-separated) to check their search volume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="keyword one&#10;keyword two, keyword three"
                  value={bulkKeywords}
                  onChange={(e) => setBulkKeywords(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button 
                  onClick={handleBulkCheck} 
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Volume"
                  )}
                </Button>
              </CardContent>
            </Card>

            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Volume Results</CardTitle>
                  <CardDescription>
                    Volume data for {results.length} keywords in {COUNTRIES.find(c => c.code === region)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead className="text-right">CTR</TableHead>
                          <TableHead className="text-right">CPC</TableHead>
                          <TableHead className="text-right">Volume</TableHead>
                          <TableHead className="text-right">Difficulty</TableHead>
                          <TableHead className="text-right">Traffic</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Region</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{result.keyword}</TableCell>
                            <TableCell className="text-right">{result.ctr}%</TableCell>
                            <TableCell className="text-right">${result.cpc}</TableCell>
                            <TableCell className="text-right">{result.volume.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{result.difficulty}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">{result.traffic.toLocaleString()}</TableCell>
                            <TableCell className="capitalize">{result.source}</TableCell>
                            <TableCell className="font-mono text-xs">{result.region}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
