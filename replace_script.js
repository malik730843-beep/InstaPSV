const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/posts/new/page.tsx');
const fileContent = fs.readFileSync(filePath, 'utf8');

const lines = fileContent.split('\n');
// We want to replace lines 643 to 971 (1-indexed)
// Arrays are 0-indexed, so index 642 to 970.

const startLine = 643;
const endLine = 971;

const newLines = [
    ...lines.slice(0, startLine - 1),
    '                    {/* SEO Section */}',
    '                    <SEOPanel formData={formData} setFormData={setFormData} />',
    ...lines.slice(endLine)
];

fs.writeFileSync(filePath, newLines.join('\n'));
console.log('File updated successfully');
