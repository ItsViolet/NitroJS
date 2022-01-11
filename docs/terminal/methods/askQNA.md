# Method `askQNA`
Ask an interactive yes or no question in the terminal.

## Information
 - Parameters
   - `question` : `string` **[Required]** The question to ask the client.
   - `defaultValue` : `boolean` **[Required]** The default state of the yes or no question.
   - `callBack` : `(answer: boolean) => void` **[Required]** A call back listener for when the answer has been selected.
