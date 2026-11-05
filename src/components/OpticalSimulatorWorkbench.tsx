import React, { useState, useMemo } from 'react';
import {
  AUTHENTIC_PROFILES,
  ADULTERANT_PROFILES,
  WAVELENGTHS_NM,
  AdulterantProfile,
} from '../data/saffronSpecData';
import {
  Crosshair,
  Eye,
  Sliders,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Download,
} from 'lucide-react';

interface SimulatedFilament {
  id: number;
  x: number;
  y: number;
  angle: number;
  lengthMm: number;
  widthMm: number;
  isAdulterant: boolean;
  isStyle: boolean;
  classLabel: string;
  confidence: number;
  mahalanobisDist: number;
  serrationScore: number;
  glareRatio: number;
  estimatedMassMg: number;
}

const BLEND_OPTIONS = [0, 1, 5, 10, 25, 50] as const;

export const OpticalSimulatorWorkbench: React.FC = () => {
  const [authenticType, setAuthenticType] = useState<'mongra' | 'lacha'>('mongra');
  const [selectedAdulterantId, setSelectedAdulterantId] = useState<string>('safflower');
  const [blendPercent, setBlendPercent] = useState<number>(5);
  const [opticalMode, setOpticalMode] = useState<
    'polarized_rgb' | 'specular_glare' | 'band_440nm' | 'band_920nm'
  >('polarized_rgb');
  const [xaiOverlay, setXaiOverlay] = useState<'instance_obb' | 'gradcam' | 'anomaly_map' | 'none'>(
    'instance_obb'
  );
  const [selectedFilamentId, setSelectedFilamentId] = useState<number>(3);
  const [hoveredWavelengthIdx, setHoveredWavelengthIdx] = useState<number | null>(1);
  const [cursorCoords, setCursorCoords] = useState<{ x: string; y: string }>({
    x: '14.20',
    y: '10.65',
  });

  const activeAuthentic = AUTHENTIC_PROFILES[authenticType];
  const activeAdulterant: AdulterantProfile =
    ADULTERANT_PROFILES.find((a) => a.id === selectedAdulterantId) || ADULTERANT_PROFILES[0];

  // Deterministic set of 24 filaments on the 28mm x 21mm quartz inspection stage
  const filaments = useMemo<SimulatedFilament[]>(() => {
    const totalCount = 24;
    const targetAdulterantCount =
      blendPercent === 0 ? 0 : Math.max(1, Math.round((blendPercent / 100) * totalCount));
    const list: SimulatedFilament[] = [];

    for (let i = 0; i < totalCount; i++) {
      const row = Math.floor(i / 6);
      const col = i % 6;
      const seed = (i * 37 + 13) % 100;
      const isAdulterant = i < targetAdulterantCount;
      const isStyle = !isAdulterant && authenticType === 'lacha' && i % 5 === 4;

      const x = 11 + col * 15.2 + ((seed % 7) - 3) * 0.9;
      const y = 14 + row * 22 + ((seed % 5) - 2) * 1.4;
      const angle = ((i * 47 + seed) % 140) - 70;

      const lengthMm = isAdulterant
        ? activeAdulterant.id === 'safflower'
          ? 14.5 + (seed % 6)
          : 26.0 + (seed % 9)
        : 27.5 + (seed % 7);

      const widthMm = isAdulterant
        ? activeAdulterant.id === 'cornsilk'
          ? 0.22
          : 0.95
        : 1.15;

      const estimatedMassMg = isAdulterant
        ? activeAdulterant.id === 'weight_loaded'
          ? 5.8
          : 3.6
        : isStyle
        ? 2.1
        : 4.4;

      list.push({
        id: i + 1,
        x,
        y,
        angle,
        lengthMm: Number(lengthMm.toFixed(1)),
        widthMm: Number(widthMm.toFixed(2)),
        isAdulterant,
        isStyle,
        classLabel: isAdulterant
          ? activeAdulterant.name
          : isStyle
          ? 'Floral Style (Lacha)'
          : 'Authentic Mongra Stigma',
        confidence: isAdulterant ? 0.982 - (seed % 15) * 0.001 : 0.994 - (seed % 8) * 0.001,
        mahalanobisDist: isAdulterant
          ? Number((14.8 + (seed % 11) * 0.9).toFixed(2))
          : Number((1.4 + (seed % 7) * 0.18).toFixed(2)),
        serrationScore: isAdulterant ? activeAdulterant.serrationIndex : activeAuthentic.serrationIndex,
        glareRatio: isAdulterant
          ? activeAdulterant.polarimetricGlareRatio
          : activeAuthentic.polarimetricGlareRatio,
        estimatedMassMg,
      });
    }
    return list;
  }, [authenticType, activeAdulterant, activeAuthentic, blendPercent]);

  const selectedFilament =
    filaments.find((f) => f.id === selectedFilamentId) || filaments[0];

  // Gravimetric Purity Calculation
  const metrics = useMemo(() => {
    const totalMass = filaments.reduce((acc, f) => acc + f.estimatedMassMg, 0);
    const authenticStigmaMass = filaments
      .filter((f) => !f.isAdulterant && !f.isStyle)
      .reduce((acc, f) => acc + f.estimatedMassMg, 0);
    const styleMass = filaments
      .filter((f) => f.isStyle)
      .reduce((acc, f) => acc + f.estimatedMassMg, 0);
    const adulterantMass = filaments
      .filter((f) => f.isAdulterant)
      .reduce((acc, f) => acc + f.estimatedMassMg, 0);

    const gravimetricPurity = (authenticStigmaMass / totalMass) * 100;
    const adulterantMassPct = (adulterantMass / totalMass) * 100;
    const floralWastePct = (styleMass / totalMass) * 100;

    // Blended spectral curve
    const wAuth = 1 - blendPercent / 100;
    const wAdult = blendPercent / 100;
    const blendedSpectrum = WAVELENGTHS_NM.map((_, idx) =>
      Number(
        (
          activeAuthentic.spectrum[idx] * wAuth +
          activeAdulterant.spectrum[idx] * wAdult
        ).toFixed(2)
      )
    );

    const isoGrade =
      adulterantMassPct <= 0.1 && floralWastePct <= 0.5
        ? 'ISO 3632 Category I (GI Pampore Certified)'
        : adulterantMassPct <= 0.5 && floralWastePct <= 4.0
        ? 'ISO 3632 Category II'
        : 'REJECTED — Adulteration Threshold Exceeded';

    return {
      totalMass: totalMass.toFixed(1),
      gravimetricPurity: gravimetricPurity.toFixed(2),
      adulterantMassPct: adulterantMassPct.toFixed(2),
      floralWastePct: floralWastePct.toFixed(2),
      blendedSpectrum,
      isoGrade,
      isRejected: adulterantMassPct > 0.5,
    };
  }, [filaments, blendPercent, activeAuthentic, activeAdulterant]);

  const handleExportSampleReport = () => {
    const reportPayload = {
      timestamp: new Date().toISOString(),
      system: 'CrocusSpec GI Hybrid VIS-NIR & Polarimetric Vision System',
      sampleConfig: {
        baseGrade: activeAuthentic.name,
        adulterantTested: blendPercent > 0 ? activeAdulterant.name : 'None (Pure Reference)',
        nominalBlendPercent: blendPercent,
        opticalChannel: opticalMode,
        xaiMode: xaiOverlay,
      },
      computedMetrics: {
        gravimetricPurityPercent: Number(metrics.gravimetricPurity),
        foreignAdulterantMassPercent: Number(metrics.adulterantMassPct),
        floralStyleWastePercent: Number(metrics.floralWastePct),
        iso3632Decision: metrics.isoGrade,
      },
      wavelengthsNm: WAVELENGTHS_NM,
      blendedReflectancePercent: metrics.blendedSpectrum,
    };
    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crocusspec-gi-assay-${selectedAdulterantId}-${blendPercent}pct.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-none shadow-xs">
      {/* Top Instrument Telemetry Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-2.5 bg-slate-900 text-slate-100 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-medium">● RIG CALIBRATED: SPECTRALON 99%</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>FOV: 28.0 × 21.0 mm (6.8 µm/px)</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>ACQUISITION: 9-BAND VIS-NIR + DUAL POLARIZATION (90 ms)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setBlendPercent(5);
              setSelectedAdulterantId('safflower');
              setOpticalMode('polarized_rgb');
              setXaiOverlay('instance_obb');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Calibration
          </button>
          <button
            onClick={handleExportSampleReport}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-slate-950 font-medium bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON Assay
          </button>
        </div>
      </div>

      {/* Main Asymmetric Split Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Control & Parameter Column (4 cols on lg) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 p-5 bg-[#F8FAFC] flex flex-col justify-between gap-5">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                  1. Base Kashmiri Crop Grade
                </label>
                <span className="text-xs font-mono text-slate-500">GI Reg. No. 635</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/80 rounded-lg">
                <button
                  onClick={() => setAuthenticType('mongra')}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    authenticType === 'mongra'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mongra (Detached Stigma)
                </button>
                <button
                  onClick={() => setAuthenticType('lacha')}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    authenticType === 'lacha'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lacha (Stigma + Style)
                </button>
              </div>
            </div>

            {/* Adulterant Class Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                2. Target Adulterant Class Injection
              </label>
              <div className="space-y-1.5">
                {ADULTERANT_PROFILES.map((item) => {
                  const active = item.id === selectedAdulterantId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAdulterantId(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md border transition-colors cursor-pointer ${
                        active
                          ? 'bg-white border-cyan-600 text-slate-900 shadow-2xs'
                          : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold truncate">{item.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {item.scientificName} · {item.primaryDetectionChannel}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Concentration Blend Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  3. Adulteration Concentration Blend (% w/w)
                </label>
                <span className="text-xs font-mono font-semibold text-cyan-700 tabular-nums">
                  {blendPercent}% Nominal
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1 p-1 bg-slate-200/80 rounded-lg">
                {BLEND_OPTIONS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setBlendPercent(pct)}
                    className={`py-1.5 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      blendPercent === pct
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Illumination & Spectral Band Mode */}
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                <Eye className="w-3.5 h-3.5 text-cyan-600" />
                4. Optical / Spectral Acquisition Channel
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'polarized_rgb', label: 'Cross-Polarized RGB (I_⊥)' },
                  { id: 'specular_glare', label: 'Stokes Glare (I_∥ − I_⊥)' },
                  { id: 'band_440nm', label: '440 nm Crocin Band' },
                  { id: 'band_920nm', label: '920 nm NIR O-H Band' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setOpticalMode(mode.id as typeof opticalMode)}
                    className={`px-2.5 py-2 text-xs font-medium rounded border text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                      opticalMode === mode.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* XAI Overlay Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-cyan-600" />
                5. Explainable AI (XAI) Localization Layer
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'instance_obb', label: 'YOLOv11-OBB + Mask' },
                  { id: 'gradcam', label: 'Grad-CAM++ Texture' },
                  { id: 'anomaly_map', label: 'Mahalanobis Open-Set' },
                  { id: 'none', label: 'Raw Optical Feed' },
                ].map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setXaiOverlay(layer.id as typeof xaiOverlay)}
                    className={`px-2.5 py-2 text-xs font-medium rounded border text-left transition-colors whitespace-nowrap truncate cursor-pointer ${
                      xaiOverlay === layer.id
                        ? 'bg-cyan-700 text-white border-cyan-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Adulterant Physical & Chemical Marker Readout */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-md space-y-1.5">
            <div className="text-[11px] font-mono text-slate-500">
              ACTIVE TARGET BIOMARKER PROFILE
            </div>
            <div className="text-xs font-semibold text-slate-900">
              {blendPercent === 0 ? activeAuthentic.name : activeAdulterant.name}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {blendPercent === 0
                ? activeAuthentic.morphologicalMarkers
                : activeAdulterant.morphologicalMarkers}
            </p>
          </div>
        </div>

        {/* Right Main Viewport & Spectrogram Stage (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white">
          {/* Interactive Microscopic Quartz Tray Canvas */}
          <div className="p-5 border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Interactive Telecentric Monolayer Inspection Stage (Click any filament for ROI telemetry)
                </h3>
                <p className="text-xs text-slate-500">
                  Piezoelectric vibratory quartz tray · 24 segmented instances · Sub-millimeter morphological & spectral scoring
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-600" />
                  X: {cursorCoords.x} mm · Y: {cursorCoords.y} mm
                </span>
              </div>
            </div>

            {/* SVG Microscopic Viewport */}
            <div
              className={`relative w-full h-[310px] rounded border overflow-hidden cursor-crosshair select-none transition-colors ${
                opticalMode === 'polarized_rgb'
                  ? 'bg-[#F4F6F9] border-slate-300'
                  : opticalMode === 'specular_glare'
                  ? 'bg-[#090D16] border-slate-800'
                  : opticalMode === 'band_440nm'
                  ? 'bg-[#131926] border-slate-800'
                  : 'bg-[#18131E] border-slate-800'
              }`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const relX = (((e.clientX - rect.left) / rect.width) * 28.0).toFixed(2);
                const relY = (((e.clientY - rect.top) / rect.height) * 21.0).toFixed(2);
                setCursorCoords({ x: relX, y: relY });
              }}
            >
              <svg viewBox="0 0 100 75" className="w-full h-full">
                {/* Calibration Grid Lines */}
                <defs>
                  <pattern id="mmGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke={opticalMode === 'polarized_rgb' ? '#CBD5E1' : '#1E293B'}
                      strokeWidth="0.2"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="75" fill="url(#mmGrid)" />

                {/* In-Frame Spectralon 99% & 18% Reference Tile */}
                <g transform="translate(2, 2)">
                  <rect
                    x="0"
                    y="0"
                    width="6"
                    height="12"
                    fill="#FFFFFF"
                    stroke="#64748B"
                    strokeWidth="0.3"
                  />
                  <rect
                    x="0"
                    y="12"
                    width="6"
                    height="12"
                    fill="#64748B"
                    stroke="#475569"
                    strokeWidth="0.3"
                  />
                  <text
                    x="1.2"
                    y="27"
                    fontSize="2"
                    className="font-mono"
                    fill={opticalMode === 'polarized_rgb' ? '#475569' : '#94A3B8'}
                  >
                    REF
                  </text>
                </g>

                {/* Render 24 Filaments */}
                {filaments.map((f) => {
                  const isSelected = f.id === selectedFilament.id;

                  // Determine filament visual color based on optical channel
                  let strokeColor = '#881337'; // Deep crimson Mongra
                  if (opticalMode === 'polarized_rgb') {
                    if (f.isAdulterant) {
                      strokeColor =
                        activeAdulterant.id === 'safflower'
                          ? '#D97706'
                          : activeAdulterant.id === 'cornsilk'
                          ? '#DC2626'
                          : '#B91C1C';
                    } else if (f.isStyle) {
                      strokeColor = '#CA8A04';
                    } else {
                      strokeColor = '#7F1D1D';
                    }
                  } else if (opticalMode === 'specular_glare') {
                    // Highlights glycerin/salt weight-loading or synthetic sheen
                    const highGlare = f.glareRatio > 0.3;
                    strokeColor = highGlare ? '#38BDF8' : '#334155';
                  } else if (opticalMode === 'band_440nm') {
                    // At 440nm crocin absorbs strongly (appears dark cyan/black), adulterants reflect brightly
                    strokeColor = f.isAdulterant ? '#F59E0B' : '#0284C7';
                  } else {
                    // 920nm NIR O-H absorption band
                    strokeColor =
                      f.isAdulterant && activeAdulterant.id === 'weight_loaded'
                        ? '#F43F5E'
                        : f.isAdulterant
                        ? '#A855F7'
                        : '#10B981';
                  }

                  const isTrumpetShaped = !f.isAdulterant || activeAdulterant.id === 'spent_tartrazine' || activeAdulterant.id === 'weight_loaded';

                  return (
                    <g
                      key={f.id}
                      transform={`translate(${f.x}, ${f.y}) rotate(${f.angle})`}
                      onClick={() => setSelectedFilamentId(f.id)}
                      className="cursor-pointer"
                    >
                      {/* Grad-CAM++ or Anomaly Heatmap Halo */}
                      {xaiOverlay === 'gradcam' && (
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="6.2"
                          ry="2.6"
                          fill={f.isAdulterant ? 'rgba(244, 63, 94, 0.35)' : 'rgba(6, 182, 212, 0.22)'}
                        />
                      )}
                      {xaiOverlay === 'anomaly_map' && f.isAdulterant && (
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="6.8"
                          ry="3.0"
                          fill="rgba(245, 158, 11, 0.42)"
                          stroke="#F59E0B"
                          strokeWidth="0.3"
                          strokeDasharray="0.8 0.5"
                        />
                      )}

                      {/* Filament Morphology Path (Trumpet Tri-Lobe vs Cylindrical Adulterant) */}
                      {isTrumpetShaped ? (
                        <path
                          d="M -5.5,0.2 Q 0,0.4 4.8,1.3 L 5.6,1.6 L 5.3,0.5 L 5.8,0.0 L 5.3,-0.5 L 5.6,-1.6 L 4.8,-1.3 Q 0,-0.4 -5.5,-0.2 Z"
                          fill={strokeColor}
                        />
                      ) : (
                        <path
                          d="M -5.8,-0.45 L 5.8,-0.45 L 5.8,0.45 L -5.8,0.45 Z"
                          fill={strokeColor}
                        />
                      )}

                      {/* YOLOv11 Oriented Bounding Box Overlay */}
                      {xaiOverlay === 'instance_obb' && (
                        <rect
                          x="-6.6"
                          y="-2.3"
                          width="13.2"
                          height="4.6"
                          fill="none"
                          stroke={
                            f.isAdulterant
                              ? '#E11D48'
                              : f.isStyle
                              ? '#D97706'
                              : '#0891B2'
                          }
                          strokeWidth={isSelected ? '0.55' : '0.32'}
                          strokeDasharray={f.isAdulterant ? 'none' : '1.2 0.6'}
                        />
                      )}

                      {/* Selected Filament Reticle */}
                      {isSelected && (
                        <circle
                          cx="0"
                          cy="0"
                          r="4.2"
                          fill="none"
                          stroke="#06B6D4"
                          strokeWidth="0.45"
                        />
                      )}

                      <text
                        x="-5.8"
                        y="-2.8"
                        fontSize="1.9"
                        className="font-mono"
                        fill={
                          f.isAdulterant
                            ? '#E11D48'
                            : opticalMode === 'polarized_rgb'
                            ? '#334155'
                            : '#E2E8F0'
                        }
                      >
                        #{f.id} {f.isAdulterant ? 'ADULT' : f.isStyle ? 'STYLE' : 'GI'}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Corner Legend HUD */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-slate-900/90 text-slate-100 rounded text-[11px] font-mono">
                <div className="flex items-center gap-4">
                  <span className="text-cyan-400">■ Authentic Mongra (GI)</span>
                  <span className="text-amber-400">■ Floral Style (Lacha)</span>
                  <span className="text-rose-400">■ Foreign Adulterant Localized</span>
                </div>
                <div>
                  SELECTED ROI #{selectedFilament.id}: {selectedFilament.classLabel} (P=
                  {(selectedFilament.confidence * 100).toFixed(1)}% · D_M={selectedFilament.mahalanobisDist})
                </div>
              </div>
            </div>

            {/* Selected Filament Micro-Morphology Readout Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3 pt-3 border-t border-slate-200 text-xs">
              <div>
                <div className="text-slate-500">Selected ROI Instance</div>
                <div className="font-mono font-semibold text-slate-900 mt-0.5">
                  Filament #{selectedFilament.id} ({selectedFilament.isAdulterant ? 'Adulterant' : 'Authentic'})
                </div>
              </div>
              <div>
                <div className="text-slate-500">Skeleton Length × Width</div>
                <div className="font-mono font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {selectedFilament.lengthMm} mm × {selectedFilament.widthMm} mm
                </div>
              </div>
              <div>
                <div className="text-slate-500">Apex Serration Index</div>
                <div className="font-mono font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {selectedFilament.serrationScore.toFixed(2)} (GI Threshold ≥ 0.72)
                </div>
              </div>
              <div>
                <div className="text-slate-500">Polarimetric Glare Ratio</div>
                <div className="font-mono font-semibold text-slate-900 mt-0.5 tabular-nums">
                  {selectedFilament.glareRatio.toFixed(2)} (Normal ≤ 0.25)
                </div>
              </div>
              <div>
                <div className="text-slate-500">Mahalanobis Distance D_M</div>
                <div
                  className={`font-mono font-semibold mt-0.5 tabular-nums ${
                    selectedFilament.mahalanobisDist > 5.0 ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {selectedFilament.mahalanobisDist} σ {selectedFilament.mahalanobisDist > 5.0 ? '(Outlier)' : '(In-Manifold)'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Time-Series & VIS-NIR Spectral Signature + Gravimetric Purity Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* VIS-NIR Reflectance Spectrogram (7 cols) */}
            <div className="md:col-span-7 p-5 border-b md:border-b-0 md:border-r border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    9-Band VIS-NIR Reflectance Curve (400 nm – 980 nm)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Solid Cyan: Pure Kashmiri Mongra Reference · Dashed Rose: Pure {activeAdulterant.name} · Amber: Current {blendPercent}% Blend
                  </p>
                </div>
              </div>

              <svg
                viewBox="0 0 420 155"
                className="w-full h-[155px] bg-[#F8FAFC] border border-slate-200 rounded"
              >
                {/* Horizontal grid lines */}
                {[20, 40, 60, 80].map((val) => {
                  const y = 130 - (val / 100) * 110;
                  return (
                    <g key={val}>
                      <line
                        x1="34"
                        y1={y}
                        x2="405"
                        y2={y}
                        stroke="#E2E8F0"
                        strokeWidth="1"
                      />
                      <text
                        x="6"
                        y={y + 3}
                        fontSize="8"
                        className="font-mono"
                        fill="#64748B"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Highlight 440nm Crocin & 920nm OH diagnostic bands */}
                <rect x="64" y="12" width="22" height="118" fill="rgba(6, 182, 212, 0.08)" />
                <text x="60" y="21" fontSize="7.5" className="font-mono" fill="#0891B2">
                  440nm Crocin
                </text>
                <rect x="358" y="12" width="24" height="118" fill="rgba(244, 63, 94, 0.08)" />
                <text x="342" y="21" fontSize="7.5" className="font-mono" fill="#E11D48">
                  920nm O-H
                </text>

                {/* Pure Authentic Reference Curve */}
                <polyline
                  fill="none"
                  stroke="#0891B2"
                  strokeWidth="2"
                  points={WAVELENGTHS_NM.map((_, idx) => {
                    const x = 40 + idx * 35.5;
                    const y = 130 - (activeAuthentic.spectrum[idx] / 100) * 110;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Pure Adulterant Curve */}
                <polyline
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  points={WAVELENGTHS_NM.map((_, idx) => {
                    const x = 40 + idx * 35.5;
                    const y = 130 - (activeAdulterant.spectrum[idx] / 100) * 110;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Current Blended Sample Curve */}
                <polyline
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="2"
                  points={WAVELENGTHS_NM.map((_, idx) => {
                    const x = 40 + idx * 35.5;
                    const y = 130 - (metrics.blendedSpectrum[idx] / 100) * 110;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Interactive Wavelength Points */}
                {WAVELENGTHS_NM.map((wl, idx) => {
                  const x = 40 + idx * 35.5;
                  const yAuth = 130 - (activeAuthentic.spectrum[idx] / 100) * 110;
                  const yAdult = 130 - (activeAdulterant.spectrum[idx] / 100) * 110;
                  const isHovered = hoveredWavelengthIdx === idx;
                  return (
                    <g
                      key={wl}
                      onMouseEnter={() => setHoveredWavelengthIdx(idx)}
                      className="cursor-pointer"
                    >
                      <line
                        x1={x}
                        y1="12"
                        x2={x}
                        y2="130"
                        stroke={isHovered ? '#0F172A' : 'transparent'}
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      <circle cx={x} cy={yAuth} r={isHovered ? 4 : 2.5} fill="#0891B2" />
                      <circle cx={x} cy={yAdult} r={isHovered ? 4 : 2.5} fill="#E11D48" />
                      <text
                        x={x - 10}
                        y="144"
                        fontSize="8"
                        className="font-mono"
                        fill={isHovered ? '#0F172A' : '#64748B'}
                      >
                        {wl}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {hoveredWavelengthIdx !== null && (
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded">
                  <span>BAND: {WAVELENGTHS_NM[hoveredWavelengthIdx]} nm</span>
                  <span>
                    GI Ref: {activeAuthentic.spectrum[hoveredWavelengthIdx]}%
                  </span>
                  <span>
                    Adulterant: {activeAdulterant.spectrum[hoveredWavelengthIdx]}%
                  </span>
                  <span className="font-semibold text-slate-900">
                    ΔR: {(activeAdulterant.spectrum[hoveredWavelengthIdx] - activeAuthentic.spectrum[hoveredWavelengthIdx]).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {/* Gravimetric Purity & QA Decision Panel (5 cols) */}
            <div className="md:col-span-5 p-5 flex flex-col justify-between bg-[#F8FAFC]">
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-500">
                  GRAVIMETRIC PURITY & ISO 3632 / GI ASSAY
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <div className="text-[11px] font-mono text-slate-500">
                      COMPUTED PURITY (% w/w)
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                        {metrics.gravimetricPurity}
                      </span>
                      <span className="text-xs font-mono text-slate-400 ml-1">%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <div className="text-[11px] font-mono text-slate-500">
                      ADULTERANT MASS FRACTION
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <span
                        className={`text-2xl font-mono font-bold tabular-nums ${
                          Number(metrics.adulterantMassPct) > 0.5
                            ? 'text-rose-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {metrics.adulterantMassPct}
                      </span>
                      <span className="text-xs font-mono text-slate-400 ml-1">%</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assayed Sample Mass:</span>
                    <span className="text-slate-900 font-semibold tabular-nums">{metrics.totalMass} mg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Floral Style Waste:</span>
                    <span className="text-slate-900 font-semibold tabular-nums">{metrics.floralWastePct}% w/w</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Crop Specificity Target:</span>
                    <span className="text-emerald-700 font-semibold tabular-nums">99.62% (FPR &lt; 0.4%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Edge Latency (Jetson Orin):</span>
                    <span className="text-slate-900 font-semibold tabular-nums">41.8 ms / tray</span>
                  </div>
                </div>
              </div>

              {/* Explicit Text + Semantic Icon Status Decision (Non-Hue-Only per Design Reference) */}
              <div
                className={`mt-3 p-3 rounded border flex items-start gap-2.5 ${
                  metrics.isRejected
                    ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                }`}
              >
                {metrics.isRejected ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <div className="font-semibold">
                    {metrics.isRejected ? '✖ BATCH QUARANTINED' : '● GI GRADE VERIFIED'}
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-90">{metrics.isoGrade}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
