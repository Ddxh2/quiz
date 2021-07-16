### Outline

The task is to make a component using React.

A video of how the component should work is attached.

The link to the figma project is here which has designs that can help you:
https://www.figma.com/file/Ee8fqEKdF5ZXpmCGflCdMj/Seneca-tech-task?node-id=0%3A1

### Requirements, please:

- State any assumptions or limitations of your solution in the repository readme
- Put your soluton in git repo & email the link once you are done
- Some form of type checking should be used e.g. flow, propTypes, typescript
- The component should be responsive down to 320px
- The solution should lock once the correct answer is reached so the toggles can no longer be switched
- Ignore the navbar or footer just the toggles component itself
- The toggles should animate between the two states (see attached video)
- The background color should change in proportion to how "correct" the answer is (see video attached)
- The component should be reusable & extendable, it should be able to accomodate the question changing from that in the video to e.g:

Q. "What are the ideal conditions inside an office?"
A. (good pay, bad pay) (lot of meetings, less meetings), (free coffee, expensive coffee), (bear in office, dog in office).

Extension:

- The order of the questions & answer positions should be randomised
- You solution should be able to accomodate answers with both two and three toggle positions in the answers. For example:
  Q. "Which are the best sports people & teams?"
  A. (Liverpool, Chelsea, Man Utd), (Serena Williams, Naomi Osaka)
- You should make it easy to switch between the active question
