export const computeCapabilityMaturity = (capabilities) => {

  const capabilityMap = {};
  const childrenMap = {};


  capabilities.forEach(cap => {
    capabilityMap[cap.id] = { ...cap };

    if (!childrenMap[cap.parent_id]) {
      childrenMap[cap.parent_id] = [];
    }

    childrenMap[cap.parent_id].push(cap.id);
  });

  
  const calculate = (id) => {

    const children = childrenMap[id];


    if (!children || children.length === 0) {
      capabilityMap[id].calculated_maturity =
        capabilityMap[id].maturity_level;

      return capabilityMap[id].calculated_maturity;
    }

    const childMaturity = children.map(childId => calculate(childId));

    const avg =
      childMaturity.reduce((sum, m) => sum + m, 0) /
      childMaturity.length;

    capabilityMap[id].calculated_maturity = Math.round(avg);

    return capabilityMap[id].calculated_maturity;
  };

  
  capabilities.forEach(cap => calculate(cap.id));

  return capabilityMap;
};
