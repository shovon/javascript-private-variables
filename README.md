[![Build Status](https://travis-ci.org/shovon/generator-private-variables.svg)](https://travis-ci.org/shovon/generator-private-variables)

# Private Variables for JavaScript

> Member variables preceded with underscore will now actually yield errors, bringing you one step closer to program correctness!

![Illegal access to private variables highlighted in red](https://raw.githubusercontent.com/shovon/javascript-private-variables/b76962396e6f3a418298e6f3e319f94527980b45/assets/example1.png)

Oftentimes, developers precede some member variables with underscores to indicate that they are "private". However, the underscore itself is almost meaningless to all JavaScript interpreters, and as such, there is no way to know whether or not there was any illegal access to "private" variables.

With this ESLint plug-in, linting errors will be thrown whenever one tries to access private variables from outside of a class' methods.

## Quick Start

```shell
# Step 1
$ npm install -g yo generator-private-variables

# Step 2
$ cd /path/to/project/new/or/old
# Be sure to change "/path/to/project/new/or/old" to an actual folder!

# Step 3: be sure that you have your existing project backed-up, just in case!
$ yo private-variables
```

Start typing out some code. Perhaps create a new class, access a private variables using `this._somePrivateVariable`, be it outside of a method, or inside of a method, etc.

Then, run:

```
npm run lint
```

If you've accessed a private variable outside of a class, you should actually see linting errors indicating just that!

If, prior to running `yo private-variables`, you already had a `lint` script defined in your `package.json` file, then you would instead run:

```
npm run lint2
```

### Hooking it up to a text-editor

Since the private variable checker is an [ESLint](http://eslint.org/) plug-in, then if you want to check for illegal private variable access as you type, then you can [install an ESLint plug-in for your text editor](http://eslint.org/docs/user-guide/integrations.html).

## Configuring

The private variable checker is an ESLint plugin, and, under npm, it is called `eslint-plugin-private-variables`. ESLint would interpret the name as `private-variables`, and you would tell ESLint to import it by supplying the following config:

```javascript
// This is either inside a `.eslintconfig` file, or it's the value of a property by the name `"eslintConfig"` inside a `package.json` file.

{
  // ...
  "plugins": [
    // ...
    "private-variables"
  ],

  "rules": {
    // ...
    "private-variables/no-access": [2, "class-only"]
  }
}
```

If you want to lint against code that uses ES6/ES7/ES2015 classes, then you may want to switch to the `babel-eslint` parser.

```javascript
// Again, this is either in `.eslintconfig` or a property of the name `"eslintConfig"` inside a `package.json` file.

{
  "parser": "babel-eslint"
}
```

And if you haven't done so, you may also consider installing `babel-eslint` by running `npm install --save-dev babel-eslint`.