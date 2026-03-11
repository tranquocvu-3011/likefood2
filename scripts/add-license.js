const fs = require('fs');
const path = require('path');

const licenseText = `/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (!content.startsWith('/**\n * LIKEFOOD')) {
                fs.writeFileSync(fullPath, licenseText + content, 'utf8');
            }
        }
    }
}

console.log('Adding MIT License to all .ts and .tsx files...');
processDir('./src');
console.log('Completed successfully!');
