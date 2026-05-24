const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Predator\\.gemini\\antigravity-ide\\brain\\54a8f622-9eae-4e55-84eb-bfb4d8ee30b4\\cute_waving_robot_1779652222982.png';
const dest = 'g:\\sandy.lifts\\public\\cute_waving_robot.png';

console.log('Attempting to copy from:', src);
console.log('To:', dest);

try {
  if (fs.existsSync(src)) {
    console.log('Source file exists!');
    fs.copyFileSync(src, dest);
    console.log('File successfully copied!');
  } else {
    console.log('Source file does NOT exist at this path.');
    // Let's list the parent directory to see what's there
    const parentDir = path.dirname(src);
    if (fs.existsSync(parentDir)) {
      console.log('Parent directory exists, contents:', fs.readdirSync(parentDir));
    } else {
      console.log('Parent directory does NOT exist:', parentDir);
    }
  }
} catch (err) {
  console.error('Error during copy:', err);
}
