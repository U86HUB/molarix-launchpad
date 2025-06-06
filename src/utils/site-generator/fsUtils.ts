
import fs from 'fs';
import path from 'path';

/**
 * Creates the output directory if it doesn't exist
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Writes the generated site files to disk
 */
export const writeSiteFiles = (
  siteOutputDir: string, 
  htmlString: string
): void => {
  // Write the HTML to file
  fs.writeFileSync(path.join(siteOutputDir, 'index.html'), htmlString);

  // Create a minimal CSS file for completeness
  fs.writeFileSync(path.join(siteOutputDir, 'styles.css'), '/* Site-specific styles */');
};
