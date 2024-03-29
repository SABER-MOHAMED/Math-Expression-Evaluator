const readline = require("readline");
const utils = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * node representation in the syntax tree
 * @class
 */
class TreeNode {
  constructor(value, left = null, right = null) {
    this.right = right;
    this.value = value;
    this.left = left;
  }
}

/**
 * split a mathematical expression
 * @param {string} expression - the mathematical expression to split
 * @returns {string[]} An array of components representing the expression
 */
function splitExpression(expression) {
  return expression
    .split(
      /\s+|(?<!\s)(?=[()*/%^+\-,])|(?<=[()*/%^+\-,])(?!\s)|(\b(?:cos|acos|sin|asin|tan|atan|sqrt|pow)\b)/,
    )
    .filter((component) => component);
}

/**
 * check if the given component is a valid mathematical function
 * @param {string} component - the mathematical componennt to check
 * @returns {boolean} - the component is valid mathematical function
 */
function isMathFunc(component) {
  return ["cos", "acos", "sin", "asin", "tan", "atan", "sqrt", "pow"].includes(
    component,
  );
}

/**
 * Parses the components of a mathematical expression into a syntax tree
 * @param {string[]} components - The components of the sematical expression
 * @returns {TreeNode} The root node of the syntax tree representing the expression
 * @throws {Error} If the expression is malformed or contains unexpected components
 */
function parse(components) {
  let index = 0;

  /**
   * Parses an expression.
   * @returns {TreeNode} The root node of the parsed expression
   * @throws {Error} If the expression is malformed or contains unexpected components
   */
  function parseExpression() {
    let node = parseTerm();

    while (components[index] === "+" || components[index] === "-") {
      const operator = components[index++];
      const right = parseTerm();
      node = new TreeNode(operator, node, right);
    }

    return node;
  }

  /**
   * parses a term
   * @returns {TreeNode} The root node of the parsed term
   * @throws {Error} If the expression is malformed or contains unexpected components
   */
  function parseTerm() {
    let node = parseFactor();

    while (
      components[index] === "*" ||
      components[index] === "/" ||
      components[index] === "%"
    ) {
      const operator = components[index++];
      const right = parseFactor();
      node = new TreeNode(operator, node, right);
    }

    return node;
  }

  /**
   * Parses a factor
   * A factor can be single number or a mathematical function with 1 or 2 arguments,
   * or a sub-expression enclosed in parentheses
   * @returns {TreeNode} The root node of the parsed factor
   * @throws {Error} If the expression is malformed or contains unexpected components
   */
  function parseFactor() {
    let node = null;

    if (components[index] === "(") {
      index++;
      node = parseExpression();
      if (components[index] !== ")") {
        throw new Error("Expected closing parenthesis ')'");
      }
      index++;
    } else if (!isNaN(parseFloat(components[index]))) {
      node = new TreeNode(parseFloat(components[index++]));
    } else if (isMathFunc(components[index])) {
      const funcName = components[index++];
      if (components[index++] !== "(")
        throw new Error(
          "The provided expression is malformed! An opening parenthesis is missing!",
        );

      const argument1 = parseExpression();

      // Check if there's a comma which indicates there's 2 args
      if (components[index] === ",") {
        // skip comma
        index++;
        // parse the second argument
        const argument2 = parseExpression();
        // check for closing parenthesis just after the second argument
        if (components[index++] !== ")")
          throw new Error(
            "The expression provided is malformed! a closing parenthesis is missing!",
          );
        // create a node with two arguments
        node = new TreeNode(funcName, argument1, argument2);
      } else {
        // check for closing parenthesis after the single argument
        if (components[index++] !== ")")
          throw new Error(
            "The expression provided is malformed! A closing parenthesis is missing!",
          );
        // create node with single argument
        node = new TreeNode(funcName, argument1);
      }
    } else {
      throw new Error("Unexpected token: " + components[index]);
    }

    return node;
  }

  return parseExpression();
}

/**
 * evaluates a syntax tree representing a mathematical expression
 * @param {TreeNode} node - The root node of the syntax tree
 * @returns {number} The result of the evaluation
 * @throws {Error} If the expression contains unsupported functions or operators
 */
function evaluateSyntaxTree(node) {
  // ff the node is a leaf node (number), then return its value
  if (node.left === null && node.right === null) return node.value;

  // if the node represents a math function, evaluate the function
  if (isMathFunc(node.value)) {
    const functionName = node.value;
    const argument = evaluateSyntaxTree(node.left);

    try {
      return functionName === "pow"
        ? utils.pow(argument, evaluateSyntaxTree(node.right))
        : utils[functionName](argument);
    } catch (err) {
      throw new Error("Unsupported function: " + functionName);
    }
  }

  // otherwise, recursively evaluate the left and right subtrees
  const leftValue = evaluateSyntaxTree(node.left);
  const rightValue = evaluateSyntaxTree(node.right);

  // perform the operation based on the operator stored in the current node
  switch (node.value) {
    case "+":
      return leftValue + rightValue;
    case "-":
      return leftValue - rightValue;
    case "*":
      return leftValue * rightValue;
    case "/":
      return leftValue / rightValue;
    case "%":
      return leftValue % rightValue;
    default:
      throw new Error("Unsupported operator: " + node.value);
  }
}

/**
 * evaluates a mathematical expression
 * @param {string} expression - The mathematical expression to be evaluated
 * @returns {number} The result of the calculcatiion
 * @throws {Error} If the expression is malformed or contains unsupported functions or operators
 */
function evaluateExpression(expression) {
  // split the expression into components
  const components = splitExpression(expression);
  // parse the components to build a syntax tree
  const syntaxTree = parse(components);
  // evaluate the syntax tree to compute the result
  return evaluateSyntaxTree(syntaxTree);
}

rl.question("Enter your math expression: ", (expression) => {
  try {
    const result = evaluateExpression(expression);
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    rl.close();
  }
});
