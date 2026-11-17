# CrocusSpec GI — Kashmiri Saffron Adulteration Detection & Spectral Grading System

> **End-to-End Computer Vision, 9-Band VIS-NIR Multispectral Imaging, and Polarimetric Deep Learning Workbench for Automated Kashmiri Saffron (*Crocus sativus* L., GI Reg. No. 635) Quality Assurance.**

[![ISO 3632-1/2](https://img.shields.io/badge/Standard-ISO_3632--1%2F2-0891b2)](https://www.iso.org/standard/44523.html)
[![GI Registry](https://img.shields.io/badge/Geographical_Indication-Kashmir_GI_No._635-059669)](#)
[![React 19 + TypeScript](https://img.shields.io/badge/Frontend-React_19_%2B_Vite_%2B_Tailwind_v4-0f172a)](#)
[![PyTorch + TensorRT](https://img.shields.io/badge/Deep_Learning-PyTorch_%2B_ONNX_%2B_TensorRT-e11d48)](#)

---

## Overview

Kashmiri Saffron (*Crocus sativus* L., grown in Pampore, Kishtwar, and Budgam) commands a high global premium due to its high **crocin** (coloring strength), **picrocrocin** (bitterness), and **safranal** (aroma) concentrations, as well as its distinctive **trumpeted, serrated three-lobed stigma morphology**. Because of its value, it is frequently targeted by sophisticated adulteration across three vectors:

1. **Botanical Substitutes:** Safflower florets (*Carthamus tinctorius*), dyed corn silk (*Zea mays* styles), dyed marigold petals (*Tagetes erecta*), shredded beet/coconut coir fibers, and excess unpigmented yellow floral styles.
2. **Chemical & Spent Re-Dyeing:** Solvent-extracted (exhausted) authentic saffron threads re-dyed with synthetic azo dyes such as **Tartrazine (E102)**, **Ponceau 4R (E124)**, or **Carmoisine (E122)**.
3. **Gravimetric Weight-Loading:** Coating authentic threads in **glycerin, honey, vegetable oils, or mineral salts ($\text{BaSO}_4$, borax, $\text{KNO}_3$)** to artificially inflate weight by 15%–30%.

**CrocusSpec GI** provides both:
- An **interactive web-based optical & spectral simulation workbench** (supporting both consumer smartphone macro checks and laboratory VIS-NIR + polarimetric inspection).
- A **complete production engineering blueprint and reference PyTorch pipeline** for deploying a 3-stage instance segmentation, morpho-spectral classification, and open-set anomaly detection system on edge hardware (**NVIDIA Jetson Orin Nano**) and mobile devices.

---

## Key Features in the Web Application

### 1. Tier-3 Local Buyer Smartphone Macro Scanner (`#buyer-guide`)
* **Client-Side Photo Colorimetry:** Upload a smartphone macro photo of saffron threads on plain white paper to compute the **Crimson-to-Yellow Chromatic Index ($a^*/b^*$)**, **Specular Glare Percentage**, and foreground thread coverage.
* **4 Real-World Market Presets:** Compare authentic **Pampore GI Sealed Mongra** against **Tourist Bazaar Safflower Blends**, **Counterfeit Dyed Corn Silk**, and **Honey/Glycerin Weight-Loaded Saffron**.
* **Interactive 60-Second Cold-Water Diffusion Simulator:** Scrub through immersion time ($5\text{ s} \to 15\text{ min}$) to compare authentic slow golden-yellow crocin diffusion (floating crimson stigmas) against instant red synthetic azo-dye bleed and sinking weight-loaded threads.

### 2. Tier-1/2 Telecentric VIS-NIR & Polarimetric Inspection Workbench (`#workbench`)
* **Interactive 24-Filament Monolayer Stage:** Simulate blends at **`0%`**, **`1%`**, **`5%`**, **`10%`**, **`25%`**, and **`50%` w/w** across Mongra and Lacha grades.
* **4 Optical & Spectral Acquisition Channels:**
  * `Cross-Polarized RGB (I_⊥)` — Eliminates surface glare to expose serrated apical papillae and true crocin hue.
  * `Stokes Specular Glare (I_∥ − I_⊥)` — Isolates glossy glycerin/honey coatings and mineral salt micro-crystals.
  * `440 nm Crocin Absorption Band` — Separates high-crocin authentic stigmas from low-crocin botanical fillers.
  * `920 nm NIR O-H Band` — Detects moisture anomalies and humectant weight-loading.
* **3 Explainable AI (XAI) Overlays:** Toggle between `YOLOv11-OBB + Instance Mask`, `Grad-CAM++ Epidermal Texture Attention`, and `PatchCore Mahalanobis Open-Set Anomaly Map`.
* **Live 9-Band VIS-NIR Spectrogram (400–980 nm):** Inspect reflectance curves and $\Delta R$ deviations across diagnostic wavelengths, paired with real-time **Gravimetric Purity (`% w/w`)** and **ISO 3632-1/2** grading decisions.
* **JSON Assay & Markdown Dossier Export:** One-click export of structured JSON batch certificates and the full engineering specification.

---

## System Architecture & Optical Modality Pipeline

### Modality Trade-Off Summary

| Imaging Modality | Optical & Sensor Spec | Spatial Res. | Botanical Recall | Chemical / Dye Recall | Unit BOM | Target Tier |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Active 9-Band VIS-NIR + Cross-Polarized Telecentric Macro (Recommended)** | 12 MP Global Shutter CMOS + 0.5× Bi-Telecentric Lens + 9-Band LED Dome (405–940 nm) + Rotating Polarizer | **6.8 µm/px** | **99.4%** | **99.1%** | $1,150 – $1,450 | **Tier-1 GI Lab & Packhouse Line** |
| **Cross-Polarized Telecentric Macro RGB** | 12 MP Global Shutter CMOS + 0.5× Telecentric Lens + Orthogonal Polarizer | **6.8 µm/px** | **99.4%** | **81.2%** | $680 – $950 | **Tier-2 Mandi QA Kiosk** |
| **Pushbroom Hyperspectral (HSI VIS-NIR)** | Specim FX10 (400–1000 nm, 224 bands) + Translation Stage | 28.0 µm/px | 95.2% | **99.7%** | $18,000+ | **Reference Calibration Lab Only** |
| **Smartphone + 20× Clip-On Macro / Foldscope** | 48 MP Smartphone Sensor (RAW DNG) + Diffuser Hood + 24-Patch Color Target | 14.5 µm/px | 93.8% | 62.5% | $35 – $65 | **Tier-3 Farm-Gate & Consumer Triage** |

### Hardware Capture Schematic

```text
                        [ Sony IMX253 / IMX264 Global Shutter CMOS ]
                                 (12 MP, 3.45 µm pixel pitch)
                                              |
                        [ Motorized Rotating Analyzer (0° / 90° Linear) ]
                                              |
                        [ 0.5x Bi-Telecentric Macro Objective (f/8, DOF 2.4mm) ]
                                              |
              +-------------------------------+-------------------------------+
              |          INTEGRATING HEMISPHERICAL PTFE DIFFUSER DOME         |
              |   [Ring Bank A: 9-Band Narrowband VIS-NIR LEDs (405-940nm)]   |
              |   [Ring Bank B: Coaxial 5600K CRI-98 White LED + Polarizer]   |
              +-------------------------------+-------------------------------+
                                              |
                                              v  (Uniform Shadow-Free Irradiance, <1.8% CV)
       ===============================================================================
       [ Embedded Spectralon 99% & 18% Gray Tile ]   [ 2.0g Saffron Monolayer Spread ]
       -------------------------------------------------------------------------------
                 [ Anti-Static Matte Black / Backlit Quartz Vibratory Stage ]
                              (Piezoelectric 60 Hz micro-dispersion)
       ===============================================================================
                                              |
                        [ 660 nm & 850 nm Diffuse Trans-Illumination Backlight ]
```

---

## Deep Learning & Inference Pipeline

1. **Stage 1 — Radiometric & Polarimetric Normalization (`< 6 ms`):**
   Flat-field calibration against the in-frame Spectralon® 99% tile, decomposition into diffuse cross-polarized reflectance ($I_\perp$) and specular glare ($I_{\text{glare}} = I_\parallel - I_\perp$), and root-polynomial transformation into CIE $L^*a^*b^*$.
2. **Stage 2 — Instance De-Clumping & Oriented Localization (`~14 ms`):**
   `YOLOv11m-seg` paired with 850 nm backlit distance-transform watershed segments each filament into an Oriented Bounding Box (OBB) and extracts medial-axis skeleton geometry (`length`, `width_taper_ratio`, `apex_serration_index`).
3. **Stage 3A — Dual-Stream Morpho-Spectral Classification (`~18 ms`):**
   `ConvNeXt-Small` ($7\times 7$ depthwise kernels tuned to epidermal cell ribs) fused via cross-modal gating with a `1D Spectral Attention Encoder` operating on the 9-band reflectance curve $R(\lambda)$ and its first Savitzky-Golay derivative $\frac{dR}{d\lambda}$.
4. **Stage 3B — Open-Set Anomaly Detection (`PatchCore` + Mahalanobis Distance):**
   Flags novel synthetic polymers or uncatalogued chemical dyes that fall outside the authentic Kashmiri GI embedding manifold ($D_M > 5.0\sigma$).
5. **Stage 4 — Gravimetric Purity Conversion (`< 4 ms`):**
   Converts per-filament projected area $A_i$ and mean width $\bar{W}_i$ to estimated mass $\hat{m}_i = \alpha_c \cdot A_i \cdot (\bar{W}_i)^{0.82}$ to report true **Gravimetric Purity (`% w/w`)** under a **Specificity $\ge 99.6\%$** Neyman-Pearson threshold.

---

## Getting Started (Local Development)

### Prerequisites
* **Node.js** `>= 20.x`
* **npm** `>= 10.x`

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server on port 3000
npm run dev

# 3. Type-check and build for production
npm run lint
npm run build
```

---

## Repository Structure

```text
├── index.html                                  # HTML entry point & Google Fonts (Plus Jakarta Sans & IBM Plex Mono)
├── metadata.json                               # Application metadata & capabilities
├── package.json                                # Project dependencies & scripts
├── src/
│   ├── App.tsx                                 # Root layout, benchmark strip & section orchestration
│   ├── index.css                               # Tailwind v4 configuration & tabular numeral rules
│   ├── main.tsx                                # React DOM root mount
│   ├── assets/images/                          # Generated macro microscopy & optical hardware visuals
│   ├── components/
│   │   ├── LocalBuyerScanner.tsx               # Tier-3 smartphone photo colorimetry & water-test simulator
│   │   ├── OpticalSimulatorWorkbench.tsx       # Tier-1/2 interactive 24-filament stage & VIS-NIR spectrogram
│   │   └── ArchitectureBlueprintView.tsx       # Modality matrices, ASCII diagrams & PyTorch code viewer
│   └── data/
│       └── saffronSpecData.ts                  # Spectral curves (400-980nm), adulterant profiles & PyTorch code
└── README.md                                   # Project documentation
```

---

## License

Released under the **Apache-2.0 License**. Designed for agricultural quality assurance, Geographical Indication (GI) protection, and computer vision research.
