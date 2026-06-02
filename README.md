<div align="center">

# 🌿 PlantVision AI

### AI-Powered Plant Disease Detection Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-0.136-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/PyTorch-2.12-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ResNet50-97.3%25_Accuracy-10b981?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Custom_CNN-90.2%25_Accuracy-3b82f6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PlantVillage-38_Disease_Classes-f59e0b?style=for-the-badge" />
</p>

<br/>

> **Precision agronomy meets neural networks.** Upload a leaf image and get instant disease diagnosis, treatment recommendations, and supplement suggestions — powered by two production-grade deep learning models running in real-time.

<br/>

</div>

---

## 📸 Screenshots

| Landing Page | Detection Console |
|---|---|
| ![Landing](https://via.placeholder.com/480x300/0a0f1a/10b981?text=Landing+Page) | ![Detection](https://via.placeholder.com/480x300/0a0f1a/10b981?text=Detection+Console) |

| Intelligence Dashboard | Multi-Model Comparison |
|---|---|
| ![Dashboard](https://via.placeholder.com/480x300/0a0f1a/10b981?text=Intelligence+Dashboard) | ![Compare](https://via.placeholder.com/480x300/0a0f1a/10b981?text=Model+Comparison) |

---

## ✨ Features

### 🔬 AI Detection Engine
- **Dual-model inference** — Custom CNN and ResNet50 run independently or side-by-side
- **38 disease classes** across 14 plant species from the PlantVillage dataset
- **Real-time comparison** — both models analyze the same image simultaneously with latency benchmarking
- **Top-5 predictions** with confidence scores for every analysis

### 🖥️ Frontend
- **Dark-theme dashboard** — live model metrics, accuracy trends, throughput charts
- **Drag-and-drop upload** with instant preview
- **Interactive model selector** — switch between Custom CNN and ResNet50 with one click
- **Treatment cards** — disease description, step-by-step treatment, and supplement recommendations
- **Full comparison view** — confidence distribution bar chart, optimal model recommendation, risk alerts

### ⚡ Backend API
- **FastAPI** with automatic OpenAPI docs at `/docs`
- **CORS-enabled** for local development
- **Three prediction endpoints** — single model, dual model, and compare
- **Live stats endpoint** — validation metrics served directly from model evaluation data

---

## 🏗️ Architecture

### Project Structure

```
plant_ui/
├── frontend/                   # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Hero landing page
│   │   │   ├── Dashboard.jsx       # Intelligence dashboard
│   │   │   ├── Detection.jsx       # AI diagnostic console
│   │   │   ├── CompareModels.jsx   # Multi-model comparison
│   │   │   └── History.jsx         # Analysis history
│   │   ├── components/
│   │   │   └── Layout.jsx          # Sidebar + top bar layout
│   │   ├── api.js                  # API client (fetch wrappers)
│   │   ├── App.jsx                 # Router setup
│   │   └── index.css               # Tailwind + theme tokens
│   └── package.json
│
└── backend/                    # Python FastAPI
    ├── main.py                     # API routes & inference logic
    ├── models.py                   # Model architectures & loaders
    ├── plant_disease_customcnn/    # New Custom CNN (folder format)
    ├── plant_disease_resnet50/     # ResNet50 (folder format)
    ├── disease_info.csv            # Disease descriptions & steps
    └── supplement_info.csv         # Supplement recommendations
```

---

### 🧠 Model Architectures

#### Custom CNN — VGG-style (128×128 → 38 classes)

```
Input 128×128×3
    │
    ├─ Block 1 ── Conv 3→64 ── BN ── ReLU ── Conv 64→64 ── BN ── ReLU ── MaxPool → 64×64
    ├─ Block 2 ── Conv 64→128 ── BN ── ReLU ── Conv 128→128 ── BN ── ReLU ── MaxPool → 32×32
    ├─ Block 3 ── Conv 128→256 ── BN ── ReLU ── Conv 256→256 ── BN ── ReLU ── MaxPool → 16×16
    ├─ Block 4 ── Conv 256→512 ── BN ── ReLU ── Conv 512→512 ── BN ── ReLU ── MaxPool → 8×8
    ├─ Block 5 ── Conv 512→512 ── BN ── ReLU (no pool) → 8×8×512
    │
    └─ Classifier ── Flatten(32768) ── Dropout(0.5) ── FC(1024) ── ReLU ── Dropout(0.5) ── FC(38)
```

#### ResNet50 — Fine-tuned (224×224 → 38 classes)

```
Input 224×224×3
    │
    ├─ Stem ────── Conv 7×7 stride=2 ── BN ── ReLU ── MaxPool 3×3 → 56×56×64
    ├─ Layer 1 ─── 3× Bottleneck (64→256)                         → 56×56×256
    ├─ Layer 2 ─── 4× Bottleneck (128→512) stride=2               → 28×28×512
    ├─ Layer 3 ─── 6× Bottleneck (256→1024) stride=2              → 14×14×1024
    ├─ Layer 4 ─── 3× Bottleneck (512→2048) stride=2              → 7×7×2048
    │
    └─ Head ─────── AdaptiveAvgPool → Flatten(2048) ── Linear(38)
```

#### Model Comparison

| Property | Custom CNN | ResNet50 |
|---|---|---|
| Input Size | 128 × 128 | 224 × 224 |
| Parameters | ~14M | 23.6M |
| Val Accuracy | **90.2%** | **97.3%** |
| Avg Inference (CPU) | ~42ms | ~88ms |
| Classes | 38 | 38 |
| Architecture | VGG-style | Residual Network |
| Depth | 9 conv layers | 50 layers |

---

## 🌱 Disease Classes (38 Total)

| Plant | Diseases Covered |
|---|---|
| 🍎 Apple | Scab, Black Rot, Cedar Rust, Healthy |
| 🫐 Blueberry | Healthy |
| 🍒 Cherry | Powdery Mildew, Healthy |
| 🌽 Corn | Cercospora Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| 🍇 Grape | Black Rot, Esca (Black Measles), Leaf Blight, Healthy |
| 🍊 Orange | Huanglongbing (Citrus Greening) |
| 🍑 Peach | Bacterial Spot, Healthy |
| 🫑 Pepper | Bacterial Spot, Healthy |
| 🥔 Potato | Early Blight, Late Blight, Healthy |
| 🫐 Raspberry | Healthy |
| 🫘 Soybean | Healthy |
| 🎃 Squash | Powdery Mildew |
| 🍓 Strawberry | Leaf Scorch, Healthy |
| 🍅 Tomato | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/maa101-hub/plant_ui.git
cd plant_ui
```

### 2. Download model files

Download the following and place them in `backend/`:

| File | Description | Link |
|---|---|---|
| `plant_disease_customcnn/` | New Custom CNN (folder format) | Your trained model |
| `plant_disease_resnet50/` | ResNet50 fine-tuned (folder format) | Your trained model |
| `disease_info.csv` | Disease descriptions | Included in repo |
| `supplement_info.csv` | Supplement recommendations | Included in repo |

### 3. Start the Backend

```bash
cd backend
pip install fastapi uvicorn python-multipart pillow torch torchvision pandas
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at → `http://localhost:8000`
API docs at → `http://localhost:8000/docs`

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 📡 API Reference

### Base URL: `http://localhost:8000`

#### `GET /health`
Returns loaded model status.
```json
{
  "status": "healthy",
  "models_loaded": { "custom_cnn": true, "resnet50": true },
  "classes": { "custom_cnn": 38, "resnet50": 38 }
}
```

#### `POST /predict`
Predict disease from an uploaded image.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `file` | `File` | required | Leaf image (JPG, PNG, TIFF) |
| `model` | `string` | `custom_cnn` | `custom_cnn` or `resnet50` |

```bash
curl -X POST "http://localhost:8000/predict?model=resnet50" \
  -F "file=@leaf.jpg"
```

```json
{
  "success": true,
  "model_used": "resnet50",
  "latency_ms": 88.3,
  "prediction": {
    "disease_name": "Tomato : Early Blight",
    "confidence": 97.4,
    "is_healthy": false
  },
  "disease_info": {
    "description": "...",
    "possible_steps": "..."
  },
  "supplement": {
    "name": "Bonide Copper Fungicide",
    "buy_link": "https://..."
  },
  "top5": [...]
}
```

#### `POST /predict/compare`
Run both models simultaneously on the same image.

```bash
curl -X POST "http://localhost:8000/predict/compare" \
  -F "file=@leaf.jpg"
```

```json
{
  "custom_cnn": { ... },
  "resnet50": { ... },
  "summary": {
    "recommended_model": "resnet50",
    "avg_latency_ms": 65.2,
    "agreement": true
  }
}
```

#### `GET /stats`
Returns real validation metrics from the PlantVillage evaluation.

#### `GET /classes`
Returns all 38 class labels for both models.

---

## 📊 Dataset

| Property | Value |
|---|---|
| Dataset | [PlantVillage](https://github.com/spMohanty/PlantVillage-Dataset) |
| Total Images | 54,305 |
| Train Split | 43,444 (80%) |
| Validation Split | 10,861 (20%) |
| Classes | 38 disease categories |
| Image Format | RGB |

### Validation Results

| Model | Correct | Total | Accuracy |
|---|---|---|---|
| ResNet50 | 9,868 | 10,861 | **97.3%** |
| Custom CNN | 9,796 | 10,861 | **90.2%** |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 8 | Build tool |
| Tailwind CSS | 4 | Styling |
| React Router | 6 | Client-side routing |
| Recharts | latest | Dashboard charts |
| Lucide React | latest | Icons |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.136 | REST API |
| PyTorch | 2.12 | Model inference |
| torchvision | 0.27 | ResNet50 + transforms |
| Pillow | 12 | Image processing |
| pandas | 3 | CSV data loading |
| uvicorn | 0.48 | ASGI server |

---

## 🗺️ Roadmap

- [ ] Add VGG16 as a third model option
- [ ] Export analysis reports as PDF
- [ ] Upload history stored in SQLite
- [ ] Batch image processing endpoint
- [ ] GPU inference support
- [ ] Docker compose setup for one-command deployment
- [ ] Mobile-responsive layout

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with 🌿 for precision agriculture**

[PlantVillage Dataset](https://github.com/spMohanty/PlantVillage-Dataset) · [FastAPI Docs](https://fastapi.tiangolo.com) · [PyTorch](https://pytorch.org)

</div>
