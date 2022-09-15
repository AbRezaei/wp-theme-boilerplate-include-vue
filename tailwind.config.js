import typography from '@tailwindcss/typography';

export default {
    mode: "jit",
    content: [
        './templates/**/*.twig',
    ],
    theme: {
        extend: {
            colors: {
                mo: {
                    dark: '#252525',
                    gray: '#737373',
                    red: '#EF2078',
                    green: '#3BD4AE',
                    yellow: '#FF9900'
                },
                brands: {
                    facebook: '#3b5998',
                    twitter: '#55acee',
                    instagram: '#3f729b'
                }
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '3rem',
                    xl: '5rem',
                    '2xl': '7rem'
                }
            },
            transitionDuration: {
                DEFAULT: '300ms'
            },
            transitionTimingFunction: {
                DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            borderRadius: {
                DEFAULT: '0.3125rem', // 5px
                xl: '0.625rem',       // 10px
                '3xl': '1.25rem',     // 20px
                '4xl': '1.5rem',      // 24px
                '5xl': '1.875rem',    // 30px
                '6xl': '2.8125rem',   // 45px
            },
            // Plugins
            typography: theme => ({
                DEFAULT: {
                    css: {
                        'h1, h2, h3, h4, h5, h6': {
                            margin: 0
                        },
                        'p': {
                            margin: '0 0 1rem 0'
                        },
                        'h1, h2, h3, h4': {
                            fontWeight: theme('fontWeight.bold')
                        },
                        'h5, h6': {
                            fontWeight: theme('fontWeight.semibold')
                        },
                        'h1': {
                            fontSize: theme('fontSize.3xl[0]')
                        },
                        'h2': {
                            fontSize: theme('fontSize.2xl[0]')
                        },
                        'h3': {
                            fontSize: theme('fontSize.xl[0]')
                        },
                        'h4': {
                            fontSize: theme('fontSize.lg[0]')
                        },
                        'h5': {
                            fontSize: theme('fontSize.md[0]')
                        },
                        'h6': {
                            fontSize: theme('fontSize.base[0]')
                        },
                        a: {
                            color: theme('colors.mo.gray'),
                            transitionDuration: theme('transitionDuration.DEFAULT'),
                            '&:hover': {
                                color: theme('colors.mo.red'),
                            }
                        }
                    }
                }
            })
        },
        fontSize: theme => ({
            'xs':   ['0.75rem', theme('lineHeight.normal')],  // 12
            'sm':   ['0.875rem', theme('lineHeight.normal')], // 14
            'base': ['1rem', theme('lineHeight.normal')],     // 16
            'md':   ['1.125rem', theme('lineHeight.normal')], // 18
            'lg':   ['1.25rem', 1.1],  // 20
            'xl':   ['1.5rem', 1.1],   // 24
            '2xl':  ['2rem', 1.1],     // 32
            '3xl':  ['2.25rem', 1.1],  // 36
            '4xl':  ['3rem', 1.1],     // 48
            '5xl':  ['4rem', 1.1],     // 64
            '6xl':  ['4.5rem', 1.1],   // 72
        }),
        boxShadow: {
            DEFAULT: '4px 12px 40px 6px rgba(0, 0, 0, 0.09)',
            lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0px 0px 40px 5px rgba(0, 0, 0, 0.1)'
        }
    },
    plugins: [
        typography
    ]
}
