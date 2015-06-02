# Add private member variables to your code

> All member variable names that start with `_` will be private.

Languages like Python and JavaScript don't have any way to forbid access to specific member variables. And even if there is, it's often only possible through some clever hacks, such as the use of closures. However, this results in code that is cumbersome to debug, and worse, too much garbage generated from the use of closures.

A better solution would be to run the code against a linter, and check and see if the programmer is illegally accessing member variables of an object that have underscores on them.

This is where `eslint-plugin-privacy` comes in. JavaScript programmers have been prepending a single underscore to member variable names in order to denote that it is private. `eslint-plugin-privacy` enforces that habit, by making sure that a linting error is thrown when a programmer is trying to access a member variable of an object that has a leading underscore.

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
