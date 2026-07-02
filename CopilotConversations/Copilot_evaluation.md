## Instances where Copilot code was rejected or forced to iterate
### Categorized by the .md file tracking the conversation

- hints.md (Implementing the Hint feature)
  - On initial attempt of this implementation, I must have been too broad or asked for too much. The agent went off course, asked to run different Powershell scripts over and over again. I aborted its attempts and refocused with a new prompt, to pick up the pieces of the first attempt. After a couple more guiding messages, the work was completed successfully.
- number_input_reaction.md (Reacting to user input, to highlight errors and to mark completion)
  - On first attempt, Copilot designed input conflicts to only highlight original and user-entered numbers, not hinted numbers. After finding this, I forced an iteration on this to ensure hinted numbers were also highlighted in conflicts.
- add_name_to_top_10.md (Allowing the user to add their name when achieving a Top 10 score)
  - Copilot had some difficulties with this implementation. At first, the name input was broken and would only allow input of the first row (even on page load). This was addressed through iteration, and now the Top 10 list allows name input whenever a new score is gotten in the list (and not other times).