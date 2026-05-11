// =========================
// COLORS
// =========================
export const colors = {
  primary: "bg-black",
  primaryHover: "hover:bg-[#1a1a1a]",
  ink: "text-[#171717]",
  body: "text-[#60646c]",
  muted: "text-[#999999]",
  link: "text-[#0d74ce]",
  linkSecondary: "text-[#476cff]",
  canvas: "bg-white",
  canvasSoft: "bg-[#fafafa]",
  surface: "bg-white",
  surfaceSoft: "bg-[#f5f5f7]",
  surfaceStrong: "bg-[#f0f0f3]",
  dark: "bg-[#171717]",
  darkElevated: "bg-[#1a1a1a]",
  onDark: "text-white",
  onDarkSoft: "text-[#b0b4ba]",
  border: "border border-[#f0f0f3]",
  borderStrong: "border border-[#dcdee0]",
  success: "text-[#16a34a]",
  error: "text-[#eb8e90]",
};

// =========================LAYOUT=========================
export const pageWrapper ="min-h-screen bg-[#fafafa] overflow-x-hidden";
export const sectionWrapper ="py-8 sm:py-10 lg:py-14";
export const container ="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
export const centeredFlex = "flex items-center justify-center";
export const flexBetween ="flex items-center justify-between";


// ========================= TYPOGRAPHY =========================

export const heroTitle ="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-[#171717] leading-tight";
export const sectionTitle ="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#171717]";
export const cardTitle ="text-xl sm:text-2xl font-semibold text-[#171717]";
export const bodyText ="text-sm sm:text-base leading-7 text-[#525252]";
export const smallText = "text-sm text-[#60646c]";
export const mutedText ="text-sm text-[#8a8a8a]";
export const captionText = "text-[13px] text-[#60646c]";
export const codeText = "font-mono text-[13px] leading-6";
export const navLink = "text-sm font-medium text-[#171717] hover:text-black transition";


// =========================BUTTONS =========================

export const primaryBtn = "h-10 px-5 rounded-md bg-black hover:bg-[#1a1a1a] text-white text-sm font-medium transition duration-200";
export const secondaryBtn = "h-10 px-5 rounded-md bg-white border border-[#dcdee0] text-[#171717] text-sm font-medium hover:bg-[#fafafa] transition";
export const tertiaryBtn = "text-[#0d74ce] text-sm font-medium hover:underline";


// =========================CARDS=========================

export const featureCard ="bg-white border border-[#e5e5e5] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm overflow-hidden";
export const darkCard ="bg-[#171717] text-white rounded-xl p-6";
export const workflowCard = "bg-white rounded-xl p-5 border border-[#f0f0f3]";
export const testimonialCard = "bg-white rounded-xl p-6 border border-[#f0f0f3]";
export const pricingCard = "bg-white rounded-xl p-8 border border-[#f0f0f3]";
export const featuredPricingCard ="bg-[#171717] text-white rounded-xl p-8";
export const codeBlock ="bg-[#171717] text-white rounded-xl p-5 font-mono text-[13px] overflow-auto";

// ========================= INPUTS=========================

export const textInput = "w-full h-11 px-4 rounded-md border border-[#dcdee0] bg-white text-[#171717] outline-none focus:ring-2 focus:ring-black";
export const uploadInput ="hidden";


// ========================= BADGES =========================

export const badge = "inline-flex items-center px-3 py-1 rounded-full bg-[#f0f0f3] text-[11px] uppercase tracking-wider font-semibold text-[#171717]";


// ========================= NAVBAR=========================

export const navbar ="h-16 w-full bg-white border-b border-[#f0f0f3] px-6 md:px-12 flex items-center justify-between sticky top-0 z-50";


// =========================HERO SECTION=========================

export const heroSection ="relative overflow-hidden bg-white py-24 sm:py-32";
export const heroGradient ="absolute inset-0 bg-gradient-to-b from-[#cfe7ff] via-[#a8c8e8]/30 to-white opacity-60 pointer-events-none";
export const heroContent ="relative z-10 max-w-5xl mx-auto text-center";


// =========================DASHBOARD =========================

export const dashboardGrid ="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8 items-start";
export const resumeCard ="bg-white rounded-2xl border border-[#e5e5e5] p-6 shadow-sm hover:shadow-md transition duration-300";
export const scoreText ="text-5xl sm:text-6xl font-semibold tracking-tight text-[#171717]";
export const scoreSuccess ="text-green-600 text-sm sm:text-base font-medium mt-2";
export const scoreWarning ="text-orange-500 text-sm sm:text-base font-medium mt-2";
export const scoreText1 ="text-3xl sm:text-4xl font-semibold tracking-tight text-[#171717]";
// =========================ANALYSIS =========================
export const keywordMissing ="px-4 py-2 rounded-full bg-[#f3f3f3] text-[#525252] text-xs sm:text-sm font-medium border border-[#e5e5e5]";
export const keywordMatched ="px-4 py-2 rounded-full bg-black text-white text-xs sm:text-sm font-medium";
export const suggestionBox ="bg-white border border-[#e5e5e5] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm";

// =========================FOOTER =========================

export const footer = "bg-black border-t border-[#f0f0f3] px-12 py-16 text-sm text-[#60646c]";
export const footerLink ="text-[#60646c] hover:text-black transition";
// ========================= HEADER / NAV =========================

export const navContainer = "max-w-14xl mx-auto h-20 flex items-center justify-between px-6 md:px-12 border-b border-[#f0f0f3]";
export const navLogo = "text-2xl font-semibold tracking-[-1px] text-[#171717]";
export const navLinks ="flex items-center gap-5";
export const activeNavLink ="text-sm font-medium text-black";


// ========================= PROFILE =========================

export const profileWrapper ="bg-white rounded-2xl border border-[#e5e5e5] p-8";
export const profileGrid ="grid grid-cols-1 md:grid-cols-2 gap-6";
export const profileLabel ="text-sm font-medium text-[#737373] mb-2";
export const profileValue ="text-lg font-semibold text-[#171717] break-words";
export const historyCard ="bg-[#fafafa] border border-[#e5e5e5] rounded-xl p-5";
export const historyTitle ="text-lg font-semibold text-[#171717]";
export const historyText ="text-sm text-[#525252] mt-3";
export const profileSectionTitle ="text-4xl font-semibold text-[#171717] mb-10";
export const divider ="border-t border-[#e5e5e5] my-10";
export const emptyState ="text-[#737373] text-sm";