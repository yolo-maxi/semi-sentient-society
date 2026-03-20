"use client";

import { useEffect } from "react";

/**
 * Accessibility Testing Helper Component
 * Only loads in development to test accessibility features
 */
export default function A11yTestHelper() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // Add keyboard navigation testing
    function handleKeyDown(event: KeyboardEvent) {
      // Test Tab navigation
      if (event.key === "Tab") {
        console.log("Tab navigation:", document.activeElement);
      }

      // Test Escape key for modals
      if (event.key === "Escape") {
        console.log("Escape pressed, focused element:", document.activeElement);
      }
    }

    // Test focus indicators
    function addFocusTestStyles() {
      const style = document.createElement("style");
      style.id = "a11y-test-styles";
      style.textContent = `
        /* Highlight all focusable elements for testing */
        *:focus {
          outline: 3px solid orange !important;
          outline-offset: 2px !important;
        }
        
        /* Show hidden skip links */
        .skip-link {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          background: red !important;
          color: white !important;
          z-index: 9999 !important;
        }
        
        /* Highlight elements with missing alt text */
        img:not([alt]),
        area:not([alt]) {
          outline: 5px solid red !important;
        }
        
        /* Highlight form inputs without labels */
        input:not([aria-label]):not([aria-labelledby]):not([title]):not([placeholder]),
        textarea:not([aria-label]):not([aria-labelledby]):not([title]):not([placeholder]),
        select:not([aria-label]):not([aria-labelledby]):not([title]) {
          outline: 3px solid yellow !important;
        }
      `;
      
      // Only add if not already present
      if (!document.getElementById("a11y-test-styles")) {
        document.head.appendChild(style);
      }
    }

    // Check for accessibility issues
    function runA11yChecks() {
      const issues: string[] = [];

      // Check for images without alt text
      const imagesWithoutAlt = document.querySelectorAll("img:not([alt])");
      if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} images without alt text`);
      }

      // Check for inputs without labels
      const inputsWithoutLabels = document.querySelectorAll(
        'input:not([aria-label]):not([aria-labelledby]):not([type="hidden"])'
      );
      if (inputsWithoutLabels.length > 0) {
        issues.push(`${inputsWithoutLabels.length} inputs without proper labels`);
      }

      // Check for buttons without accessible text
      const buttonsWithoutText = document.querySelectorAll(
        'button:not([aria-label]):not([aria-labelledby]):not([title])'
      );
      const emptyButtons = Array.from(buttonsWithoutText).filter(
        (button) => !button.textContent?.trim()
      );
      if (emptyButtons.length > 0) {
        issues.push(`${emptyButtons.length} buttons without accessible text`);
      }

      // Check for heading structure
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      let previousLevel = 0;
      let headingStructureIssues = 0;

      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1));
        if (level > previousLevel + 1) {
          headingStructureIssues++;
        }
        previousLevel = level;
      });

      if (headingStructureIssues > 0) {
        issues.push(`${headingStructureIssues} heading structure issues`);
      }

      if (issues.length > 0) {
        console.warn("🚨 Accessibility issues found:", issues);
      } else {
        console.log("✅ No obvious accessibility issues detected");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    
    // Add visual testing aids
    addFocusTestStyles();

    // Run checks after component mount
    setTimeout(runA11yChecks, 1000);

    // Re-run checks when DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(runA11yChecks, 500);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
      
      const testStyles = document.getElementById("a11y-test-styles");
      if (testStyles) {
        testStyles.remove();
      }
    };
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-orange-500 bg-orange-100 p-2 text-xs text-orange-800">
      A11y Test Helper Active
      <div className="mt-1 text-xs">
        Press F12 → Console for accessibility reports
      </div>
    </div>
  );
}