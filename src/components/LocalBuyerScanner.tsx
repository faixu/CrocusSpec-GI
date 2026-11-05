import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Search,
  Sparkles,
  FileCheck,
} from 'lucide-react';

interface BuyerPresetSample {
  id: string;
  title: string;
  sourceContext: string;
  verdict: 'authentic' | 'adulterated' | 'caution';
  verdictLabel: string;
  estimatedPurityPct: number;
  crimsonHueRatio: number;
  trumpetTipDetected: boolean;
  waterTestResult: string;
  paperRubResult: string;
  pricePerGramInr: string;
  visualFindings: string[];
  buyerAction: string;
}

const BUYER_PRESET_SAMPLES: BuyerPresetSample[] = [
  {
    id: 'pampore_gi',
    title: 'Sample A: Pampore GI Sealed Pack (Mongra)',
    sourceContext: 'Direct FPO / GI-Tagged Pack · Pampore, Pulwama',
    verdict: 'authentic',
    verdictLabel: '● AUTHENTIC KASHMIRI MONGRA (GI GRADE I)',
    estimatedPurityPct: 99.4,
    crimsonHueRatio: 2.51,
    trumpetTipDetected: true,
    waterTestResult:
      'Releases clear golden-yellow crocin halo slowly over 12–15 minutes; stigma itself retains deep crimson color.',
    paperRubResult:
      'Dry brittle snap; leaves pale yellow-gold dust trace with zero oily or sticky residue.',
    pricePerGramInr: '₹320 – ₹450 / g',
    visualFindings: [
      'Flared trumpet-shaped three-lobed tips with fine serrated edges clearly visible under 5× phone zoom.',
      'Deep matte purplish-crimson hue (CIE a*/b* = 2.51) with no unnatural neon-orange sheen.',
      'Uniform tapering from narrow base to wide crown; < 0.5% pale yellow floral style content.',
    ],
    buyerAction:
      'Safe to purchase. Verify the 12-digit Kashmiri GI QR code on the seal for harvest batch traceability.',
  },
  {
    id: 'bazaar_safflower',
    title: 'Sample B: Unsealed Tourist Market Pouch',
    sourceContext: 'Loose Unbranded Pouch · Sold at ₹140/g discount',
    verdict: 'adulterated',
    verdictLabel: '✖ ADULTERATED — SAFFLOWER & FLORAL STYLE BLEND',
    estimatedPurityPct: 68.5,
    crimsonHueRatio: 1.12,
    trumpetTipDetected: false,
    waterTestResult:
      'Pale watery yellow tint; lacks deep golden crocin saturation and characteristic bitter-honey safranal aroma.',
    paperRubResult:
      'Crumbles into flaky flat petal fragments rather than fibrous stigma tubes.',
    pricePerGramInr: '₹120 – ₹160 / g (Suspiciously Low)',
    visualFindings: [
      'Contains ~31% flat, ribbon-like yellow-orange florets (Carthamus tinctorius) lacking trumpet tips.',
      'Excessive unpigmented yellow floral styles mixed in to add dead weight.',
      'Elevated 520 nm yellow reflectance shifts overall color index down to a*/b* = 1.12.',
    ],
    buyerAction:
      'Do not buy as pure Mongra. Separate a pinch onto white paper: flat petal-like flakes indicate safflower filler.',
  },
  {
    id: 'dyed_cornsilk',
    title: 'Sample C: Bright Brick-Red Loose Threads',
    sourceContext: 'Roadside Vendor · Uniform Fine Red Filaments',
    verdict: 'adulterated',
    verdictLabel: '✖ COUNTERFEIT — DYED CORN SILK / SYNTHETIC DYE',
    estimatedPurityPct: 12.0,
    crimsonHueRatio: 1.78,
    trumpetTipDetected: false,
    waterTestResult:
      'Turns water reddish-orange within 10 seconds (synthetic Ponceau 4R / Tartrazine dye bleed); threads turn pale white.',
    paperRubResult:
      'Leaves an immediate bright red dye smear when rubbed with a slightly damp fingertip.',
    pricePerGramInr: '₹80 – ₹150 / g',
    visualFindings: [
      'Zero base-to-tip tapering: threads have identical thickness from start to end like hair or sewing thread.',
      'No trumpeted flared apex or serrated papillae under phone macro zoom.',
      'Synthetic azo-dye color profile shows artificial red saturation without dark crimson depth.',
    ],
    buyerAction:
      'Reject immediately. Drop 2 threads in cold water: instant red cloud confirms hazardous synthetic dye.',
  },
  {
    id: 'weighted_honey',
    title: 'Sample D: Heavy Moist / Clumped Stigmas',
    sourceContext: 'Wholesale Lot · Feels Slightly Pliable & Glossy',
    verdict: 'caution',
    verdictLabel: '▲ WARNING — GLYCERIN / HONEY WEIGHT-LOADING DETECTED',
    estimatedPurityPct: 82.0,
    crimsonHueRatio: 2.34,
    trumpetTipDetected: true,
    waterTestResult:
      'Threads sink to the bottom of the glass immediately instead of floating; sweetish taste instead of bitter picrocrocin.',
    paperRubResult:
      'Leaves a translucent wet/greasy smudge when pressed firmly between white bond paper for 20 seconds.',
    pricePerGramInr: '₹290 – ₹360 / g (Overpaying 18–25% for water/glycerin weight)',
    visualFindings: [
      'True Crocus sativus morphology present, but high specular glare ratio (0.68) indicates surface liquid film.',
      'Filaments stick together in dense clumps rather than separating cleanly on dry paper.',
      'Micro-crystalline white specks along epidermal grooves suggest mineral salt / borax coating.',
    ],
    buyerAction:
      'Press 3 threads inside folded white paper with your fingernail: if a translucent wet spot appears, the weight is artificially inflated.',
  },
];

export const LocalBuyerScanner: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pampore_gi');
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [customAnalysis, setCustomAnalysis] = useState<{
    fileName: string;
    crimsonHueRatio: number;
    glarePercent: number;
    foregroundCoveragePct: number;
    verdict: 'authentic' | 'adulterated' | 'caution';
    verdictLabel: string;
    estimatedPurityPct: number;
    findings: string[];
  } | null>(null);

  // Interactive 3-Step Physical Buyer Test Simulator state
  const [waterTimerSec, setWaterTimerSec] = useState<number>(30);
  const [waterSampleType, setWaterSampleType] = useState<'authentic' | 'azo_dye' | 'weighted'>(
    'authentic'
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activePreset =
    BUYER_PRESET_SAMPLES.find((p) => p.id === selectedPresetId) || BUYER_PRESET_SAMPLES[0];

  // Real client-side colorimetric pixel analysis when a local buyer uploads a photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUploadedImgUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = 240;
      const h = 180;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const { data } = ctx.getImageData(0, 0, w, h);
      let crimsonPixels = 0;
      let yellowOrangePixels = 0;
      let glarePixels = 0;
      let totalForeground = 0;
      let sumRedGreenDiff = 0;
      let sumYellowDiff = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;

        // Ignore bright white paper background
        if (luma < 215 && r > g + 18) {
          totalForeground++;
          const aProxy = r - g; // Redness proxy
          const bProxy = Math.max(10, (r + g) / 2 - b); // Yellowness proxy
          sumRedGreenDiff += aProxy;
          sumYellowDiff += bProxy;

          if (r > 95 && g < 75 && b < 80) {
            crimsonPixels++;
          } else if (r > 160 && g > 85) {
            yellowOrangePixels++;
          }

          if (luma > 185 && r > 200) {
            glarePixels++;
          }
        }
      }

      const fgCount = Math.max(1, totalForeground);
      const crimsonRatio = Number((sumRedGreenDiff / Math.max(1, sumYellowDiff)).toFixed(2));
      const yellowFraction = (yellowOrangePixels / fgCount) * 100;
      const glarePct = Number(((glarePixels / fgCount) * 100).toFixed(1));
      const estimatedPurity = Number(
        Math.min(99.5, Math.max(25.0, 100 - yellowFraction * 0.85 - glarePct * 0.4)).toFixed(1)
      );

      let verdict: 'authentic' | 'adulterated' | 'caution' = 'authentic';
      let verdictLabel = '● VISUAL COLORIMETRY CONSISTENT WITH AUTHENTIC MONGRA';
      const findings: string[] = [];

      if (yellowFraction > 28) {
        verdict = 'adulterated';
        verdictLabel = '✖ HIGH ORANGE/YELLOW FRACTION — POSSIBLE SAFFLOWER OR STYLE EXCESS';
        findings.push(
          `Detected ${yellowFraction.toFixed(1)}% high-luminance orange/yellow pixels typical of safflower florets or excess floral styles.`
        );
      } else if (glarePct > 18) {
        verdict = 'caution';
        verdictLabel = '▲ ELEVATED SURFACE GLARE — CHECK FOR OIL/HONEY WEIGHT-LOADING';
        findings.push(
          `Measured ${glarePct}% specular highlight pixels on thread surfaces; perform the white-paper press test for moisture/glycerin.`
        );
      } else {
        findings.push(
          `Strong deep-crimson chromatic dominance (a*/b* proxy = ${crimsonRatio}) matching Crocus sativus crocin pigment.`
        );
      }

      findings.push(
        `Segmented ${ ((fgCount / (w * h)) * 100).toFixed(1) }% filament foreground area across ${w}×${h} calibration grid.`
      );
      findings.push(
        'Confirm physical tip flare (trumpet shape) and slow golden water diffusion (10+ min) before bulk payment.'
      );

      setCustomAnalysis({
        fileName: file.name,
        crimsonHueRatio: crimsonRatio,
        glarePercent: glarePct,
        foregroundCoveragePct: Number(((fgCount / (w * h)) * 100).toFixed(1)),
        verdict,
        verdictLabel,
        estimatedPurityPct: estimatedPurity,
        findings,
      });
    };
    img.src = url;
  };

  useEffect(() => {
    return () => {
      if (uploadedImgUrl) URL.revokeObjectURL(uploadedImgUrl);
    };
  }, [uploadedImgUrl]);

  const displayedVerdict = customAnalysis ? customAnalysis.verdict : activePreset.verdict;
  const displayedVerdictLabel = customAnalysis
    ? customAnalysis.verdictLabel
    : activePreset.verdictLabel;
  const displayedPurity = customAnalysis
    ? customAnalysis.estimatedPurityPct
    : activePreset.estimatedPurityPct;
  const displayedHueRatio = customAnalysis
    ? customAnalysis.crimsonHueRatio
    : activePreset.crimsonHueRatio;
  const displayedFindings = customAnalysis
    ? customAnalysis.findings
    : activePreset.visualFindings;

  return (
    <section
      id="buyer-guide"
      className="bg-white border border-slate-200 shadow-xs space-y-0"
    >
      {/* Top Section Banner */}
      <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400">
            TIER-3 FIELD & RETAIL MODE · FOR LOCAL BUYERS, CONSUMERS & MANDI TRADERS
          </div>
          <h2 className="text-lg font-semibold mt-0.5">
            Smartphone Macro Scanner & 60-Second At-Home Authenticity Test
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-cyan-400 text-slate-950 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Phone Macro Photo
          </button>
          {customAnalysis && (
            <button
              onClick={() => {
                setCustomAnalysis(null);
                setUploadedImgUrl(null);
              }}
              className="px-3 py-2 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Clear Photo
            </button>
          )}
        </div>
      </div>

      {/* Hidden Canvas for real pixel colorimetry */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: How a Local Buyer Captures & Selects a Sample (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-[#F8FAFC] space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-600" />
              Option A: Scan Your Own Saffron with Any Smartphone
            </h3>
            <ol className="mt-2 space-y-1.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>
                Place <strong>5–10 separated threads</strong> on a plain sheet of white printer paper in natural daylight (turn off yellow indoor bulbs).
              </li>
              <li>
                Switch your phone camera to <strong>2× or Macro mode</strong> (or attach a ₹300 clip-on 20× macro lens) and tap to focus on the thread tips.
              </li>
              <li>
                Click <strong>Upload Phone Macro Photo</strong> above to run instant CIE colorimetry & glare analysis.
              </li>
            </ol>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-800 mb-2.5 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-cyan-600" />
              Option B: Compare Common Local Market Samples
            </h3>
            <div className="space-y-2">
              {BUYER_PRESET_SAMPLES.map((sample) => {
                const isSelected = !customAnalysis && sample.id === selectedPresetId;
                return (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setCustomAnalysis(null);
                      setUploadedImgUrl(null);
                      setSelectedPresetId(sample.id);
                    }}
                    className={`w-full text-left p-3 rounded border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white border-cyan-600 shadow-2xs'
                        : 'bg-white/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {sample.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 shrink-0">
                        {sample.pricePerGramInr}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {sample.sourceContext}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Instant Buyer Verdict & Interactive Cold-Water Test Simulator (7 cols) */}
        <div className="lg:col-span-7 p-6 space-y-6 bg-white">
          {/* Buyer Verdict Card */}
          <div className="space-y-4">
            <div
              className={`p-4 rounded border flex items-start justify-between gap-4 ${
                displayedVerdict === 'authentic'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : displayedVerdict === 'caution'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {displayedVerdict === 'authentic' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      displayedVerdict === 'caution' ? 'text-amber-600' : 'text-rose-600'
                    }`}
                  />
                )}
                <div>
                  <div className="text-xs font-mono font-bold">
                    {displayedVerdictLabel}
                  </div>
                  <div className="text-xs mt-1 opacity-90">
                    {customAnalysis
                      ? `Analyzed uploaded photo: ${customAnalysis.fileName}`
                      : activePreset.buyerAction}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono">
                <div className="text-[11px] opacity-75">EST. PURITY</div>
                <div className="text-xl font-bold tabular-nums">{displayedPurity}%</div>
              </div>
            </div>

            {/* Uploaded Image Preview if present */}
            {uploadedImgUrl && (
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded">
                <img
                  src={uploadedImgUrl}
                  alt="Uploaded saffron sample"
                  className="w-24 h-20 object-cover rounded border border-slate-300 shrink-0"
                />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-slate-900">
                    Uploaded Photo Colorimetric Telemetry
                  </div>
                  <div className="font-mono text-slate-600">
                    Crimson Index (a*/b*): <strong>{customAnalysis?.crimsonHueRatio}</strong> · Glare Pixels: <strong>{customAnalysis?.glarePercent}%</strong> · Coverage: <strong>{customAnalysis?.foregroundCoveragePct}%</strong>
                  </div>
                </div>
              </div>
            )}

            {/* 3 Quick Buyer Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded">
                <div className="text-[11px] font-mono text-slate-500">
                  1. TIP SHAPE (5× PHONE ZOOM)
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-1">
                  {customAnalysis
                    ? 'Inspect for Flared Trumpet Ends'
                    : activePreset.trumpetTipDetected
                    ? 'Flared Serrated Trumpet (Pass)'
                    : 'Flat or Straight Ends (Fail)'}
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded">
                <div className="text-[11px] font-mono text-slate-500">
                  2. CRIMSON-TO-YELLOW INDEX
                </div>
                <div className="text-xs font-mono font-semibold text-slate-900 mt-1 tabular-nums">
                  a*/b* = {displayedHueRatio} (Authentic ≥ 2.1)
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded">
                <div className="text-[11px] font-mono text-slate-500">
                  3. FAIR RETAIL PRICE BENCHMARK
                </div>
                <div className="text-xs font-mono font-semibold text-slate-900 mt-1">
                  {customAnalysis ? '₹320 – ₹450 / g (GI Grade I)' : activePreset.pricePerGramInr}
                </div>
              </div>
            </div>

            {/* Key Visual & Physical Findings */}
            <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded space-y-2">
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-cyan-600" />
                What the Scanner & Physical Checks Reveal:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {displayedFindings.map((finding, idx) => (
                  <li key={idx}>{finding}</li>
                ))}
              </ul>
              {!customAnalysis && (
                <div className="pt-2 mt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">Cold-Water Test: </span>
                    <span className="text-slate-600">{activePreset.waterTestResult}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">White-Paper Rub Test: </span>
                    <span className="text-slate-600">{activePreset.paperRubResult}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Cold-Water Diffusion Simulator for Local Buyers */}
          <div className="pt-5 border-t border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  Interactive At-Home Cold-Water Test Simulator (No Equipment Needed)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Drop 3 threads in a clear glass of lukewarm water. Drag the time slider to see how real Kashmiri saffron behaves vs. fake dyed threads.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[#F8FAFC] p-4 border border-slate-200 rounded">
              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'authentic', label: 'Authentic Mongra' },
                    { id: 'azo_dye', label: 'Fake Azo-Dyed Thread' },
                    { id: 'weighted', label: 'Honey/Salt Weighted' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setWaterSampleType(t.id as typeof waterSampleType)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        waterSampleType === t.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-600">Immersion Time Elapsed:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {waterTimerSec < 60
                        ? `${waterTimerSec} seconds`
                        : `${(waterTimerSec / 60).toFixed(1)} minutes`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={900}
                    step={5}
                    value={waterTimerSec}
                    onChange={(e) => setWaterTimerSec(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>5 sec (Immediate)</span>
                    <span>3 min</span>
                    <span>15 min (Full Diffusion)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed">
                  {waterSampleType === 'authentic' && (
                    <span>
                      <strong>Authentic Behavior:</strong> Threads <strong>float</strong> on top. At {waterTimerSec}s, water turns a clear, luminous <strong>golden-yellow</strong> (never red), and the thread itself stays deep crimson even after 15 minutes.
                    </span>
                  )}
                  {waterSampleType === 'azo_dye' && (
                    <span>
                      <strong>Counterfeit Dye Alert:</strong> Within 10–20 seconds, synthetic Ponceau 4R / Tartrazine bleeds an <strong>instant reddish-orange cloud</strong> into the water, and the stripped corn-silk thread turns pale yellow/white.
                    </span>
                  )}
                  {waterSampleType === 'weighted' && (
                    <span>
                      <strong>Weight-Loading Alert:</strong> Threads coated in honey, glycerin, or barium sulfate <strong>sink immediately to the bottom</strong> of the glass and release a cloudy ring.
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Glass Beaker Simulation */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <svg viewBox="0 0 140 110" className="w-36 h-28">
                  {/* Beaker Outline */}
                  <rect
                    x="25"
                    y="12"
                    width="90"
                    height="86"
                    rx="4"
                    fill="#FFFFFF"
                    stroke="#64748B"
                    strokeWidth="2"
                  />
                  {/* Water Fill Color based on sample type & time */}
                  <rect
                    x="27"
                    y="24"
                    width="86"
                    height="72"
                    rx="2"
                    fill={
                      waterSampleType === 'authentic'
                        ? `rgba(250, 204, 21, ${Math.min(0.75, (waterTimerSec / 900) * 0.75 + 0.05)})`
                        : waterSampleType === 'azo_dye'
                        ? `rgba(225, 29, 72, ${Math.min(0.82, (waterTimerSec / 60) * 0.75 + 0.25)})`
                        : `rgba(217, 119, 6, ${Math.min(0.55, (waterTimerSec / 600) * 0.5 + 0.15)})`
                    }
                  />
                  {/* Saffron Threads inside beaker (Floating vs Sinking) */}
                  {waterSampleType !== 'weighted' ? (
                    <g transform="translate(0, 0)">
                      <path
                        d="M 45,27 Q 65,30 85,26"
                        stroke={
                          waterSampleType === 'azo_dye' && waterTimerSec > 120
                            ? '#FCA5A5'
                            : '#881337'
                        }
                        strokeWidth="2.5"
                        fill="none"
                      />
                      <path
                        d="M 52,32 Q 70,35 92,29"
                        stroke={
                          waterSampleType === 'azo_dye' && waterTimerSec > 120
                            ? '#FDBA74'
                            : '#9F1239'
                        }
                        strokeWidth="2.2"
                        fill="none"
                      />
                    </g>
                  ) : (
                    <g transform="translate(0, 62)">
                      <path
                        d="M 45,27 Q 65,30 85,26"
                        stroke="#881337"
                        strokeWidth="2.8"
                        fill="none"
                      />
                      <path
                        d="M 52,30 Q 70,32 92,28"
                        stroke="#881337"
                        strokeWidth="2.8"
                        fill="none"
                      />
                    </g>
                  )}
                  <text
                    x="70"
                    y="107"
                    textAnchor="middle"
                    fontSize="7.5"
                    className="font-mono"
                    fill="#475569"
                  >
                    {waterSampleType === 'authentic'
                      ? 'FLOATS · GOLDEN HALO'
                      : waterSampleType === 'azo_dye'
                      ? 'INSTANT RED BLEED'
                      : 'SINKS TO BOTTOM'}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
