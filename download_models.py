"""
PlantVision AI — Model Downloader
----------------------------------
Downloads both trained model folders from Google Drive into backend/.

Usage:
    pip install gdown
    python download_models.py
"""

import os
import subprocess
import sys

# ── Install gdown if not present ──────────────────────────────────────────────
try:
    import gdown
except ImportError:
    print("Installing gdown...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown"])
    import gdown

# ── Google Drive folder (contains both models) ────────────────────────────────
DRIVE_FOLDER_ID = "1xV_1wPDesZ-MYHesROaltngmM7SmSyJf"
DRIVE_URL       = f"https://drive.google.com/drive/folders/{DRIVE_FOLDER_ID}"
BACKEND_DIR     = os.path.join(os.path.dirname(__file__), "backend")

# ── Individual model folder IDs (sub-folders inside the Drive folder) ─────────
# gdown.download_folder downloads the entire parent folder.
# If you want to download each model separately, replace these IDs
# with the individual sub-folder share links.
MODELS = [
    {
        "name":        "plant_disease_customcnn",
        "description": "Custom CNN  — VGG-style, 38 classes, 128×128, ~90.2% acc",
    },
    {
        "name":        "plant_disease_resnet50",
        "description": "ResNet50    — Fine-tuned, 38 classes, 224×224, ~97.3% acc",
    },
]

def already_downloaded(name: str) -> bool:
    path = os.path.join(BACKEND_DIR, name)
    pkl  = os.path.join(path, "data.pkl")
    return os.path.isdir(path) and os.path.isfile(pkl)


def main():
    print("=" * 60)
    print("  PlantVision AI — Model Downloader")
    print("=" * 60)

    # Check what's already there
    missing = [m for m in MODELS if not already_downloaded(m["name"])]

    if not missing:
        print("\n✓ All models already present in backend/")
        for m in MODELS:
            print(f"  ✓ {m['name']}")
        return

    print(f"\nModels to download: {len(missing)}")
    for m in missing:
        print(f"  • {m['name']}  ({m['description']})")

    print(f"\nSource: {DRIVE_URL}")
    print(f"Target: {BACKEND_DIR}/\n")

    # Download entire Drive folder into a temp location, then move sub-folders
    tmp_dir = os.path.join(BACKEND_DIR, "_tmp_download")
    os.makedirs(tmp_dir, exist_ok=True)

    print("Downloading from Google Drive (this may take a few minutes)...")
    try:
        gdown.download_folder(
            url=DRIVE_URL,
            output=tmp_dir,
            quiet=False,
            use_cookies=False,
        )
    except Exception as e:
        print(f"\n✗ Download failed: {e}")
        print("\nManual download:")
        print(f"  1. Open: {DRIVE_URL}")
        print(f"  2. Download all folders")
        print(f"  3. Extract into:  {BACKEND_DIR}/")
        return

    # Move each model folder to backend/
    import shutil
    for m in MODELS:
        src = os.path.join(tmp_dir, m["name"])
        dst = os.path.join(BACKEND_DIR, m["name"])
        if os.path.isdir(src):
            if os.path.isdir(dst):
                shutil.rmtree(dst)
            shutil.move(src, dst)
            print(f"  ✓ {m['name']} → backend/{m['name']}/")
        else:
            print(f"  ⚠ {m['name']} not found in downloaded folder")

    # Clean up temp dir
    shutil.rmtree(tmp_dir, ignore_errors=True)

    print("\n" + "=" * 60)
    print("  Done! Models are ready in backend/")
    print("=" * 60)
    print("\nNext steps:")
    print("  cd backend")
    print("  python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload")


if __name__ == "__main__":
    main()
