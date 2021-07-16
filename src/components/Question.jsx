import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Toggle } from ".";
import { colourGradients, fontStyle, getBaseSizes, shuffle } from "../utils/";

const QuestionWrapper = styled.div`
  display: block;
  margin: ${({ baseSpacing }) => (!!baseSpacing ? baseSpacing : 10)}px;
  margin-bottom: ${({ baseSpacing }) =>
    !!baseSpacing ? 1.5 * baseSpacing : 10}px;
  background: ${({ backgroundGradient: { top, bottom } }) =>
    !!top && !!bottom ? `linear-gradient(${top},${bottom})` : "transparent"};
  border-radius: ${({ baseSpacing }) =>
    !!baseSpacing ? baseSpacing / 2 : "5"}px;
  box-shadow: 0px 0px 10px 3px
    ${({ finished }) => (finished ? "lightblue" : "lightgrey")};
  width: 90%;
  height: auto;
  visibility: ${({ visible }) => (!!visible ? "visible" : "hidden")};}
`;

const QuestionLabelWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ baseSpacing }) => (!!baseSpacing ? baseSpacing / 2 : 5)}px;
  margin-bottom: ${({ baseSpacing }) =>
    !!baseSpacing ? baseSpacing / 2 : 5}px;
  align-items: center;
`;

const QuestionLabel = styled.div`
  margin-top: ${({ baseSpacing }) => (!!baseSpacing ? baseSpacing : 10)}px;
  ${fontStyle}
  font-size: ${({ baseFontSize }) =>
    !!baseFontSize ? 2 * baseFontSize : 20}px;
`;

const ToggleWrapper = styled.div`
  display: block;
  width: auto;
`;

const ToggleRow = styled.div`
  margin: ${({ baseSpacing }) => (!!baseSpacing ? baseSpacing : 10)}px;
  display: flex;
  justify-content: center;
`;

const Message = styled.div`
  display: flex;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  justify-content: center;
  ${fontStyle}
  font-size: ${({ baseFontSize }) =>
    !!baseFontSize ? baseFontSize * 0.9 : 10}px;
`;

const Question = ({
  visible,
  questionId,
  onComplete,
  data: { question, answerSets },
  onResize = () => {},
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [theme, setTheme] = useState({
    currentTheme: { top: "#FF9B3D", bottom: "#FF481F" },
    startTheme: { top: "#FF9B3D", bottom: "#FF481F" },
    targetTheme: { top: "#FFD500", bottom: "#FFA200" },
    endTheme: { top: "#00D5C6", bottom: "#00C0E5" },
  });
  const [baseSizes, setBaseSizes] = useState(null);
  const onWindowResize = () => {
    setBaseSizes(() =>
      getBaseSizes(window.innerWidth, window.innerHeight, {
        question,
        answerSets,
      })
    );
  };

  const shuffledAnswerSets = useMemo(() => shuffle(answerSets), [answerSets]);

  useEffect(() => {
    onWindowResize();
    window.addEventListener("resize", onWindowResize);
  }, []);

  useEffect(() => {
    if (baseSizes !== null) {
      onResize();
    }
  }, [baseSizes]);

  const correctSet = useMemo(
    () =>
      shuffledAnswerSets.reduce((accumulator, { correctChoice }) => {
        accumulator.add(correctChoice);
        return accumulator;
      }, new Set()),
    [shuffledAnswerSets]
  );

  const gradient = useMemo(() => {
    const colourTransitions = colourGradients(
      theme.startTheme,
      theme.targetTheme,
      correctSet.size - 1
    );
    colourTransitions.push(theme.endTheme);
    return colourTransitions;
  }, [correctSet]);
  const [numCorrect, setNumCorrect] = useState(0);

  const onCorrect = () => {
    setNumCorrect((currentVal) => currentVal + 1);
  };

  useEffect(() => {
    setTheme((currentValue) => ({
      ...currentValue,
      currentTheme: gradient[numCorrect],
    }));
    if (numCorrect === correctSet.size) {
      onComplete(questionId);
    }
  }, [numCorrect]);

  return (
    <QuestionWrapper
      visible={visible}
      id={`question-${questionId}`}
      finished={numCorrect === correctSet.baseSizes}
      backgroundGradient={theme.currentTheme}
      baseSpacing={!!baseSizes && baseSizes.baseSpacing}
    >
      <QuestionLabelWrapper baseSpacing={!!baseSizes && baseSizes.baseSpacing}>
        <QuestionLabel
          baseFontSize={!!baseSizes && baseSizes.baseFontSize}
          baseSpacing={!!baseSizes && baseSizes.baseSpacing}
        >
          {question}
        </QuestionLabel>
      </QuestionLabelWrapper>
      <ToggleWrapper>
        {[...shuffledAnswerSets].map((currentAnswerSet, index) => (
          <ToggleRow
            key={index}
            baseSpacing={!!baseSizes && baseSizes.baseSpacing}
          >
            <Toggle
              theme={theme}
              onChange={() => setShowMessage(true)}
              identifier={`${questionId}-${index}`}
              {...currentAnswerSet}
              onCorrect={onCorrect}
              baseSizes={baseSizes || {}}
            />
          </ToggleRow>
        ))}
      </ToggleWrapper>
      <Message
        visible={showMessage}
        baseFontSize={!!baseSizes && baseSizes.baseFontSize}
        baseSpacing={!!baseSizes && baseSizes.baseSpacing}
      >{`The answer is ${
        numCorrect !== correctSet.size ? "in" : ""
      }correct`}</Message>
    </QuestionWrapper>
  );
};

Question.propTypes = {
  visible: PropTypes.bool,
  questionId: PropTypes.number.isRequired,
  onComplete: PropTypes.func,
  data: PropTypes.shape({
    question: PropTypes.string,
    answerSets: PropTypes.arrayOf(
      PropTypes.shape({
        correctChoice: PropTypes.string,
        incorrectChoice: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }),
  onResize: PropTypes.func,
};

Question.defaultProps = {
  onResize: () => {},
};

export default Question;
