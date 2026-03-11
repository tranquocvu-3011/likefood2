const fs = require('fs');
const path = require('path');

const replacements = {
    '\\.orderEvent\\b': '.orderevent',
    '\\.productVariant\\b': '.productvariant',
    '\\.cartItem\\b': '.cartitem',
    '\\.productImage\\b': '.productimage',
    '\\.userVoucher\\b': '.uservoucher',
    '\\.pointTransaction\\b': '.pointtransaction',
    '\\.reviewMedia\\b': '.reviewmedia',
    '\\.loginHistory\\b': '.loginhistory',
    '\\.twoFactorToken\\b': '.twofactortoken',
    '\\.activeSession\\b': '.activesession'
};

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            for (const [pattern, replacement] of Object.entries(replacements)) {
                const regex = new RegExp(pattern, 'g');
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}

console.log('Fixing Prisma casing...');
processDir('./src');
console.log('Completed successfully!');
