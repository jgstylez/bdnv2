
const palette = {
  blue: {
    '50': '#eef6ff',
    '100': '#d9eaff',
    '200': '#badfff',
    '300': '#92d0ff',
    '400': '#62baff',
    '500': '#3d9ef7',
    '600': '#2481e3',
    '700': '#1b67c2',
    '800': '#1c559f',
    '900': '#1a487f',
    '950': '#122c4d',
  },
  gray: {
    '50': '#f7f7f8',
    '100': '#ececf0',
    '200': '#d9d9e0',
    '300': '#c0c0cf',
    '400': '#9f9fb0',
    '500': '#838395',
    '600': '#6b6b7c',
    '700': '#5a5a68',
    '800': '#4a4a54',
    '900': '#3e3e46',
    '950': '#28282d',
    '1000': '#1a1a1a',
  },
  green: {
    '50': '#f2fcf3',
    '100': '#e1f7e4',
    '200': '#c5edcb',
    '300': '#9ce0a4',
    '400': '#6fcf7a',
    '500': '#4bb858',
    '600': '#3b9c46',
    '700': '#307b39',
    '800': '#296231',
    '900': '#23512a',
    '950': '#142d18',
  },
  orange: {
    '50': '#fff8f0',
    '100': '#ffefd9',
    '200': '#ffdbb3',
    '300': '#ffbf82',
    '400': '#ffa24d',
    '500': '#ff8521',
    '600': '#f56a0c',
    '700': '#c94f08',
    '800': '#a13e0c',
    '900': '#82340d',
    '950': '#461805',
  },
  red: {
    '50': '#fff2f2',
    '100': '#ffdede',
    '200': '#ffc2c2',
    '300': '#ff9b9b',
    '400': '#ff6969',
    '500': '#f74141',
    '600': '#e32626',
    '700': '#bf1d1d',
    '800': '#9d1b1b',
    '900': '#801c1c',
    '950': '#450b0b',
  },
  brown: {
    '50': '#fdf8f6',
    '100': '#f2e8e5',
    '200': '#eaddd7',
    '300': '#e0cec7',
    '400': '#d2bab0',
    '500': '#bfa094',
    '600': '#a18072',
    '700': '#846658',
    '800': '#674c43',
    '900': '#49312c',
    '950': '#36201b',
  },
};

// Create secondary and border as objects that can be used as strings
const createColorObject = (value: string) => {
  const obj = Object.assign(value, { value });
  return obj as string & { value: string };
};

export const colors = {
  primary: palette.brown[500],
  secondary: Object.assign('#474747', { bg: '#474747' }) as string & { bg: string },
  tertiary: palette.gray[500],
  accent: '#ba9988', // Updated to match design system
  accentLight: 'rgba(186, 153, 136, 0.2)', // Light variant with opacity
  success: palette.green[500],
  error: palette.red[500],
  warning: palette.orange[500],
  info: palette.blue[500],

  background: Object.assign(palette.gray[1000], { primary: palette.gray[1000], input: palette.gray[950] }) as string & { primary: string; input: string },
  border: Object.assign(palette.gray[900], { light: palette.gray[800] }) as string & { light: string },
  input: palette.gray[950],
  
  text: {
    primary: palette.gray[100],
    secondary: palette.gray[400],
    tertiary: palette.gray[600],
    placeholder: palette.gray[700],
  },
  
  light: '#ffffff',
  dark: '#000000',

  status: {
    success: palette.green[500],
    successLight: palette.green[100],
    successText: palette.green[300], // Lighter green for text on dark backgrounds (WCAG AA compliant)
    error: palette.red[500],
    errorLight: palette.red[100],
    errorText: palette.red[300], // Lighter red for text on dark backgrounds
    warning: palette.orange[500],
    warningLight: palette.orange[100],
    warningText: palette.orange[300], // Lighter orange for text on dark backgrounds
    info: palette.blue[500],
    infoLight: palette.blue[100],
    infoText: palette.blue[300], // Lighter blue for text on dark backgrounds
  },
  
  // Text colors with proper contrast for dark backgrounds
  textColors: {
    success: palette.green[300], // #9ce0a4 - better contrast on dark backgrounds
    error: palette.red[300], // #ff9b9b
    warning: palette.orange[300], // #ffbf82
    info: palette.blue[300], // #92d0ff
    accent: palette.brown[200], // #eaddd7 - lighter brown for better contrast
    onAccent: "#232323", // Primary background color for text overlaying accent color
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

const baseFont = 'Inter';

export const typography = {
  h1: {
    fontFamily: `${baseFont}_900Black`,
    fontSize: 40,
    lineHeight: 48,
  },
  h2: {
    fontFamily: `${baseFont}_800ExtraBold`,
    fontSize: 32,
    lineHeight: 40,
  },
  h3: {
    fontFamily: `${baseFont}_700Bold`,
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: `${baseFont}_600SemiBold`,
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: `${baseFont}_400Regular`,
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: `${baseFont}_400Regular`,
    fontSize: 12,
    lineHeight: 16,
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
  // Alias for backwards compatibility
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  // Alias for backwards compatibility
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  // Line heights alias
  lineHeight: {
    tight: 16,
    snug: 20,
    normal: 24,
    relaxed: 28,
    loose: 32,
  },
};
