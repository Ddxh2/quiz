# quiz
React component to display a series of question with varying numbers of multiple choice collections

### Assumptions

- The screen used to display the quiz/questions isn't too small
- The window is unlikely to undergo extensive resizing
- The number of toggles (i.e. number of correct answers there are to be selected) isn't too high
- All questions should look the same (gradient background, question title, toggles, footer message)
- data prop supplied to Quiz.jsx is always sensible 

### Limitations

- The resizing when the window size changes is slow and can lead to issues if too many window changes happen at once
- If there are too many toggles for one question, the selections of colours for the background may be too similar and lead to accessibility issues
- There is no ability to manually scroll through the questions
- The language of "the answer is incorrect" is misleading when the user has correctly answered one of the rows
- There is no flexibility to incorporate question cards of different types (i.e. image/diagram based, etc)
- Use of styled components is inefficient and could be improved by using .attrs()
- Code is complicated and could be simplified with further refinement
- Vertical toggles were not utilised but could have allowed for my flexible resizing of the screen without comprimising readability
