import os
import shutil
from PIL import Image

BASE_DIR = os.path.abspath('.')
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
ARCHIVE_DIR = os.path.join(BASE_DIR, 'archive', 'original-photos')

os.makedirs(ARCHIVE_DIR, exist_ok=True)
os.makedirs(os.path.join(ARCHIVE_DIR, 'events'), exist_ok=True)

image_specs = [
    # (relative path under public, max_dimension, quality, is_lossless_transparent)
    ('poethra_hero_literary.png', 1400, 85, False),
    ('grahathya-dharani-dhar.png', 1024, 82, True),
    ('aditya-p-dixit.png', 1024, 82, True),
    ('suman-founder.png', 1024, 82, True),
    ('herdev-anish-founder.png', 1024, 82, True),
    ('3d4e5f6a.png', 1024, 82, True),
    ('events/dead-poets-society-screening.jpg', 1200, 82, False),
    ('events/library-book-fair.jpg', 1200, 82, False),
    ('events/icebreaker-session.jpg', 1200, 82, False),
]

print("=== 1. Backing up master original files to archive/original-photos/ ===")
for rel_path, _, _, _ in image_specs:
    src_file = os.path.join(PUBLIC_DIR, rel_path)
    if os.path.exists(src_file):
        dst_file = os.path.join(ARCHIVE_DIR, rel_path)
        shutil.copy2(src_file, dst_file)
        orig_sz = os.path.getsize(src_file)
        print(f"Archived backup: {rel_path} ({orig_sz / 1024 / 1024:.2f} MB)")

# Also backup club_logo.jpg
logo_src = os.path.join(PUBLIC_DIR, 'club_logo.jpg')
if os.path.exists(logo_src):
    shutil.copy2(logo_src, os.path.join(ARCHIVE_DIR, 'club_logo.jpg'))
    print("Archived backup: club_logo.jpg")

print("\n=== 2. Generating optimized WebP assets in public/ ===")
total_orig = 0
total_new = 0

for rel_path, max_dim, quality, has_alpha in image_specs:
    src_file = os.path.join(ARCHIVE_DIR, rel_path)
    if not os.path.exists(src_file):
        continue
    
    orig_sz = os.path.getsize(src_file)
    total_orig += orig_sz
    
    base_name, _ = os.path.splitext(rel_path)
    webp_rel_path = f"{base_name}.webp"
    dst_webp = os.path.join(PUBLIC_DIR, webp_rel_path)
    
    im = Image.open(src_file)
    w, h = im.size
    
    if max(w, h) > max_dim:
        ratio = max_dim / max(w, h)
        new_w, new_h = int(w * ratio), int(h * ratio)
        im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        im.save(dst_webp, 'WEBP', quality=quality, method=6)
    else:
        im.convert('RGB').save(dst_webp, 'WEBP', quality=quality, method=6)
        
    new_sz = os.path.getsize(dst_webp)
    total_new += new_sz
    pct = (1 - new_sz / orig_sz) * 100
    print(f"Generated: {webp_rel_path} | {orig_sz / 1024 / 1024:.2f} MB -> {new_sz / 1024:.1f} KB (-{pct:.1f}%)")

print(f"\nTOTAL SAVINGS: {total_orig / 1024 / 1024:.2f} MB -> {total_new / 1024 / 1024:.2f} MB ({(1 - total_new / total_orig) * 100:.1f}% reduction)")

print("\n=== 3. Cleaning up old heavy files from public/ (preserved in archive/) ===")
for rel_path, _, _, _ in image_specs:
    f = os.path.join(PUBLIC_DIR, rel_path)
    if os.path.exists(f):
        os.remove(f)
        print(f"Removed heavy duplicate from public: {rel_path}")

print("\nImage optimization complete!")
