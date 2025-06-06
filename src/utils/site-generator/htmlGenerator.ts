
/**
 * Generates the full HTML document string for the site
 */
export const generateHtmlDocument = (
  siteName: string,
  primaryColor: string | null | undefined,
  fontStyle: string | null | undefined,
  sectionsHtml: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${siteName}</title>
      <style>
        :root {
          --primary-color: ${primaryColor || '#0066cc'};
          --font-family: ${fontStyle || 'system-ui, sans-serif'};
        }
        body {
          font-family: var(--font-family);
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="root">${sectionsHtml}</div>
    </body>
    </html>
  `;
};
