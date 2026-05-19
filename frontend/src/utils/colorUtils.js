// utils/colorUtils.js

export const getColor = (maturity_level) => {
  switch (maturity_level) {
    case 1:
      return "#dc2626"; // professional red

    case 2:
      return "#d97706"; // amber

    case 3:
      return "#16a34a"; // green

    default:
      return "#94a3b8"; // slate
  }
};