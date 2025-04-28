# Style Guide

## Typescript

Use TypeScript with async/await. Use es6 function syntax wherever possible.

## Cases

All variable names and function names must be snake_case.

All files must be kebab-case.

All JSON keys must be kebab-case.

## Naming

All functions and variable names should be descriptive. Do not use generic names or abbreviations. 

All functions and variables should be self-explanatory. A function that adds a task should be named `add_task`. 

A person should be able to understand what a function does and what a variable is used for just by looking at its name.

The only exception to this rule is the variable name for useTranslations and getTranslation. These variables should be named `t`.

## Documentation

### JSDoc Comments

Use detailed JSDoc comments above the function declaration.

Document each parameter with its type and description.

Explain the return type (e.g., a promise that resolves to a success handler object).

### Inline Comments

Every single line of code that is not for the purpose of logging should be commented.

Comment on key logic blocks (e.g., input validation, logging, query construction).

Explain why certain decisions are made (like filtering fields or checking for firm existence).

## Imports
When importing a file, use `@/...` The `@` is a relative path to the root of the backend.
