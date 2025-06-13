import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'uploads');

try {
  fs.accessSync(uploadsDir, fs.constants.W_OK);
  console.log('uploads folder is writable');
} catch (err) {
  console.error('uploads folder is NOT writable:', err.message);
}
