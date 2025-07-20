module.exports = {
  content: ["./src/**/*.{html,ts}"],

  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.slate[600]'),
            '--tw-prose-headings': theme('colors.slate[800]'),
            '--tw-prose-lead': theme('colors.slate[700]'),
            '--tw-prose-links': theme('colors.violet[600]'),
            '--tw-prose-bold': theme('colors.slate[800]'),
            '--tw-prose-counters': theme('colors.slate[500]'),
            '--tw-prose-bullets': theme('colors.slate[300]'),
            '--tw-prose-hr': theme('colors.slate[200]'),
            '--tw-prose-quotes': theme('colors.slate[800]'),
            '--tw-prose-quote-borders': theme('colors.slate[200]'),
            '--tw-prose-captions': theme('colors.slate[500]'),

            '--tw-prose-invert-body': theme('colors.slate[400]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.slate[300]'),
            '--tw-prose-invert-links': theme('colors.violet[400]'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.slate[400]'),
            '--tw-prose-invert-bullets': theme('colors.slate[600]'),
            '--tw-prose-invert-hr': theme('colors.slate[700]'),
            '--tw-prose-invert-quotes': theme('colors.slate[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.slate[700]'),
            '--tw-prose-invert-captions': theme('colors.slate[400]'),
          },
        },
      }),
    },
  },
  plugins: [
  ],
}
