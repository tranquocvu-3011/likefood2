/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 *
 * Script to add MIT license headers to all TypeScript files
 * Run: node scripts/add-license-headers.js
 */

const fs = require('fs');
const path = require('path');

const LICENSE_HEADER = `/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

`;

const SRC_DIR = path.join(__dirname, '..', 'src');

function shouldSkipFile(filePath) {
    const skipDirs = ['node_modules', '.next', 'generated', 'tests'];
    const skipFiles = ['.d.ts', '.test.ts', '.spec.ts'];
    
    for (const dir of skipDirs) {
        if (filePath.includes(dir)) return true;
    }
    for (const ext of skipFiles) {
        if (filePath.endsWith(ext)) return true;
    }
    return false;
}

function addLicenseHeader(filePath) {
    if (shouldSkipFile(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has license
    if (content.includes('LIKEFOOD - Vietnamese Specialty Marketplace')) {
        console.log(`  â­ï¸  Skipped (already has header): ${filePath}`);
        return;
    }
    
    // Add license header
    const newContent = LICENSE_HEADER + content;
    fs.writeFileSync(filePath, newContent);
    console.log(`  âœ… Added: ${filePath}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            addLicenseHeader(filePath);
        }
    }
}

console.log('Adding license headers to TypeScript files...');
walkDir(SRC_DIR);
console.log('Done!');


