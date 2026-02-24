# Resize the Holy Echoes splash screen logo by reducing it to 60% of its current
# size (a 40% reduction) while preserving the original canvas dimensions and
# centering the logo on a transparent background. Applies to the source asset,
# the Android splash drawable, and all iOS splash imageset files.

from PIL import Image
import os

SCALE = 0.6

FILES = [
    "assets/splash.png",
    "android/app/src/main/res/drawable/splash_logo.png",
    "ios/App/App/Assets.xcassets/Splash.imageset/Default@1x~universal~anyany.png",
    "ios/App/App/Assets.xcassets/Splash.imageset/Default@2x~universal~anyany.png",
    "ios/App/App/Assets.xcassets/Splash.imageset/Default@3x~universal~anyany.png",
    "ios/App/App/Assets.xcassets/Splash.imageset/Default@1x~universal~anyany-dark.png",
    "ios/App/App/Assets.xcassets/Splash.imageset/Default@2x~universal~anyany-dark.png",
    "ios/App/App/Assets.xcassets/Splash.imageset/Default@3x~universal~anyany-dark.png",
]

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for relative_path in FILES:
    path = os.path.join(REPO_ROOT, relative_path)

    if not os.path.exists(path):
        print(f"SKIP (not found): {relative_path}")
        continue

    original = Image.open(path).convert("RGBA")
    original_w, original_h = original.size

    new_w = round(original_w * SCALE)
    new_h = round(original_h * SCALE)
    resized = original.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGBA", (original_w, original_h), (0, 0, 0, 0))
    offset_x = (original_w - new_w) // 2
    offset_y = (original_h - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y))

    canvas.save(path)
    print(f"OK: {relative_path} ({original_w}x{original_h} -> logo at {new_w}x{new_h})")
