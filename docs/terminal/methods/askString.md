# Method `askString`
Ask a question with a custom value and validator.

## Information
 - Parameters
   - `question` : `string` **[Required]** The question itself.
   - `defaultAnswer` : `string | null` **[Required]** The default value, use null for no default.
   - `callBack` : `(answer: string) => void` **[Required]** The answer callback, this will not be called if a validator is provided and the validator proves an error.
   - `validator` : `(answer: string) => string | void` **[Optional]** The validator for validating the input value before the answer callback if fired, return a string to render an error, other wise return nothing.
