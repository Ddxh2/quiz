import React, { useState, useMemo, useEffect, useRef, forwardRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { fontStyle } from "../utils";

import "./Toggle.css";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: ${({ numChoices, baseWidth }) => numChoices * (baseWidth || 100)}px;
  height: ${({ baseHeight }) => (!!baseHeight ? baseHeight : 50)}px;
  border: 1px solid white;
  border-radius: ${({ baseHeight }) => (!!baseHeight ? baseHeight / 2 : 25)}px;
`;

const OptionWrapper = styled.div`
  display: table;
  width: ${({ baseWidth }) => (!!baseWidth ? baseWidth : 100)}px;
  height: ${({ baseHeight }) => (!!baseHeight ? baseHeight : 50)}px;
  line-height: ${({ baseHeight }) => (!!baseHeight ? baseHeight : 50)}px;
  text-align: center;
  background-color: transparent;
  border-radius: 25px;
`;

const Option = styled.div`
  display: table-cell;
  vertical-align: middle;
  width: 100%;
  word-wrap: break-word;
  ${fontStyle}
  ${({ isSelected }) => (isSelected ? "color: black;" : "")}
  ${({ baseFontSize }) =>
    !!baseFontSize ? `font-size: ${baseFontSize}px;` : ""}
  &:hover {
    opacity: 0.6;
  }
`;

const CurrentOption = styled.div`
  display: none;
  vertical-align: middle;
  position: absolute;
  width: ${({ baseWidth }) => (!!baseWidth ? baseWidth : 100)}px;
  height: ${({ baseHeight }) => (!!baseHeight ? baseHeight : 50)}px;
  border-radius: ${({ baseHeight }) => (!!baseHeight ? baseHeight : 25)}px;
  top: ${({ top }) => (!!top ? top : 0)}px;
  left: ${({ left }) => (!!left ? left : 0)}px;
  overflow: hidden;
  box-shadow: 0px 0px 10px 3px ${({ themeColour }) => themeColour};
`;

const CurrentOptionInterior = styled.div`
  opacity: 0.4;
  background: white;
  width: 100%;
  height: 100%;
`;

const shuffleOptions = (options, correctOption) => {
  const shuffledOptions = options.sort(() => Math.random() - 0.5);
  const correctIndex = shuffledOptions.indexOf(correctOption);
  return [shuffledOptions, correctIndex];
};

const getOptionId = (toggleIndex, choiceIndex) => {
  return `option-${toggleIndex}-${choiceIndex}`;
};

const CurrentOptionWrapper = forwardRef(
  (
    {
      baseWidth,
      baseHeight,
      baseFontSize,
      children,
      theme,
      currentChoiceCoordinates,
    },
    ref
  ) => {
    return (
      <CurrentOption
        className={
          currentChoiceCoordinates.animate ? "transition-left" : "no-transition"
        }
        top={currentChoiceCoordinates.top}
        left={currentChoiceCoordinates.left}
        baseWidth={baseWidth}
        baseHeight={baseHeight}
        baseFontSize={baseFontSize}
        ref={ref}
        themeColour={theme.currentTheme.bottom}
      >
        <CurrentOptionInterior
          baseWidth={baseWidth}
          baseHeight={baseHeight}
          baseFontSize={baseFontSize}
        >
          {children}
        </CurrentOptionInterior>
      </CurrentOption>
    );
  }
);

const Toggle = ({
  identifier,
  correctChoice,
  incorrectChoices,
  onCorrect,
  onChange,
  baseSizes,
  theme,
}) => {
  const [currentChoice, setCurrentChoice] = useState(null);
  const [currentChoiceCoordinates, setCurrentChoiceCoordinates] =
    useState(null);
  const currentOptionRef = useRef();

  const [choicesArray, correctIndex] = useMemo(
    () => shuffleOptions([correctChoice, ...incorrectChoices], correctChoice),
    [correctChoice, incorrectChoices]
  );

  const { baseWidth, baseHeight, baseFontSize } = useMemo(
    () => baseSizes,
    [baseSizes]
  );

  const handleClick = (choice) => {
    if (!!onChange) {
      onChange();
    }
    if (correctIndex !== currentChoice) {
      setCurrentChoice(() => choice);
    }
  };

  const updateCurrentChoiceLocation = (
    identifier,
    currentChoice,
    animate = true
  ) => {
    if (currentChoice === null) {
      return;
    }
    if (currentOptionRef.current.style.display !== "inline") {
      currentOptionRef.current.style.display = "inline";
    }
    const selectedContainer = document.querySelector(
      `#${getOptionId(identifier, currentChoice)}`
    );
    setCurrentChoiceCoordinates(() => ({
      top: selectedContainer.offsetTop,
      left: selectedContainer.offsetLeft,
      animate,
    }));
  };

  useEffect(() => {
    if (currentChoice !== null) {
      updateCurrentChoiceLocation(identifier, currentChoice, true);

      if (currentChoice === correctIndex) {
        onCorrect(correctChoice);
      }
    }
  }, [currentChoice]);

  useEffect(() => {
    updateCurrentChoiceLocation(identifier, currentChoice, false);
  }, [baseSizes]);

  return (
    <Wrapper
      baseWidth={baseWidth}
      baseHeight={baseHeight}
      baseFontSize={baseFontSize}
      numChoices={choicesArray.length}
    >
      <CurrentOptionWrapper
        baseWidth={baseWidth}
        baseHeight={baseHeight}
        baseFontSize={baseFontSize}
        ref={currentOptionRef}
        theme={theme}
        currentChoiceCoordinates={currentChoiceCoordinates || {}}
      />
      {choicesArray.map((current, index) => (
        <OptionWrapper
          baseWidth={baseWidth}
          baseHeight={baseHeight}
          baseFontSize={baseFontSize}
          id={getOptionId(identifier, index)}
          key={index}
          onClick={() => handleClick(index)}
        >
          <Option
            baseWidth={baseWidth}
            baseHeight={baseHeight}
            baseFontSize={baseFontSize}
            isSelected={currentChoice === index}
          >
            {current}
          </Option>
        </OptionWrapper>
      ))}
    </Wrapper>
  );
};

Toggle.propTypes = {
  identifier: PropTypes.number.isRequired,
  correctChoice: PropTypes.string,
  incorrectChoices: PropTypes.arrayOf(PropTypes.string),
  onCorrect: PropTypes.func,
  onChange: PropTypes.func,
  baseSizes: PropTypes.shape({
    baseWidth: PropTypes.number,
    baseHeight: PropTypes.number,
    baseFontSize: PropTypes.number,
    baseSpacing: PropTypes.number,
  }),
  theme: PropTypes.shape({
    currentTheme: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
    startTheme: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
    targetTheme: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
    endTheme: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
  }),
};

Toggle.defaultProps = {
  onCorrect: () => {},
  onChange: () => {},
};

CurrentOptionWrapper.propTypes = {
  baseWidth: PropTypes.number,
  baseHeight: PropTypes.number,
  baseFontSize: PropTypes.number,
  theme: PropTypes.shape({
    currentTheme: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
    startTheme: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
    targetTheme: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
    endTheme: PropTypes.shape({
      top: PropTypes.string,
      bottom: PropTypes.string,
    }),
  }),
  currentChoiceCoordinates: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    animate: PropTypes.bool,
  }),
};

CurrentOptionWrapper.defaultProps = {
  currentChoiceCoordinates: {},
};

export default Toggle;
