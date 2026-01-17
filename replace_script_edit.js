const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/posts/[id]/edit/page.tsx');
const fileContent = fs.readFileSync(filePath, 'utf8');

const lines = fileContent.split('\n');

// Target block lines based on view_file output
const startLine = 655;
const endLine = 983;

// Double check just in case, but assuming lines are stable since we just read them.
const newLines = [
    ...lines.slice(0, startLine - 1),
    '                    {/* SEO Section */}',
    '                    <SEOPanel formData={formData} setFormData={setFormData} />',
    ...lines.slice(endLine)
];

fs.writeFileSync(filePath, newLines.join('\n'));
console.log('File updated successfully');
