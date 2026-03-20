#!/usr/bin/env node

/**
 * Accessibility Audit Script for SSS Website
 * WCAG 2.1 AA Compliance Check
 */

const fs = require('fs');
const path = require('path');

// Read all component files and check for accessibility issues
function readFiles(dir) {
  const files = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      files.push(...readFiles(path.join(dir, dirent.name)));
    } else if (dirent.name.endsWith('.tsx') || dirent.name.endsWith('.jsx')) {
      files.push(path.join(dir, dirent.name));
    }
  }
  
  return files;
}

function checkAccessibilityIssues(content, filePath) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for missing alt text on images
    if (line.includes('<img') && !line.includes('alt=')) {
      issues.push({
        type: 'missing-alt-text',
        severity: 'error',
        line: lineNum,
        message: 'Image element missing alt attribute',
        wcag: '1.1.1 Non-text Content'
      });
    }
    
    // Check for buttons without accessible text
    if (line.includes('<button') && !line.includes('aria-label') && !line.includes('aria-labelledby') && !line.match(/>\s*\w/)) {
      issues.push({
        type: 'button-missing-label',
        severity: 'error', 
        line: lineNum,
        message: 'Button element may be missing accessible text',
        wcag: '4.1.2 Name, Role, Value'
      });
    }
    
    // Check for form inputs without labels
    if (line.includes('<input') && !line.includes('aria-label') && !line.includes('aria-labelledby')) {
      const hasId = line.match(/id=['"]([^'"]*)['"]/);
      if (hasId) {
        const inputId = hasId[1];
        const hasLabel = content.includes(`htmlFor="${inputId}"`) || content.includes(`htmlFor='${inputId}'`);
        if (!hasLabel) {
          issues.push({
            type: 'input-missing-label',
            severity: 'error',
            line: lineNum,
            message: `Input with id="${inputId}" missing associated label`,
            wcag: '3.3.2 Labels or Instructions'
          });
        }
      } else {
        issues.push({
          type: 'input-missing-id-and-label',
          severity: 'warning',
          line: lineNum,
          message: 'Input element missing both id and aria-label',
          wcag: '3.3.2 Labels or Instructions'
        });
      }
    }
    
    // Check for click handlers on non-interactive elements
    if ((line.includes('onClick') || line.includes('onKeyDown')) && 
        (line.includes('<div') || line.includes('<span'))) {
      if (!line.includes('role=') || !line.includes('tabIndex')) {
        issues.push({
          type: 'non-interactive-click',
          severity: 'warning',
          line: lineNum,
          message: 'Click handler on non-interactive element should have role and tabIndex',
          wcag: '2.1.1 Keyboard Accessible'
        });
      }
    }
    
    // Check for missing focus indicators
    if (line.includes('outline:') && (line.includes('none') || line.includes('0'))) {
      issues.push({
        type: 'focus-outline-removed',
        severity: 'warning',
        line: lineNum,
        message: 'Focus outline removed - ensure custom focus indicator is provided',
        wcag: '2.4.7 Focus Visible'
      });
    }
    
    // Check for color-only information
    if (line.includes('color:') && (line.includes('red') || line.includes('#c9362c'))) {
      issues.push({
        type: 'color-only-indication',
        severity: 'warning', 
        line: lineNum,
        message: 'Ensure color is not the only means of conveying information',
        wcag: '1.4.1 Use of Color'
      });
    }
  });
  
  return issues;
}

function auditColorContrast(content) {
  const issues = [];
  
  // Common color combinations used in the app
  const colorPairs = [
    { bg: '#0a0a0c', fg: '#5a5550', name: 'muted text on background' },
    { bg: '#0a0a0c', fg: '#d4d0c8', name: 'text on background' },
    { bg: '#c9362c', fg: '#050505', name: 'red button text' },
    { bg: 'rgba(20,20,22,0.92)', fg: '#d4d0c8', name: 'text on panels' }
  ];
  
  // This is a simplified contrast check - in a real audit, you'd use a proper color contrast library
  colorPairs.forEach(pair => {
    // Flag for manual review since we can't calculate exact contrast ratios here
    issues.push({
      type: 'color-contrast-review',
      severity: 'warning',
      message: `Review contrast ratio for ${pair.name}: ${pair.fg} on ${pair.bg}`,
      wcag: '1.4.3 Contrast (Minimum)'
    });
  });
  
  return issues;
}

function main() {
  console.log('🔍 Starting SSS Website Accessibility Audit...\n');
  
  const appDir = path.join(__dirname, 'app');
  const componentDir = path.join(__dirname, 'components');
  
  const files = [
    ...readFiles(appDir),
    ...readFiles(componentDir)
  ];
  
  let totalIssues = 0;
  const allIssues = {};
  
  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = checkAccessibilityIssues(content, filePath);
    
    if (issues.length > 0) {
      allIssues[filePath] = issues;
      totalIssues += issues.length;
    }
  });
  
  // Color contrast audit
  const contrastIssues = auditColorContrast('');
  if (contrastIssues.length > 0) {
    allIssues['CSS Color Contrast'] = contrastIssues;
    totalIssues += contrastIssues.length;
  }
  
  // Report results
  console.log(`📊 Audit Results: ${totalIssues} potential issues found\n`);
  
  Object.entries(allIssues).forEach(([file, issues]) => {
    console.log(`📁 ${path.relative(process.cwd(), file)}`);
    issues.forEach(issue => {
      const emoji = issue.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${emoji} Line ${issue.line || 'N/A'}: ${issue.message}`);
      console.log(`     WCAG: ${issue.wcag}`);
    });
    console.log('');
  });
  
  if (totalIssues === 0) {
    console.log('✅ No obvious accessibility issues found!');
  } else {
    console.log(`Found ${totalIssues} issues to review and fix.`);
  }
}

if (require.main === module) {
  main();
}