export interface AdulterantProfile {
  id: string;
  name: string;
  scientificName: string;
  category: 'Botanical' | 'Synthetic' | 'Chemical / Weight-Loaded';
  morphologicalMarkers: string;
  spectralSignature: string;
  primaryDetectionChannel: string;
  aspectRatioRange: string;
  serrationIndex: number; // 0 to 1 (Authentic Mongra is ~0.88)
  crocinPeak440nm: number; // Absorbance / inverse reflectance index
  nirReflectance920nm: number; // Reflectance %
  polarimetricGlareRatio: number; // Specular vs diffuse ratio
  colorLab: { L: number; a: number; b: number };
  spectrum: number[]; // Reflectance % across [400, 440, 480, 520, 560, 620, 680, 760, 850, 920, 980] nm
}

export const WAVELENGTHS_NM = [400, 440, 480, 520, 560, 620, 680, 760, 850, 920, 980];

export const AUTHENTIC_PROFILES: Record<'mongra' | 'lacha', AdulterantProfile> = {
  mongra: {
    id: 'mongra',
    name: 'Authentic Kashmiri Mongra (GI Grade I)',
    scientificName: 'Crocus sativus L. (Detached Stigmas)',
    category: 'Botanical',
    morphologicalMarkers:
      'Funnel-shaped tri-lobed stigmas (25–35 mm length), flared trumpeted serrated tips (papillae 80–120 µm), uniform longitudinal vascular ribbing, zero attached yellow style.',
    spectralSignature:
      'Strong carotenoid (crocin) absorption trough at 440–460 nm; steep red-edge transition at 630–680 nm; high cellular scatter plateau at 780–900 nm; characteristic OH/oil band at 920–970 nm.',
    primaryDetectionChannel: 'Telecentric Cross-Polarized RGB + 440nm/660nm/920nm VIS-NIR',
    aspectRatioRange: '18.5 : 1 – 26.0 : 1 (Tapering ratio 1:3.4 base-to-apex)',
    serrationIndex: 0.89,
    crocinPeak440nm: 0.94,
    nirReflectance920nm: 68.4,
    polarimetricGlareRatio: 0.12,
    colorLab: { L: 24.8, a: 46.2, b: 18.4 },
    spectrum: [8.2, 6.4, 7.9, 11.2, 16.5, 48.0, 69.5, 76.2, 74.8, 68.4, 63.1],
  },
  lacha: {
    id: 'lacha',
    name: 'Authentic Kashmiri Lacha (Stigma + Style)',
    scientificName: 'Crocus sativus L. (Whole Tri-Stigma with Floral Style)',
    category: 'Botanical',
    morphologicalMarkers:
      'Tri-lobed crimson stigmas joined at base to a pale yellow/ivory floral style (10–18 mm). Preserves trumpet apex serrations and longitudinal epidermal striations.',
    spectralSignature:
      'Dual-mode signature: Mongra crocin absorption on crimson lobes + higher 520–580 nm reflectance on unpigmented yellow floral styles.',
    primaryDetectionChannel: 'Instance Segmentation (Lobe vs. Style Ratio Quantification)',
    aspectRatioRange: '22.0 : 1 – 34.0 : 1',
    serrationIndex: 0.86,
    crocinPeak440nm: 0.84,
    nirReflectance920nm: 66.8,
    polarimetricGlareRatio: 0.14,
    colorLab: { L: 31.2, a: 39.8, b: 26.5 },
    spectrum: [10.4, 9.1, 12.6, 18.4, 24.2, 52.4, 70.1, 75.0, 73.2, 66.8, 62.0],
  },
};

export const ADULTERANT_PROFILES: AdulterantProfile[] = [
  {
    id: 'safflower',
    name: 'Safflower Florets',
    scientificName: 'Carthamus tinctorius L.',
    category: 'Botanical',
    morphologicalMarkers:
      'Tubular five-lobed corolla lobes (narrow acicular tips rather than flared serrated trumpets), smooth epidermal cuticle, frequent adherent pollen grains (spheroidal, 50–65 µm).',
    spectralSignature:
      'Carthamin pigment shifts absorption peak to 515–530 nm; elevated reflectance at 440 nm compared to crocin; flat NIR slope between 750–900 nm.',
    primaryDetectionChannel: 'Morphological Apex Classifier + 440nm / 525nm Spectral Ratio',
    aspectRatioRange: '8.5 : 1 – 14.0 : 1 (Flat ribbon geometry)',
    serrationIndex: 0.21,
    crocinPeak440nm: 0.41,
    nirReflectance920nm: 54.2,
    polarimetricGlareRatio: 0.19,
    colorLab: { L: 42.6, a: 38.4, b: 49.2 },
    spectrum: [18.5, 24.2, 19.8, 14.1, 28.6, 61.2, 71.4, 68.5, 62.1, 54.2, 50.8],
  },
  {
    id: 'cornsilk',
    name: 'Dyed Corn Silk Styles',
    scientificName: 'Zea mays L. (Stigmata maydis + Acid Red / Ponceau 4R)',
    category: 'Botanical',
    morphologicalMarkers:
      'Uniform cylindrical thread width (0.15–0.25 mm) with zero apical flare; bifurcated hair-like trichomes along shaft; parallel twin vascular bundles visible under trans-illumination.',
    spectralSignature:
      'Azo-dye narrow absorption notch at 505 nm; lacks natural crocin 440 nm breadth; cellulose-dominant NIR reflectance spike at 850 nm.',
    primaryDetectionChannel: 'Tapering Geometry Filter + 505nm Azo-Dye Spectral Notch',
    aspectRatioRange: '45.0 : 1 – 90.0 : 1 (Constant diameter filament)',
    serrationIndex: 0.08,
    crocinPeak440nm: 0.35,
    nirReflectance920nm: 59.6,
    polarimetricGlareRatio: 0.24,
    colorLab: { L: 33.4, a: 52.1, b: 29.8 },
    spectrum: [21.0, 26.8, 16.2, 9.4, 22.0, 58.9, 74.2, 81.5, 79.4, 59.6, 54.1],
  },
  {
    id: 'spent_tartrazine',
    name: 'Exhausted (Spent) Saffron + Tartrazine / Carmoisine',
    scientificName: 'Crocus sativus (Solvent-Extracted) + E102 / E122 Synthetic Dyes',
    category: 'Chemical / Weight-Loaded',
    morphologicalMarkers:
      'Authentic Crocus sativus morphology (collapsed cell walls, flattened papillae from hot water/ethanol extraction), non-uniform dye pooling in inter-rib crevices.',
    spectralSignature:
      'Morphology passes RGB checks, but synthetic azo dyes show hyper-sharp reflectance transition at 590 nm and depleted 660–720 nm internal cellular scatter.',
    primaryDetectionChannel: '9-Band VIS-NIR Spectral Branch + Cross-Polarized Dye Pooling Texture',
    aspectRatioRange: '17.0 : 1 – 25.0 : 1 (Collapsed wall profile)',
    serrationIndex: 0.74,
    crocinPeak440nm: 0.52,
    nirReflectance920nm: 47.8,
    polarimetricGlareRatio: 0.38,
    colorLab: { L: 29.5, a: 56.8, b: 34.1 },
    spectrum: [14.2, 16.9, 11.4, 8.2, 12.8, 66.4, 72.0, 62.4, 55.1, 47.8, 43.2],
  },
  {
    id: 'weight_loaded',
    name: 'Glycerin / Honey / Mineral Salt Weight-Loaded Saffron',
    scientificName: 'Crocus sativus + Glycerol / BaSO4 / Borax / KNO3',
    category: 'Chemical / Weight-Loaded',
    morphologicalMarkers:
      'Glossy liquid bridge menisci between adjacent filaments; micro-crystalline efflorescence (10–35 µm high-albedo specks) along epidermal grooves.',
    spectralSignature:
      'Strong O-H overtone absorption dip at 920–970 nm from glycerin/honey humectants; high specular polarization component (S_parallel - S_perp).',
    primaryDetectionChannel: 'Dual-Polarization Stokes Glare Ratio + 960nm O-H Absorption Band',
    aspectRatioRange: '18.0 : 1 – 26.0 : 1 (Clumped sticky filaments)',
    serrationIndex: 0.79,
    crocinPeak440nm: 0.78,
    nirReflectance920nm: 38.4,
    polarimetricGlareRatio: 0.69,
    colorLab: { L: 21.4, a: 41.0, b: 14.2 },
    spectrum: [7.5, 6.9, 8.1, 10.5, 14.9, 44.2, 63.8, 66.1, 54.0, 38.4, 31.2],
  },
  {
    id: 'synthetic_fiber',
    name: 'Dyed Coconut Coir / Nylon / Beet Root Fibers',
    scientificName: 'Cocos nucifera / Polyamide-6 / Beta vulgaris Shreds',
    category: 'Synthetic',
    morphologicalMarkers:
      'Knife-cut rectangular cross-sections, absence of apical papillae, rigid straight-line or helical plastic curvature, uniform extruded surface.',
    spectralSignature:
      'Complete absence of carotenoid vibronic bands; nylon/polymer C-H overtone absorption or anomalous flat NIR plateau.',
    primaryDetectionChannel: 'Instance Contour Curvature + Gabor Epidermal Striation Filter',
    aspectRatioRange: '12.0 : 1 – 40.0 : 1 (Zero taper)',
    serrationIndex: 0.04,
    crocinPeak440nm: 0.29,
    nirReflectance920nm: 79.2,
    polarimetricGlareRatio: 0.54,
    colorLab: { L: 27.9, a: 54.4, b: 22.7 },
    spectrum: [24.5, 28.1, 22.4, 15.6, 19.8, 54.0, 77.5, 83.2, 81.9, 79.2, 76.4],
  },
];

export interface ModalityComparison {
  modality: string;
  opticalSpec: string;
  spatialResolution: string;
  spectralChannels: string;
  botanicalAdulterantRecall: string;
  chemicalDyeRecall: string;
  unitBomCost: string;
  deploymentTier: string;
  verdict: string;
}

export const MODALITY_COMPARISON_TABLE: ModalityComparison[] = [
  {
    modality: 'High-Res Telecentric Macro RGB (Cross-Polarized)',
    opticalSpec: '12 MP Global Shutter CMOS (Sony IMX253) + 0.5x Bi-Telecentric Lens + Motorized Orthogonal Polarizer',
    spatialResolution: '6.8 µm / pixel (FOV: 28 × 21 mm)',
    spectralChannels: '3 Bands (460 nm, 530 nm, 625 nm) × 2 Polarization States (I_∥, I_⊥)',
    botanicalAdulterantRecall: '99.4% (Safflower, Corn Silk, Floral Styles, Coir)',
    chemicalDyeRecall: '81.2% (Detects salt crystals & glycerin glare; partial on spent dyed)',
    unitBomCost: '$680 – $950',
    deploymentTier: 'Tier-2 Packhouse / Mandi QA Kiosk (Recommended Core)',
    verdict: 'Optimal spatial morphology & glare-free cuticle texture extraction.',
  },
  {
    modality: 'Multispectral LED-Multiplexed VIS-NIR (Active Strobe)',
    opticalSpec: '5 MP Monochrome NIR-Enhanced CMOS (IMX264) + 9-Wavelength Narrowband LED Dome (400–980 nm)',
    spatialResolution: '11.2 µm / pixel (Time-multiplexed 9 frames in 90 ms)',
    spectralChannels: '9 Narrow Bands (405, 445, 505, 530, 590, 660, 780, 850, 940 nm)',
    botanicalAdulterantRecall: '98.9%',
    chemicalDyeRecall: '99.1% (Resolves Tartrazine, Ponceau 4R, Spent Saffron & Glycerin O-H)',
    unitBomCost: '$1,150 – $1,450',
    deploymentTier: 'Tier-1 GI Certification Lab & Export Grading Line (Recommended Hybrid)',
    verdict: 'Gold-standard fusion: combines sub-12µm spatial morphology with chemometric dye rejection.',
  },
  {
    modality: 'Pushbroom Hyperspectral Imaging (HSI VIS-NIR)',
    opticalSpec: 'Specim FX10 Line-Scan Spectrograph (400–1000 nm) + Linear Translation Stage + Halogen Illumination',
    spatialResolution: '28.0 µm / pixel',
    spectralChannels: '224 Contiguous Spectral Bands (FWHM 5.5 nm)',
    botanicalAdulterantRecall: '95.2% (Lower spatial res misses fine apical papillae)',
    chemicalDyeRecall: '99.7% (Full chemometric crocin/picrocrocin/moisture assay)',
    unitBomCost: '$18,000 – $28,000',
    deploymentTier: 'Reference Calibration Laboratory (IIIM / SKUAST-K)',
    verdict: 'Too costly & slow for field deployment; used strictly to select the 9 optimal LED bands.',
  },
  {
    modality: 'Smartphone + 140x Foldscope / Clip-On Macro + ColorCard',
    opticalSpec: '48 MP Smartphone Main Sensor + 20x Achromatic Macro Lens + 3D-Printed Diffuser Hood + X-Rite 24-Patch Target',
    spatialResolution: '14.5 µm / pixel (Rolling shutter, variable ISP)',
    spectralChannels: '3 Bands (Bayer RGB, sRGB/RAW DNG)',
    botanicalAdulterantRecall: '93.8% (Strong on Safflower/Corn silk; sensitive to focus drift)',
    chemicalDyeRecall: '62.5% (Cannot reliably separate spent dyed saffron without NIR)',
    unitBomCost: '$35 – $65 add-on',
    deploymentTier: 'Tier-3 Farm-Gate & FPO Field Screening (Pampore / Kishtwar)',
    verdict: 'Rapid first-line triage for botanical adulterants; flags suspicious batches for Tier-1/2 lab assay.',
  },
];

export const HARDWARE_CAPTURE_ARCHITECTURE_ASCII = `
+===================================================================================================+
|            CROCUS-SPEC GI: HYBRID MULTISPECTRAL & POLARIMETRIC MACRO CAPTURE RIG                  |
+===================================================================================================+

                        [ Sony IMX253 / IMX264 Global Shutter CMOS ]
                                 (12 MP, 3.45 µm pixel pitch)
                                              |
                        [ Motorized Rotating Analyzer (0° / 90° Linear) ]
                                              |
                        [ 0.5x Bi-Telecentric Macro Objective (f/8, DOF 2.4mm) ]
                                              |
              +-------------------------------+-------------------------------+
              |          INTEGRATING HEMISPHERICAL PTFE DIFFUSER DOME         |
              |                                                               |
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
                       (Reveals internal vascular bundles & liquid meniscus bridges)
                                              |
                                              v
              +---------------------------------------------------------------+
              | STM32H7 Strobe Controller  <==Hardware Trigger==> Jetson Orin |
              | (90 ms full 9-band + dual-polarization acquisition sequence)  |
              +---------------------------------------------------------------+
`;

export const FULL_INFERENCE_WORKFLOW_ASCII = `
+---------------------------------------------------------------------------------------------------+
|                   END-TO-END MULTIMODAL INFERENCE & GI PURITY GRADING PIPELINE                    |
+---------------------------------------------------------------------------------------------------+

  [ Raw Capture Stack: I_parallel(RGB), I_perp(RGB), M_9band(405..940nm), I_backlight(850nm) ]
                                              |
                                              v
  +-----------------------------------------------------------------------------------------------+
  | STAGE 1: RADIOMETRIC & COLORIMETRIC CALIBRATION (< 6 ms on CUDA)                              |
  |  • Flat-Field & Dark-Current Correction: R(x,y,λ) = (I_raw - I_dark) / (I_white_tile - I_dark)|
  |  • Specular Glare Decomposition:         I_diffuse = 2 * I_perp  |  I_glare = I_par - I_perp  |
  |  • Root-Polynomial 3x11 Color Transform -> CIE L*a*b* & Chroma-Hue-Luminance (CHL)            |
  +-----------------------------------------------------------------------------------------------+
                                              |
                                              v
  +-----------------------------------------------------------------------------------------------+
  | STAGE 2: INSTANCE DE-CLUMPING & FILAMENT LOCALIZATION (YOLOv11m-seg / Mask2Former, ~14 ms)    |
  |  • Backlit 850nm Otsu + Distance Transform Watershed separates touching filaments             |
  |  • Oriented Bounding Box (OBB) + 28x28 Polygon Mask per individual filament (N ≈ 80-150/tray) |
  |  • Morphological Medial-Axis Skeletonization -> Length L(s), Width profile W(s), Apex Flare   |
  +-----------------------------------------------------------------------------------------------+
                                              |
                      +-----------------------+-----------------------+
                      | (Per-Filament ROI Crops: 224x224x12 Channels) |
                      v                                               v
  +---------------------------------------+       +-----------------------------------------------+
  | STAGE 3A: FINE-GRAINED MORPHO-SPECTRAL|       | STAGE 3B: OPEN-SET ANOMALY DETECTOR           |
  | HYBRID CLASSIFIER (ConvNeXt-Small +   |       | (PatchCore Memory Bank + Mahalanobis Head)    |
  | 1D Spectral SE-Attention, ~18 ms)     |       |                                               |
  |  • Classes: Authentic Mongra, Floral  |       |  • Extracts Stage-3 ConvNeXt feature vectors  |
  |    Style, Safflower, Dyed Corn Silk,  |       |  • Computes distance D_M(z) to GI Authentic   |
  |    Marigold, Coir/Nylon, Spent-Dyed,  |       |    Kashmiri manifold (Pampore/Kishtwar bank)  |
  |    Glycerin/Salt Weight-Loaded        |       |  • Flags unseen synthetic/chemical adulterants|
  +---------------------------------------+       +-----------------------------------------------+
                      |                                               |
                      +-----------------------+-----------------------+
                                              |
                                              v
  +-----------------------------------------------------------------------------------------------+
  | STAGE 4: GRAVIMETRIC PURITY AGGREGATION & EXPLAINABLE QA OVERLAY (< 4 ms)                     |
  |  • Filament Area-to-Mass Allometric Calibration:  m_i = α_c * Area_i * (Width_mean_i)^0.82    |
  |  • Gravimetric Purity Score (% w/w) = (Σ m_i [Mongra]) / (Σ m_i [Total Sample]) * 100         |
  |  • ISO 3632-1/2 & Kashmiri GI Threshold Gate + Grad-CAM++ / Spectral Residual Overlay         |
  +-----------------------------------------------------------------------------------------------+
`;

export const PYTORCH_PIPELINE_CODE = `"""
Kashmiri Saffron (Crocus sativus L.) Adulteration Detection Pipeline
Architecture: Dual-Stream Morpho-Spectral Network (ConvNeXt-Small + 1D Spectral Transformer)
with Supervised Contrastive Learning (SupCon) + Class-Balanced Focal Loss.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms.v2 as T
from typing import Dict, Tuple, List, Optional
import numpy as np


# =====================================================================
# 1. RADIOMETRIC PREPROCESSING & DOMAIN-INVARIANT AUGMENTATIONS
# =====================================================================
class SpectralFlatFieldNorm(nn.Module):
    """Normalizes raw 9-band VIS-NIR + Dual-Polarized RGB stack against in-frame Spectralon tile."""
    def __init__(self, eps: float = 1e-6):
        super().__init__()
        self.eps = eps

    def forward(self, raw_cube: torch.Tensor, dark_frame: torch.Tensor, white_ref: torch.Tensor) -> torch.Tensor:
        # raw_cube: (C, H, W) where C=12 [RGB_perp(3), Glare_residual(1), VIS_NIR_bands(8)]
        reflectance = (raw_cube - dark_frame) / (white_ref - dark_frame + self.eps)
        return torch.clamp(reflectance, 0.0, 1.5)


class SaffronFilamentDataset(Dataset):
    """
    Multi-Modal Filament Instance Dataset supporting:
      - 3-ch Cross-Polarized Diffuse RGB (glare-suppressed)
      - 1-ch Polarimetric Specular Glare Map (I_parallel - I_perp) for glycerin/salt coating
      - 8-ch Narrowband VIS-NIR Reflectance (405, 445, 505, 530, 590, 660, 850, 940 nm)
      - 6-dim Geometric Descriptor [length_mm, apex_flare_ratio, serration_idx, curvature, eccentricity, solidity]
    """
    CLASSES = [
        "authentic_mongra",       # 0: Pure Crocus sativus stigma
        "authentic_floral_style", # 1: Unpigmented yellow style (Lacha component)
        "safflower_floret",       # 2: Carthamus tinctorius
        "dyed_corn_silk",         # 3: Zea mays style + azo dye
        "dyed_marigold",          # 4: Tagetes erecta floret
        "dyed_coir_beet_fiber",   # 5: Shredded plant/coconut fiber
        "synthetic_nylon_thread", # 6: Extruded polymer/horsehair
        "spent_dyed_saffron",     # 7: Exhausted saffron + Tartrazine/Ponceau 4R
        "weight_loaded_saffron",  # 8: Glycerin/honey/mineral salt coated
    ]

    def __init__(
        self,
        manifest_records: List[Dict],
        is_train: bool = True,
        illumination_jitter_sigma: float = 0.03,
    ):
        self.records = manifest_records
        self.is_train = is_train
        self.illum_sigma = illumination_jitter_sigma

        # Spatial augmentations preserve scale-dependent cellular rib pitch
        self.spatial_aug = T.Compose([
            T.RandomHorizontalFlip(p=0.5),
            T.RandomVerticalFlip(p=0.5),
            T.RandomRotation(degrees=(-180, 180)),
            T.RandomAffine(degrees=0, translate=(0.05, 0.05), scale=(0.95, 1.05)),
        ])

    def __len__(self) -> int:
        return len(self.records)

    def _apply_physics_augmentations(self, cube: torch.Tensor) -> torch.Tensor:
        """Simulates LED thermal drift, moisture variance (940nm band), and specular micro-glare."""
        # 1. Per-band multiplicative illumination drift (simulates LED aging / temperature shift)
        band_gain = 1.0 + torch.randn(cube.shape[0], 1, 1) * self.illum_sigma
        cube = cube * band_gain

        # 2. Synthetic specular highlight injection on background plate (prevents plate overfitting)
        if torch.rand(1).item() < 0.30:
            glare_spot = torch.exp(-((torch.linspace(-1, 1, cube.shape[1])[:, None])**2 +
                                     (torch.linspace(-1, 1, cube.shape[2])[None, :])**2) / 0.08)
            cube[3] = torch.clamp(cube[3] + 0.15 * glare_spot, 0.0, 1.5)

        return cube

    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        rec = self.records[idx]
        # Load pre-calibrated 12-channel tensor (12, 224, 224) & 6-D morphological vector
        cube = torch.from_numpy(np.load(rec["tensor_path"])).float()
        morph_vec = torch.tensor(rec["morph_features"], dtype=torch.float32)
        label = torch.tensor(rec["class_id"], dtype=torch.long)
        is_authentic = torch.tensor(1 if rec["class_id"] == 0 else 0, dtype=torch.long)

        if self.is_train:
            cube = self.spatial_aug(cube)
            cube = self._apply_physics_augmentations(cube)

        # Extract spatially averaged 9-point spectral reflectance curve from filament foreground mask
        fg_mask = (cube[6] < 0.72).float()  # 660nm absorption mask
        mask_sum = fg_mask.sum().clamp(min=1.0)
        spectral_curve = (cube[3:12] * fg_mask.unsqueeze(0)).sum(dim=(1, 2)) / mask_sum

        return {
            "cube": cube,                       # (12, 224, 224)
            "spectral_curve": spectral_curve,   # (9,)
            "morph_vec": morph_vec,             # (6,)
            "label": label,                     # ()
            "is_authentic": is_authentic,       # ()
            "filament_area_mm2": torch.tensor(rec["area_mm2"], dtype=torch.float32),
        }


# =====================================================================
# 2. DUAL-STREAM MORPHO-SPECTRAL ARCHITECTURE WITH CROSS-ATTENTION
# =====================================================================
class Spectral1DAttentionEncoder(nn.Module):
    """Encodes 9-band VIS-NIR reflectance & 1st-order Savitzky-Golay derivative + 6D morphology."""
    def __init__(self, in_bands: int = 9, morph_dim: int = 6, embed_dim: int = 128):
        super().__init__()
        self.spec_conv = nn.Sequential(
            nn.Conv1d(2, 32, kernel_size=3, padding=1), # [Reflectance, dR/dλ]
            nn.BatchNorm1d(32),
            nn.GELU(),
            nn.Conv1d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm1d(64),
            nn.GELU(),
            nn.AdaptiveAvgPool1d(4),
            nn.Flatten(),
        )
        self.morph_mlp = nn.Sequential(
            nn.Linear(morph_dim, 64),
            nn.LayerNorm(64),
            nn.GELU(),
        )
        self.fusion = nn.Sequential(
            nn.Linear(64 * 4 + 64, embed_dim),
            nn.LayerNorm(embed_dim),
            nn.GELU(),
        )

    def forward(self, spec: torch.Tensor, morph: torch.Tensor) -> torch.Tensor:
        # Compute discrete 1st derivative dR/dλ to isolate sharp azo-dye absorption notches
        d_spec = F.pad(spec[:, 1:] - spec[:, :-1], (0, 1), mode="replicate")
        x_spec = torch.stack([spec, d_spec], dim=1)  # (B, 2, 9)
        h_spec = self.spec_conv(x_spec)
        h_morph = self.morph_mlp(morph)
        return self.fusion(torch.cat([h_spec, h_morph], dim=-1))


class CrocusSpecHybridNet(nn.Module):
    """
    Combines spatial epidermal texture representation with 1D chemometric spectral signature
    and outputs:
      1) Multi-class logits (9 classes)
      2) L2-normalized projection embedding for Supervised Contrastive (SupCon) loss
      3) Feature vector for Mahalanobis Open-Set Anomaly scoring (unseen adulterants)
    """
    def __init__(self, in_channels: int = 12, num_classes: int = 9, feat_dim: int = 384):
        super().__init__()
        # Spatial stem adapting 12-channel polarized + VIS-NIR cube
        self.spatial_backbone = nn.Sequential(
            nn.Conv2d(in_channels, 64, kernel_size=4, stride=4),
            nn.GroupNorm(8, 64),
            nn.GELU(),
            nn.Conv2d(64, 160, kernel_size=3, stride=2, padding=1),
            nn.GroupNorm(16, 160),
            nn.GELU(),
            nn.Conv2d(160, feat_dim, kernel_size=3, stride=2, padding=1),
            nn.GroupNorm(32, feat_dim),
            nn.GELU(),
        )
        self.spectral_encoder = Spectral1DAttentionEncoder(in_bands=9, morph_dim=6, embed_dim=128)

        # Cross-modal gating (Spectral signature modulates spatial feature channels)
        self.channel_gate = nn.Sequential(
            nn.Linear(128, feat_dim),
            nn.Sigmoid(),
        )

        self.classifier = nn.Linear(feat_dim + 128, num_classes)
        self.supcon_projector = nn.Sequential(
            nn.Linear(feat_dim + 128, 256),
            nn.GELU(),
            nn.Linear(256, 128),
        )

    def forward(self, cube: torch.Tensor, spec_curve: torch.Tensor, morph_vec: torch.Tensor) -> Dict[str, torch.Tensor]:
        f_map = self.spatial_backbone(cube)              # (B, 384, H', W') -> target for Grad-CAM++
        h_spec = self.spectral_encoder(spec_curve, morph_vec)  # (B, 128)

        gate = self.channel_gate(h_spec).unsqueeze(-1).unsqueeze(-1)
        gated_fmap = f_map * (1.0 + gate)
        h_spatial = gated_fmap.mean(dim=(-2, -1))        # (B, 384)

        joint_emb = torch.cat([h_spatial, h_spec], dim=-1) # (B, 512)
        logits = self.classifier(joint_emb)
        proj = F.normalize(self.supcon_projector(joint_emb), dim=-1)

        return {
            "logits": logits,
            "supcon_emb": proj,
            "joint_embedding": joint_emb,
            "feature_map": gated_fmap,
        }


# =====================================================================
# 3. COMPOSITE LOSS: CLASS-BALANCED FOCAL + SUPERVISED CONTRASTIVE
# =====================================================================
class ClassBalancedFocalSupConLoss(nn.Module):
    """
    Addresses extreme imbalance at 1% adulteration blends and pulls authentic seasonal harvest
    batches (Pampore, Kishtwar, Budgam) into a compact hyperspherical cluster.
    """
    def __init__(self, samples_per_class: List[int], beta: float = 0.9999, gamma: float = 2.0, temp: float = 0.07):
        super().__init__()
        effective_num = 1.0 - np.power(beta, samples_per_class)
        weights = (1.0 - beta) / np.array(effective_num)
        weights = weights / np.sum(weights) * len(samples_per_class)
        self.register_buffer("class_weights", torch.tensor(weights, dtype=torch.float32))
        self.gamma = gamma
        self.temp = temp

    def forward(self, logits: torch.Tensor, proj_emb: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        # 1. Class-Balanced Focal Loss
        ce_loss = F.cross_entropy(logits, targets, reduction="none", weight=self.class_weights)
        pt = torch.exp(-ce_loss)
        focal_loss = ((1.0 - pt) ** self.gamma * ce_loss).mean()

        # 2. Supervised Contrastive Loss
        sim_matrix = torch.matmul(proj_emb, proj_emb.T) / self.temp
        mask_same = torch.eq(targets.unsqueeze(1), targets.unsqueeze(0)).float()
        mask_self = torch.eye(targets.shape[0], device=targets.device)
        mask_pos = mask_same * (1.0 - mask_self)

        exp_sim = torch.exp(sim_matrix) * (1.0 - mask_self)
        log_prob = sim_matrix - torch.log(exp_sim.sum(dim=1, keepdim=True) + 1e-6)
        supcon_loss = -(mask_pos * log_prob).sum(dim=1) / mask_pos.sum(dim=1).clamp(min=1.0)

        return focal_loss + 0.35 * supcon_loss.mean()
`;
