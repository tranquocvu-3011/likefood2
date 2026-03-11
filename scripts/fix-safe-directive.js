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

            // Xoá BOM
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }

            // Xóa tất cả các block comment chứa LIKEFOOD bằng cách tìm indexOf
            while (true) {
                let startIndex = content.indexOf('/**');
                let bomIndex = content.indexOf('\uFEFF/**');
                if (bomIndex !== -1 && bomIndex < startIndex) startIndex = bomIndex;

                if (startIndex === -1) break;

                const endIndex = content.indexOf('*/', startIndex);
                if (endIndex === -1) break;

                const block = content.substring(startIndex, endIndex + 2);
                if (block.includes('LIKEFOOD - Vietnamese Specialty Marketplace')) {
                    content = content.substring(0, startIndex) + content.substring(endIndex + 2);
                } else {
                    break;
                }
            }

            // Xoá BOM lần nữa giữa các dòng (nếu do script trước chèn lỗi)
            content = content.replace(/\uFEFF/g, '');

            // Lấy directive ra
            let hasUseClient = false;
            let hasUseServer = false;

            // Xoá directive cũ
            const clientRegex = /^.*['"\`]use client['"\`];?.*$/gm;
            if (clientRegex.test(content)) hasUseClient = true;
            content = content.replace(clientRegex, '');

            const serverRegex = /^.*['"\`]use server['"\`];?.*$/gm;
            if (serverRegex.test(content)) hasUseServer = true;
            content = content.replace(serverRegex, '');

            // Trim
            content = content.replace(/^\s+/, '');

            let prefix = '';
            if (hasUseClient) prefix += '"use client";\n\n';
            if (hasUseServer) prefix += '"use server";\n\n';

            prefix += licenseBlock + '\n';

            fs.writeFileSync(fullPath, prefix + content, 'utf8');
        }
    }
}

try {
    processDir('./src');
    console.log('Done cleaning up files completely!');
} catch (err) {
    console.error(err);
}
