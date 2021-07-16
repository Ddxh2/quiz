import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Question } from "./";
import { shuffle } from "../utils";

const QuizWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: ${({ height }) => (!!height ? height : 0)}px;
  ${({ noAnimate }) =>
    !!noAnimate ? "" : "transition: height 1s ease-in-out;"}
`;

const QuizColumn = styled.div`
  position: relative;
  display: block;
  background: transparent;
  transition: transform 1s ease-in-out;
  ${({ translateHeight }) =>
    !!translateHeight
      ? `transform: translate(0,${-1 * translateHeight}px);`
      : ""}
`;

const Quiz = ({ data }) => {
  const arrayOfQuestions = useMemo(() => shuffle(data), [data]);

  const [quizWrapperHeight, setQuizWrapperHeight] = useState(null);
  const [quizColumnTranslate, setQuizColumnTranslate] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visibleStates, setVisibleStates] = useState(
    arrayOfQuestions
      .map((_, index) => `question-${index}`)
      .reduce((acc, curr) => ({ ...acc, [curr]: false }), [{}])
  );

  const [resizing, setResizing] = useState(null);

  const onResize = (questionId = null) => {
    const currentQuestionContainer = document.querySelector(
      `#question-${questionId !== null ? questionId : currentQuestionIndex}`
    );
    const { top, bottom } = currentQuestionContainer.getBoundingClientRect();
    const { marginTop, marginBottom } = getComputedStyle(
      currentQuestionContainer
    );
    const { offsetTop } = currentQuestionContainer;

    setQuizColumnTranslate(() => offsetTop);

    setQuizWrapperHeight(
      () => bottom - top + parseInt(marginTop) + parseInt(marginBottom) * 0.7
    );
  };

  const onQuestionAnswered = (questionId) => {
    const nextQuestionContainer = document.querySelector(
      `#question-${questionId + 1}`
    );
    if (!nextQuestionContainer) {
      return;
    }

    const { top, bottom } = nextQuestionContainer.getBoundingClientRect();
    const { marginTop, marginBottom } = getComputedStyle(nextQuestionContainer);

    setTimeout(() => {
      setQuizColumnTranslate(
        (currentValue) =>
          currentValue + top + parseInt(marginTop) * (top >= 0 ? -1 : +1)
      );
      setTimeout(
        () =>
          setQuizWrapperHeight(
            () => bottom - top + parseInt(marginBottom) * 0.7
          ),
        0
      );
    }, 2000);
    setCurrentQuestionIndex(() => questionId + 1);
  };

  useEffect(() => {
    setResizing(true);
  }, []);

  useEffect(() => {
    if (resizing) {
      onResize();
    }
  }, [resizing]);

  useEffect(() => {
    if (quizWrapperHeight !== null) {
      setResizing(false);
    }
  }, [quizWrapperHeight]);

  useEffect(() => {
    setVisibleStates((currentState) => ({
      ...currentState,
      [`question-${currentQuestionIndex}`]: true,
    }));
    if (currentQuestionIndex > 0) {
      setTimeout(() => {
        setVisibleStates((currentState) => ({
          ...currentState,
          [`question-${currentQuestionIndex - 1}`]: false,
        }));
      }, 3000);
    }
  }, [currentQuestionIndex]);

  return (
    <QuizWrapper
      noAnimate={resizing ? resizing : resizing === null}
      height={quizWrapperHeight}
    >
      <QuizColumn translateHeight={quizColumnTranslate}>
        {arrayOfQuestions.map((questionSet, index) => (
          <Question
            visible={visibleStates[`question-${index}`]}
            key={index}
            questionId={index}
            data={questionSet}
            onComplete={onQuestionAnswered}
            onResize={() => {
              if (index === currentQuestionIndex) {
                setResizing(() => false);
                setTimeout(() => setResizing(() => true), 0);
              }
            }}
          />
        ))}
      </QuizColumn>
    </QuizWrapper>
  );
};

Quiz.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string,
      answerSets: PropTypes.arrayOf(
        PropTypes.shape({
          correctChoice: PropTypes.string,
          incorrectChoice: PropTypes.arrayOf(PropTypes.string),
        })
      ),
    })
  ),
};

export default Quiz;
