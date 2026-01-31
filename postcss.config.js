export default {
  plugins: {
    // Tailwind CSS Processing
    tailwindcss: {},
    
    // Autoprefixer for cross-browser compatibility
    autoprefixer: {
      // Flexbox support
      flexbox: 'no-2009',
      // Grid support
      grid: 'autoplace',
    },
    
    // CSS Nano for production minification (only in production)
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: [
          'default',
          {
            // Discard comments
            discardComments: {
              removeAll: true,
            },
            // Normalize whitespace
            normalizeWhitespace: true,
            // Merge rules
            mergeRules: true,
            // Reduce calc expressions
            calc: true,
            // Optimize colors
            colormin: true,
            // Convert values
            convertValues: true,
            // Discard duplicates
            discardDuplicates: true,
            // Discard empty rules
            discardEmpty: true,
            // Merge longhand properties
            mergeLonghand: true,
            // Minify font values
            minifyFontValues: true,
            // Minify gradients
            minifyGradients: true,
            // Minify params
            minifyParams: true,
            // Minify selectors
            minifySelectors: true,
            // Normalize charset
            normalizeCharset: true,
            // Normalize display values
            normalizeDisplayValues: true,
            // Normalize positions
            normalizePositions: true,
            // Normalize repeat style
            normalizeRepeatStyle: true,
            // Normalize string
            normalizeString: true,
            // Normalize timing functions
            normalizeTimingFunctions: true,
            // Normalize unicode
            normalizeUnicode: true,
            // Normalize URL
            normalizeUrl: true,
            // Ordered values
            orderedValues: true,
            // Reduce initial
            reduceInitial: true,
            // Reduce transforms
            reduceTransforms: true,
            // SVG optimizations
            svgo: true,
            // Unique selectors
            uniqueSelectors: true,
          },
        ],
      },
    } : {}),
  },
};
