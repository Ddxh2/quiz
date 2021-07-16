export const themeToHexColour = (themeNumber) => {
  if (!themeNumber) {
    return "#000000";
  } else {
    return `#${themeNumber.toString(16)}`;
  }
};

export const interpolate = (start, end, factor) => {
  return Math.round(start * (1 - factor) + end * factor);
};

export const interpolateColour = (startHex, endHex, factor) => {
  const { r: startR, g: startG, b: startB } = hexToRGB(startHex);
  const { r: endR, g: endG, b: endB } = hexToRGB(endHex);

  const interpolatedR = interpolate(startR, endR, factor);
  const interpolatedG = interpolate(startG, endG, factor);
  const interpolatedB = interpolate(startB, endB, factor);

  const hexString = `#${[interpolatedR, interpolatedG, interpolatedB]
    .map((int) => `${int < 16 ? "0" : ""}${int.toString(16)}`)
    .join("")}`;

  return hexString;
};

export const hexToRGB = (hex) => {
  const cleanHex = hex.charAt(0) === "#" ? hex.slice(1) : hex;
  var r = parseInt(cleanHex.substring(0, 2), 16);
  var g = parseInt(cleanHex.substring(2, 4), 16);
  var b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
};

export const colourGradients = (startGradient, endGradient, numSteps) => {
  let transitions = [];
  for (let i = 0; i <= numSteps; i++) {
    const factor = i / numSteps;
    transitions.push({
      top: interpolateColour(startGradient.top, endGradient.top, factor),
      bottom: interpolateColour(
        startGradient.bottom,
        endGradient.bottom,
        factor
      ),
    });
  }
  return transitions;
};

export const getBaseSizes = (windowWidth, windowHeight, data) => {
  const { answerSets } = data;
  const numRows = !!answerSets ? answerSets.length : 0;
  const maxChoicesPerRow = answerSets.reduce((acc, curr) => {
    const { correctChoice, incorrectChoices } = curr;
    return Math.max(acc, [correctChoice, ...incorrectChoices].length);
  }, 0);
  const baseWidth = Math.max(
    Math.floor((windowWidth * 0.8) / maxChoicesPerRow),
    20
  );
  const baseHeight = Math.max(Math.floor((windowHeight * 0.4) / numRows), 10);
  const baseFontSize = Math.floor(Math.min(baseWidth * 0.1, baseHeight * 0.6));
  const baseSpacing = 10 * Math.round(baseFontSize / 10);
  return { baseWidth, baseHeight, baseFontSize, baseSpacing };
};

export const shuffle = (array) => array.sort(() => Math.random() - 0.5);
