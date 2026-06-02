"""Quick end-to-end test for all API endpoints."""
import requests
import warnings
import io
import numpy as np
from PIL import Image

warnings.filterwarnings('ignore')

BASE = 'http://localhost:8000'

# Create a green leaf-colored test image
img = Image.fromarray(np.array([[[34, 139, 34]] * 224] * 224, dtype=np.uint8))
buf = io.BytesIO()
img.save(buf, format='JPEG')

def get_buf():
    buf.seek(0)
    return buf

print('=== /health ===')
r = requests.get(f'{BASE}/health')
h = r.json()
print(f"Status: {h['status']}")
print(f"CNN loaded: {h['models_loaded']['custom_cnn']}")
print(f"ResNet loaded: {h['models_loaded']['resnet50']}")

print()
print('=== /stats ===')
r = requests.get(f'{BASE}/stats')
s = r.json()
print(f"Total predictions: {s['total_predictions']}")
print(f"Models: {[m['name'] for m in s['models']]}")

print()
print('=== /predict?model=custom_cnn ===')
r = requests.post(f'{BASE}/predict?model=custom_cnn',
                  files={'file': ('leaf.jpg', get_buf(), 'image/jpeg')})
d = r.json()
print(f"Disease: {d['prediction']['disease_name']}")
print(f"Confidence: {d['prediction']['confidence']}%")
print(f"Latency: {d['latency_ms']}ms")
print(f"Supplement: {d['supplement']['name']}")
print(f"Top5: {[x['class'] for x in d['top5']]}")

print()
print('=== /predict?model=resnet50 ===')
r = requests.post(f'{BASE}/predict?model=resnet50',
                  files={'file': ('leaf.jpg', get_buf(), 'image/jpeg')})
d = r.json()
print(f"Disease: {d['prediction']['disease_name']}")
print(f"Confidence: {d['prediction']['confidence']}%")
print(f"Latency: {d['latency_ms']}ms")

print()
print('=== /predict/compare ===')
r = requests.post(f'{BASE}/predict/compare',
                  files={'file': ('leaf.jpg', get_buf(), 'image/jpeg')})
d = r.json()
print(f"CNN:    {d['custom_cnn']['prediction']['disease_name']} ({d['custom_cnn']['prediction']['confidence']}%)")
print(f"ResNet: {d['resnet50']['prediction']['disease_name']} ({d['resnet50']['prediction']['confidence']}%)")
print(f"Recommended: {d['summary']['recommended_model']}")
print(f"Agreement: {d['summary']['agreement']}")
print(f"Avg latency: {d['summary']['avg_latency_ms']}ms")

print()
print('ALL TESTS PASSED ✓')
