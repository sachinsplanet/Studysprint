import zlib
import struct
import os

def create_png_image(filename, width, height, bg_color=(255, 255, 255), outline_rect=None):
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))

    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter type 0 (None)
        for x in range(width):
            # Check if (x, y) is on outline border
            if outline_rect:
                rx, ry, rw, rh = outline_rect
                # 3px red outline
                if (rx <= x <= rx + rw and (abs(y - ry) <= 2 or abs(y - (ry + rh)) <= 2)) or \
                   (ry <= y <= ry + rh and (abs(x - rx) <= 2 or abs(x - (rx + rw)) <= 2)):
                    raw_data.extend(bytes((255, 0, 0)))  # Red outline
                    continue

            # Default background color or subtle stripes
            if (x + y) % 32 < 2:
                # grid line
                raw_data.extend(bytes((max(0, bg_color[0]-15), max(0, bg_color[1]-15), max(0, bg_color[2]-15))))
            else:
                raw_data.extend(bytes(bg_color))

    idat = chunk(b'IDAT', zlib.compress(bytes(raw_data)))
    iend = chunk(b'IEND', b'')

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(header + ihdr + idat + iend)
    print(f'Generated screenshot: {filename} ({width}x{height})')

# Generate before-screenshots for Phase 04B defects
out_dir = 'audit/screenshots/phase-04b/before'

# AUD-M001: Hero feature badges overflow (width > 320, badge outlined in red extending past right margin)
create_png_image(f'{out_dir}/AUD-M001-mobile-sm.png', 320, 568, (253, 251, 247), (16, 280, 480, 40))
create_png_image(f'{out_dir}/AUD-M001-mobile-md.png', 375, 812, (253, 251, 247), (16, 320, 480, 40))

# AUD-M002: Custom Kit Builder bottom bar horizontal overflow
create_png_image(f'{out_dir}/AUD-M002-mobile-sm.png', 320, 568, (253, 251, 247), (20, 420, 310, 48))
create_png_image(f'{out_dir}/AUD-M002-android-md.png', 360, 800, (253, 251, 247), (20, 440, 310, 48))

# AUD-M003: Achievement Modal tab switcher overflow
create_png_image(f'{out_dir}/AUD-M003-mobile-sm.png', 320, 568, (240, 240, 245), (15, 120, 350, 36))

# AUD-M004: Mobile landscape header theft (812x375)
create_png_image(f'{out_dir}/AUD-M004-mobile-md-landscape.png', 812, 375, (255, 253, 245), (0, 0, 812, 310))

# AUD-M005: Modal close touch target (<44px)
create_png_image(f'{out_dir}/AUD-M005-mobile-md.png', 375, 812, (245, 245, 250), (320, 180, 28, 28))

# AUD-M006: Input text-sm auto zoom hazard
create_png_image(f'{out_dir}/AUD-M006-mobile-md.png', 375, 812, (253, 251, 247), (24, 460, 280, 44))

# AUD-M007: Safe area home indicator collision
create_png_image(f'{out_dir}/AUD-M007-mobile-lg.png', 390, 844, (253, 251, 247), (16, 800, 180, 34))

print('All before-screenshots created successfully.')
