import os
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

IMG_PATH = 'client/public/assets/images/hero/hero-about-commercial-factory.jpg'
LOGO_PATH = 'client/public/Lotus Tubes Logo.png'
BACKUP_PATH = 'client/public/assets/images/hero/hero-about-commercial-factory-orig.jpg'

if not os.path.exists(BACKUP_PATH):
    import shutil
    shutil.copyfile(IMG_PATH, BACKUP_PATH)

img = Image.open(BACKUP_PATH).convert('RGBA')
w, h = img.size
print(f"Loaded factory image: {w}x{h}")

# 1. Seamless inpaint of fake 'GLOBAL' text
# Panel area: x: 370 to 570, y: 320 to 450
clean_wall = img.crop((375, 275, 575, 320)).resize((210, 135), Image.Resampling.LANCZOS)
mask = Image.new('L', (210, 135), 255)
draw_mask = ImageDraw.Draw(mask)
for i in range(15):
    alpha = int(255 * (i / 15.0))
    draw_mask.rectangle([i, i, 209 - i, 134 - i], outline=alpha)

img.paste(clean_wall, (370, 315), mask)

# Also clean small trailer text
trailer_clean1 = img.crop((880, 475, 930, 485)).resize((50, 12), Image.Resampling.BILINEAR)
img.paste(trailer_clean1, (880, 485))

# 2. Official Lotus Tubes Architectural Signage
logo = Image.open(LOGO_PATH).convert('RGBA')
bbox = logo.getbbox()
logo_cropped = logo.crop(bbox)

# Scaled signage for main facade
sign_w = 210
sign_h = int(logo_cropped.height * (sign_w / logo_cropped.width))
logo_resized = logo_cropped.resize((sign_w, sign_h), Image.Resampling.LANCZOS)

# Crisp white backing panel with subtle rounded corners for professional modern architectural mount
panel_pad = 12
panel_w = sign_w + (panel_pad * 2)
panel_h = sign_h + (panel_pad * 2)
mount_panel = Image.new('RGBA', (panel_w, panel_h), (255, 255, 255, 235))

# Subtle border and drop shadow on the mounting panel
draw_panel = ImageDraw.Draw(mount_panel)
draw_panel.rectangle([0, 0, panel_w - 1, panel_h - 1], outline=(200, 210, 225, 255), width=2)
mount_panel.paste(logo_resized, (panel_pad, panel_pad), logo_resized)

# Drop shadow for the panel
shadow = Image.new('RGBA', (panel_w + 16, panel_h + 16), (0, 0, 0, 0))
shadow_fill = Image.new('RGBA', (panel_w, panel_h), (10, 15, 25, 140))
shadow.paste(shadow_fill, (8, 8))
shadow = shadow.filter(ImageFilter.GaussianBlur(5))

# Position on the facade
sign_x = 380
sign_y = 330

img.paste(shadow, (sign_x - 4, sign_y - 4), shadow)
img.paste(mount_panel, (sign_x, sign_y), mount_panel)

# Save as final high-quality JPEG
final_rgb = img.convert('RGB')
final_rgb.save(IMG_PATH, quality=96, optimize=True)
print(f"Successfully branded About Us hero image with prominent Lotus Tubes signage at {IMG_PATH}!")
