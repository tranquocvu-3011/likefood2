const fs = require('fs');
const path = require('path');

const licenseBlock = `/**
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
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Xóa block comment cũ do script trước tạo ra
      const exactOldLicense = `/**\n * LIKEFOOD - Vietnamese Specialty Marketplace\n * Copyright (c) 2026 LIKEFOOD Team\n * Licensed under the MIT License\n * https://github.com/tranquocvu-3011/likefood\n */\n\n`;
      const exactOldLicenseUtf8BOM = `\uFEFF/**\n * LIKEFOOD - Vietnamese Specialty Marketplace\n * Copyright (c) 2026 LIKEFOOD Team\n * Licensed under the MIT License\n * https://github.com/tranquocvu-3011/likefood\n */\n\n`;
      
      let hasLicense = false;
      if (content.startsWith(exactOldLicense)) {
        content = content.substring(exactOldLicense.length);
        hasLicense = true;
      } else if (content.startsWith(exactOldLicenseUtf8BOM)) {
        content = content.substring(exactOldLicenseUtf8BOM.length);
        hasLicense = true;
      } else if (content.includes(exactOldLicense)) {
        content = content.replace(exactOldLicense, '');
        hasLicense = true;
      } else if (content.includes('LIKEFOOD - Vietnamese Specialty Marketplace\n * Copyright')) {
         // rough match
         const roughRegex = /\/\*\*(.|\n)*?LIKEFOOD - Vietnamese Specialty (.|\n)*?\*\/\n\n?/g;
         content = content.replace(roughRegex, '');
         hasLicense = true;
      }
      
      if (hasLicense) {
        // Tìm xem có directive 'use client' hay 'use server' không
        const directiveRegex = /^(['"]use (client|server)['"];?\s*)/;
        const match = content.match(directiveRegex);
        if (match) {
            content = match[1] + '\n' + licenseBlock + content.substring(match[1].length);
        } else {
            content = licenseBlock + content;
        }
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

console.log('Fixing use client directives...');
processDir('./src');
console.log('Completed successfully!');
