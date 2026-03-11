/**
 * Script tạo placeholder PNG images cho public folder
 * Chạy: node scripts/generate-placeholders.js
 */
const { deflateSync } = require('zlib');
const { writeFileSync, mkdirSync } = require('fs');
const path = require('path');

function crc32(buf) {
    const table = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c;
    }
    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}

function createPNG(width, height, r, g, b, r2 = r, g2 = g, b2 = b) {
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    function chunk(type, data) {
        const t = Buffer.from(type, 'ascii');
        const crcVal = crc32(Buffer.concat([t, data]));
        const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
        const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crcVal, 0);
        return Buffer.concat([len, t, data, crcBuf]);
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; ihdr[9] = 2; // RGB

    const raw = Buffer.alloc(height * (width * 3 + 1));
    for (let y = 0; y < height; y++) {
        raw[y * (width * 3 + 1)] = 0; // filter: None
        const t = y / height;
        const cr = Math.round(r + (r2 - r) * t);
        const cg = Math.round(g + (g2 - g) * t);
        const cb = Math.round(b + (b2 - b) * t);
        for (let x = 0; x < width; x++) {
            raw[y * (width * 3 + 1) + 1 + x * 3] = cr;
            raw[y * (width * 3 + 1) + 2 + x * 3] = cg;
            raw[y * (width * 3 + 1) + 3 + x * 3] = cb;
        }
    }

    return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const publicDir = path.join(__dirname, '..', 'public');
const uploadsDir = path.join(publicDir, 'uploads');
mkdirSync(uploadsDir, { recursive: true });

const files = [
    // Category placeholder images (400x300)
    { name: 'cakho.png',      w: 400, h: 300, rgb: [96, 165, 250],  rgb2: [37, 99, 235]  }, // blue - Cá khô
    { name: 'muckho.png',     w: 400, h: 300, rgb: [251, 113, 133], rgb2: [225, 29, 72]  }, // rose - Mực khô
    { name: 'traicaysay.png', w: 400, h: 300, rgb: [52, 211, 153],  rgb2: [5, 150, 105]  }, // emerald - Trái cây sấy
    { name: 'mut_traicay.png',w: 400, h: 300, rgb: [251, 191, 36],  rgb2: [217, 119, 6]  }, // amber - Bánh mứt
    { name: 'giavi.png',      w: 400, h: 300, rgb: [251, 146, 60],  rgb2: [234, 88, 12]  }, // orange - Gia vị
    { name: 'loadtrang.png',  w: 200, h: 200, rgb: [237, 113, 46],  rgb2: [180, 60, 10]  }, // brand color
    // PWA icons
    { name: 'icon-192.png',   w: 192, h: 192, rgb: [237, 113, 46],  rgb2: [180, 60, 10]  },
    { name: 'icon-512.png',   w: 512, h: 512, rgb: [237, 113, 46],  rgb2: [180, 60, 10]  },
    // PWA screenshots (minimal)
    { name: 'screenshot-mobile.png',  w: 750,  h: 1334, rgb: [248, 250, 252], rgb2: [241, 245, 249] },
    { name: 'screenshot-desktop.png', w: 1280, h: 720,  rgb: [248, 250, 252], rgb2: [241, 245, 249] },
];

files.forEach(({ name, w, h, rgb, rgb2 }) => {
    const [r, g, b] = rgb;
    const [r2, g2, b2] = rgb2 || rgb;
    const buf = createPNG(w, h, r, g, b, r2, g2, b2);
    const dest = path.join(publicDir, name);
    writeFileSync(dest, buf);
    console.log(`✅ Created ${name} (${w}x${h})`);
});

console.log('\nDone! All placeholder images created.');
