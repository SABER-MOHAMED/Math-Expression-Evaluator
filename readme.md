# Math Expression Evaluator

## Description
Command line application designed evaluate mathematical expressions provided as strings input.
These expressions can include simple math operations, over integer and double values, in addition to standard mathematical functions (pow, sqrt, cos, sin, tan, acos, asin, atan).

## Dependencies
- Node.js

## Installation
To install and set up the project on your host machine, follow these steps:
1. Clone the repository to your local machine: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`

## Usage
To run the project, use the following command:
```
node mathExpEval.js
```

After running the command, the app will ask for a math expression. Enter it, press Enter, and if it's valid, you'll get the result. Otherwise, it will throw an error. 

Example usage:
```
node mathExpEval.js
Enter your math expression: 1 + (2 * 3 - 10.5)
Output: -3.5
```
**Note:** When using trigonometric functions (`cos`, `sin`, `tan`, `acos`, `asin`, `atan`), make sure to provide angles in radians

## Overall Design
The project consists of a main JavaScript file `mathExpEval.js`, which acts as the entry point for the command line app. The application uses the `readline` module, a built-in Node.js module, to interact with the user, prompting them to enter a mathematical expression and then evaluating it using a custom spliter and parser.

### Steps from Prompting to Result:
1. **Prompting for Expression:** 
    - When the application is executed, it prompts the user to input a mathematical expression.
    - Once the user enters the expression and hits Enter, the input is received by the application using a streamlined way to read input `readline` module.
    
2. **Input Parsing:**
    - The input which is a string representing a mathematical expression, is then parsed into components. These components can include numbers, operators, parentheses, and mathematical function names. This splitting operation is achieved by `splitExpression` function which uses regular expressions (Regex) to split the expression into distinct chunks of characters/numbers

3. **Syntax Tree Construction:**
    - The parsed components get into the `parse` function which Parses these components into a syntax tree 
    `{value: '', right: '', left}`
    - This syntax tree organizes the components in a hierarchical way, with values and operators whicch forming the nodes and branches of the tree

4. **Expression Evaluation:**
    - After constructing the syntax tree, it proceeds to next step performed by `evaluateSyntaxTree` function
    - The `evaluateSyntaxTree` function handles the evaluation process, by recursively traversing the syntax tree and perform the necessary mathematical operations (+, -, /, *, %, ...) based on the nodes and branches passed by, then calculate the result.
    
5. **Error Handling AND Result Output:**
    - The applilcation returns final result to the user, only if the expression is valid and successfully evaluated
    - If the expression is malformed (missing opening/closing parenthesis) or contains unsupported functions || operators, an error message is thrown.

### Key Components:
- **Parser:** Parses the input mathematical expression into a syntax tree representation.
- **Evaluator:** Evaluates the syntax tree to compute the result of the expression.
- **Utils:** Contains implementation of standard mathematical functions like cos, sin, tan, etc.

### Interaction:
1. The user runs the application using the command `node mathExpEval.js`.
2. The application prompts the user to enter a mathematical expression.
3. The user enters the expression, and the application evaluates it.
4. The result is displayed to the user.
