# Private variables for JavaScript

Precede member variable names with an underscore, and **get private variables**. Now comes with actual errors, bringing you one step closer to program correctness!

<h3 align="center">
<a href="#">Demo</a>
</h3>

## Getting started

WIP

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
