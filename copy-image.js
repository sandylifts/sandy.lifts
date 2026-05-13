const fs = require('fs');
const path = require('path');

const src = path.join(
  'C:\\Users\\Predator\\.gemini\\antigravity\\brain\\b9edead0-532a-47f9-83dc-6ab78c514c22\\body_model_hologram_1777884474023.png'
);
const dest = path.join(__dirname, 'public', 'body-hologram.png');

try {
  fs.copyFileSync(src, dest);
  console.log('✅ body-hologram.png copied to public/ successfully!');
} catch (e) {
  console.error('❌ Error:', e.message);
}
