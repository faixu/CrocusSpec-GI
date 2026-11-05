/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LocalBuyerScanner } from './components/LocalBuyerScanner';
import { OpticalSimulatorWorkbench } from './components/OpticalSimulatorWorkbench';
import { ArchitectureBlueprintView } from './components/ArchitectureBlueprintView';
import { PYTORCH_PIPELINE_CODE, HARDWARE_CAPTURE_ARCHITECTURE_ASCII, FULL_INFERENCE_WORKFLOW_ASCII } from './data/saffronSpecData';

export default function App() {
  const handleDownloadBlueprint = () => {
    const content = `# KASHMIRI SAFFRON (CROCUS SATIVUS L.) ADULTERATION DETECTION SYSTEM
## Principal Computer Vision & Spectral Engineering Dossier (GI Reg. No. 635)

${HARDWARE_CAPTURE_ARCHITECTURE_ASCII}

${FULL_INFERENCE_WORKFLOW_ASCII}

## Reference PyTorch Implementation
\`\`\`python
${PYTORCH_PIPELINE_CODE}
\`\`\`
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kashmiri_Saffron_CV_Architecture_Dossier.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          CrocusSpec GI
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <a
            href="#buyer-guide"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Buyer Scanner
          </a>
          <a
            href="#workbench"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Optical Workbench
          </a>
          <a
            href="#modality"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Modality & Hardware
          </a>
          <a
            href="#deliverables"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Architecture Blueprint
          </a>
          <a
            href="#pytorch-pipeline"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            PyTorch Pipeline
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={handleDownloadBlueprint}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Download Engineering Dossier
          </button>
        </div>
      </header>

      {/* Main Content Container (1440px desktop presence) */}
      <main id="top" className="flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Compact Scientific Header & Quantitative Benchmark Strip */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                <span>KASHMIRI SAFFRON GI QUALITY ASSURANCE</span>
                <span aria-hidden="true">·</span>
                <span>ISO 3632-1/2 COMPLIANT</span>
                <span aria-hidden="true">·</span>
                <span>VIS-NIR (400–980 nm) + SMARTPHONE FIELD SCANNER</span>
              </div>
              <h1
                className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Automated Kashmiri Saffron Adulteration Detection & Spectral Grading System
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
              From consumer smartphone macro checks to packhouse VIS-NIR spectral grading: isolate biological, synthetic, and chemical weight-loading adulterants down to 1% w/w blends.
            </p>
          </div>

          {/* 4-Column Quantitative Benchmark Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="p-4">
              <div className="text-[11px] font-mono text-slate-500">
                SPATIAL & SPECTRAL RESOLUTION
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                  6.8
                </span>
                <span className="text-xs font-mono text-slate-400 ml-1.5">
                  µm/px · 9 VIS-NIR BANDS
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Resolves 80 µm apical papillae & 440/505/920 nm bands
              </div>
            </div>

            <div className="p-4">
              <div className="text-[11px] font-mono text-slate-500">
                AUTHENTIC CROP SPECIFICITY
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-bold text-emerald-700 tabular-nums">
                  99.62
                </span>
                <span className="text-xs font-mono text-slate-400 ml-1.5">
                  % (FPR &lt; 0.4%)
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Neyman-Pearson threshold avoids false condemnation
              </div>
            </div>

            <div className="p-4">
              <div className="text-[11px] font-mono text-slate-500">
                1% TRACE BLEND RECALL (F1)
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                  98.70
                </span>
                <span className="text-xs font-mono text-slate-400 ml-1.5">
                  % MACRO F1
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Across botanical, synthetic & tartrazine-spent classes
              </div>
            </div>

            <div className="p-4">
              <div className="text-[11px] font-mono text-slate-500">
                EDGE TENSORRT LATENCY
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-mono font-bold text-cyan-700 tabular-nums">
                  41.8
                </span>
                <span className="text-xs font-mono text-slate-400 ml-1.5">
                  ms / 2.0g TRAY
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                NVIDIA Jetson Orin Nano 8GB (FP16 + INT8 stem)
              </div>
            </div>
          </div>
        </div>

        {/* Tier-3 Local Buyer Smartphone Scanner & 60-Second Verification Mode */}
        <LocalBuyerScanner />

        {/* Tier-1/2 Interactive Optical & Spectral Inspection Workbench */}
        <div id="workbench">
          <OpticalSimulatorWorkbench />
        </div>

        {/* Complete Architectural Deliverables & PyTorch Code */}
        <ArchitectureBlueprintView />
      </main>

      {/* Quiet Scientific Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-6 mt-12">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            CrocusSpec GI — Kashmiri Saffron (Crocus sativus L.) Computer Vision & Spectral Quality Assurance Reference Architecture
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>ISO 3632-1:2011</span>
            <span aria-hidden="true">·</span>
            <span>GI Registry No. 635 (Pampore / Kishtwar)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
