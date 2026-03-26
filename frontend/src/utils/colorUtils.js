// utils/colorUtils.js
export const getColor = (maturity_level) => {
  switch (maturity_level) {
    case 1: return '#c01b12'; // red
    case 2: return '#b48e1c'; // Orange
    case 3: return '#4db866'; // green
   default: return '#ffffff'; // White/Fallback
  }
};
