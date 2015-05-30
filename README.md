# Add private member variables to your code

Languages like Python and JavaScript don't have a way to forbid access to specific member variables. And even if there is, it's often only possible through some clever hacks, such as the use of closures. However, this results in code that is cumbersome to debug, and worse, too much garbage generated from the use of closures.

A better solution would be to run the code against a linter, and check and see if the programmer is illegally accessing member variables of an object that have underscores on them.

This is where `eslint-plugin-privacy` comes in. JavaScript programmers have been using underscores to denote that a member variable is private. `eslint-plugin-privacy` enforces that habit, by making sure that a linting error is thrown when a programmer is trying to access a member variable of an object that has a leading underscore.

## Rule Accessing Property With Leading Underscore (no-access)

A lot of Python and JavaScript programmers use underscores to denote private variables. However, JavaScript doesn't explicitly enforce this rule; it's up to the programmer to decide whether or not they want to to enforce it. With this rule, access to a member variable with a leading underscore would throw an error.

## Rule Details

The following patterns are considered warnings:

```javascript
obj._somePrivateVar;
obj_anotherPrivateVar;
```

The following patterns are not warnings:

```javascript
var obj = {
  value: 42,
  prop: function () {
    return this.value;
  }
};
```

## Rule Modify Public Variables (no-public)

With public member variables, and having external classes modify the member, it becomes difficult to track down what was it that modified the value. The best thing to do is to avoid public variables altogether and use getter and setter methods.

However, this rule fails to handle the case when a specific assignment expression represents the assignment to a [JavaScript setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set).

## Rule Details

The following patterns are considered warnings:

```javascript
var obj = {
  foo: function () {
    this.somePublicVar = 10;
  }
};

class SomeClass {
  constructor() {
    this.somePublicVar = 10;
  }
}
```

The following are not warnings:

```javascript
var obj = {
  foo: function () {
    this._somePublicVar = 10;
  }
};

class SomeClass {
  constructor() {
    this._somePublicVar = 10;
  }
}
```