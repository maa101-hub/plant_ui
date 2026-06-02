"""
Model definitions and class label mappings for both CNN and ResNet50.
"""
import os
import pickle
import torch
import torch.nn as nn
import torchvision.models as tv_models

# ── Class labels ───────────────────────────────────────────────────────────────

# Custom CNN — 39 classes (includes Background_without_leaves at index 4)
CNN_CLASSES = {
    0:  'Apple___Apple_scab',
    1:  'Apple___Black_rot',
    2:  'Apple___Cedar_apple_rust',
    3:  'Apple___healthy',
    4:  'Background_without_leaves',
    5:  'Blueberry___healthy',
    6:  'Cherry___Powdery_mildew',
    7:  'Cherry___healthy',
    8:  'Corn___Cercospora_leaf_spot Gray_leaf_spot',
    9:  'Corn___Common_rust',
    10: 'Corn___Northern_Leaf_Blight',
    11: 'Corn___healthy',
    12: 'Grape___Black_rot',
    13: 'Grape___Esca_(Black_Measles)',
    14: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    15: 'Grape___healthy',
    16: 'Orange___Haunglongbing_(Citrus_greening)',
    17: 'Peach___Bacterial_spot',
    18: 'Peach___healthy',
    19: 'Pepper,_bell___Bacterial_spot',
    20: 'Pepper,_bell___healthy',
    21: 'Potato___Early_blight',
    22: 'Potato___Late_blight',
    23: 'Potato___healthy',
    24: 'Raspberry___healthy',
    25: 'Soybean___healthy',
    26: 'Squash___Powdery_mildew',
    27: 'Strawberry___Leaf_scorch',
    28: 'Strawberry___healthy',
    29: 'Tomato___Bacterial_spot',
    30: 'Tomato___Early_blight',
    31: 'Tomato___Late_blight',
    32: 'Tomato___Leaf_Mold',
    33: 'Tomato___Septoria_leaf_spot',
    34: 'Tomato___Spider_mites Two-spotted_spider_mite',
    35: 'Tomato___Target_Spot',
    36: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    37: 'Tomato___Tomato_mosaic_virus',
    38: 'Tomato___healthy',
}

# ResNet50 — 38 classes (no Background_without_leaves)
# Same order as CNN but with index 4 removed and rest shifted down
RESNET_CLASSES = {
    0:  'Apple___Apple_scab',
    1:  'Apple___Black_rot',
    2:  'Apple___Cedar_apple_rust',
    3:  'Apple___healthy',
    4:  'Blueberry___healthy',
    5:  'Cherry___Powdery_mildew',
    6:  'Cherry___healthy',
    7:  'Corn___Cercospora_leaf_spot Gray_leaf_spot',
    8:  'Corn___Common_rust',
    9:  'Corn___Northern_Leaf_Blight',
    10: 'Corn___healthy',
    11: 'Grape___Black_rot',
    12: 'Grape___Esca_(Black_Measles)',
    13: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    14: 'Grape___healthy',
    15: 'Orange___Haunglongbing_(Citrus_greening)',
    16: 'Peach___Bacterial_spot',
    17: 'Peach___healthy',
    18: 'Pepper,_bell___Bacterial_spot',
    19: 'Pepper,_bell___healthy',
    20: 'Potato___Early_blight',
    21: 'Potato___Late_blight',
    22: 'Potato___healthy',
    23: 'Raspberry___healthy',
    24: 'Soybean___healthy',
    25: 'Squash___Powdery_mildew',
    26: 'Strawberry___Leaf_scorch',
    27: 'Strawberry___healthy',
    28: 'Tomato___Bacterial_spot',
    29: 'Tomato___Early_blight',
    30: 'Tomato___Late_blight',
    31: 'Tomato___Leaf_Mold',
    32: 'Tomato___Septoria_leaf_spot',
    33: 'Tomato___Spider_mites Two-spotted_spider_mite',
    34: 'Tomato___Target_Spot',
    35: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    36: 'Tomato___Tomato_mosaic_virus',
    37: 'Tomato___healthy',
}

# Map ResNet class label → CNN index (for CSV lookup)
_RESNET_LABEL_TO_CNN_IDX = {v: k for k, v in CNN_CLASSES.items()}
def resnet_idx_to_csv_idx(resnet_idx: int) -> int:
    label = RESNET_CLASSES[resnet_idx]
    return _RESNET_LABEL_TO_CNN_IDX.get(label, resnet_idx)

# New Custom CNN uses same 38-class map as ResNet50
NEW_CNN_CLASSES = RESNET_CLASSES

def new_cnn_idx_to_csv_idx(idx: int) -> int:
    """Map new CNN class index → disease_info.csv row index."""
    label = NEW_CNN_CLASSES[idx]
    return _RESNET_LABEL_TO_CNN_IDX.get(label, idx)


# ── Custom CNN architecture (original .pt file — 39 classes, 224×224) ─────────

class CustomCNN(nn.Module):
    """Original Custom CNN — 39 classes, trained on 224×224 images."""
    def __init__(self, num_classes=39):
        super().__init__()
        self.conv_layers = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(), nn.BatchNorm2d(32),
            nn.Conv2d(32, 32, 3, padding=1), nn.ReLU(), nn.BatchNorm2d(32),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.BatchNorm2d(64),
            nn.Conv2d(64, 64, 3, padding=1), nn.ReLU(), nn.BatchNorm2d(64),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1), nn.ReLU(), nn.BatchNorm2d(128),
            nn.Conv2d(128, 128, 3, padding=1), nn.ReLU(), nn.BatchNorm2d(128),
            nn.MaxPool2d(2),
            nn.Conv2d(128, 256, 3, padding=1), nn.ReLU(), nn.BatchNorm2d(256),
            nn.Conv2d(256, 256, 3, padding=1), nn.ReLU(), nn.BatchNorm2d(256),
            nn.MaxPool2d(2),
        )
        self.dense_layers = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(50176, 1024),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(1024, num_classes),
        )

    def forward(self, x):
        out = self.conv_layers(x)
        out = out.view(-1, 50176)
        return self.dense_layers(out)


# ── New Custom CNN architecture (folder format — 38 classes, 128×128) ─────────

class NewCustomCNN(nn.Module):
    """
    New Custom CNN — 38 classes, trained on 128×128 images.
    VGG-style: 5 conv blocks (64→64→128→128→256→256→512→512→512)
    with BatchNorm, 4 MaxPool2d, then classifier head.
    Flatten size: 8×8×512 = 32768
    """
    def __init__(self, num_classes=38):
        super().__init__()
        self.features = nn.Sequential(
            # Block 1: 128→64
            nn.Conv2d(3, 64, 3, padding=1),     # 0
            nn.BatchNorm2d(64),                  # 1
            nn.ReLU(inplace=True),               # 2
            nn.Conv2d(64, 64, 3, padding=1),    # 3
            nn.BatchNorm2d(64),                  # 4
            nn.ReLU(inplace=True),               # 5
            nn.MaxPool2d(2, 2),                  # 6  → 64×64
            # Block 2: 64→32
            nn.Conv2d(64, 128, 3, padding=1),   # 7
            nn.BatchNorm2d(128),                 # 8
            nn.ReLU(inplace=True),               # 9
            nn.Conv2d(128, 128, 3, padding=1),  # 10
            nn.BatchNorm2d(128),                 # 11
            nn.ReLU(inplace=True),               # 12
            nn.MaxPool2d(2, 2),                  # 13 → 32×32
            # Block 3: 32→16
            nn.Conv2d(128, 256, 3, padding=1),  # 14
            nn.BatchNorm2d(256),                 # 15
            nn.ReLU(inplace=True),               # 16
            nn.Conv2d(256, 256, 3, padding=1),  # 17
            nn.BatchNorm2d(256),                 # 18
            nn.ReLU(inplace=True),               # 19
            nn.MaxPool2d(2, 2),                  # 20 → 16×16
            # Block 4: 16→8
            nn.Conv2d(256, 512, 3, padding=1),  # 21
            nn.BatchNorm2d(512),                 # 22
            nn.ReLU(inplace=True),               # 23
            nn.Conv2d(512, 512, 3, padding=1),  # 24
            nn.BatchNorm2d(512),                 # 25
            nn.ReLU(inplace=True),               # 26
            nn.MaxPool2d(2, 2),                  # 27 → 8×8
            # Block 5: stays 8×8 (no pool)
            nn.Conv2d(512, 512, 3, padding=1),  # 28
            nn.BatchNorm2d(512),                 # 29
            nn.ReLU(inplace=True),               # 30
        )
        # 8×8×512 = 32768
        self.classifier = nn.Sequential(
            nn.Dropout(0.5),                     # 0
            nn.Linear(32768, 1024),              # 1
            nn.ReLU(inplace=True),               # 2
            nn.Dropout(0.5),                     # 3
            nn.Linear(1024, num_classes),        # 4
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.classifier(x)


# ── Folder-format loader for ResNet50 ─────────────────────────────────────────

class _FolderUnpickler(pickle.Unpickler):
    def __init__(self, f, data_dir):
        super().__init__(f)
        self.data_dir = data_dir

    def persistent_load(self, pid):
        _, storage_class, key, device, numel = pid
        path = os.path.join(self.data_dir, key)
        with open(path, 'rb') as df:
            data = df.read()
        return storage_class.from_buffer(data, 'little')


def load_resnet50(folder_path: str) -> nn.Module:
    """Load ResNet50 from PyTorch folder-format save."""
    data_dir = os.path.join(folder_path, 'data')
    pkl_path = os.path.join(folder_path, 'data.pkl')
    with open(pkl_path, 'rb') as f:
        state_dict = _FolderUnpickler(f, data_dir).load()
    model = tv_models.resnet50(weights=None)
    model.fc = nn.Linear(model.fc.in_features, 38)
    model.load_state_dict(state_dict)
    model.eval()
    return model


def load_custom_cnn(pt_path: str) -> nn.Module:
    """Load original Custom CNN from .pt state dict file (39 classes, 224×224)."""
    model = CustomCNN(39)
    model.load_state_dict(torch.load(pt_path, map_location='cpu'))
    model.eval()
    return model


def load_new_custom_cnn(folder_path: str) -> nn.Module:
    """Load new Custom CNN from PyTorch folder-format save (38 classes, 128×128)."""
    data_dir = os.path.join(folder_path, 'data')
    pkl_path = os.path.join(folder_path, 'data.pkl')
    with open(pkl_path, 'rb') as f:
        state_dict = _FolderUnpickler(f, data_dir).load()
    model = NewCustomCNN(38)
    model.load_state_dict(state_dict)
    model.eval()
    return model
