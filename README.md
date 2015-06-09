# Private variables for JavaScript (`private-variables`)

Be one step closer to program correctness, by actually throwing errors when accessing private variables in JavaScript, before even running any of your programs!

<h3 align="center">
[Demo](#)
</h3>

## How Does it Work?

In order

## Getting started

Be sure that you have installed Node.js/io.js along with npm.

In a new folder, create a `package.json` file with the following content in it:

```json
{
  "scripts": { "lint": "eslint ./*.js" },
  "eslintConfig": {
    "parser": "babel-eslint",
    "env": { "node": true },
    "plugins": [ "privacy" ],
    "rules": {
      "no-console": false,
      "quotes": [ 2, "single" ],
      "strict": [ 2, "never" ],
      "no-underscore-dangle": false,
      "privacy/no-access": [2, "class-only"]
    }
  },
  "devDependencies": {
    "babel-eslint": "^3.1.14",
    "eslint": "^0.22.1"
  }
}
```

Then, add some JavaScript code in the root of the new folder. As a quick start, create a new `example.js` file, and paste in the following code:

```javascript

```

## Rule Accessing Property With Leading Underscore (no-access)

A lot of Python and JavaScript programmers use underscores to denote private variables. However, JavaScript doesn't explicitly enforce this rule; it's up to the programmer to decide whether or not they want to to enforce it. With this rule, access to a member variable with a leading underscore would throw an error.

## Rule Details

The following is considered an error:

```javascript
obj._something = 42;

{
  var that = this;
}

that._something = 42;
```

The following patterns are perfectly fine:

```javascript
this._something = 42;

var self = this;
self._something = 42;

var that = this;
setTimeout(function () {
  that._something = 42;
});
```
