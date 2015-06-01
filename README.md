# Add private member variables to your code

Languages like Python and JavaScript don't have a way to forbid access to specific member variables. And even if there is, it's often only possible through some clever hacks, such as the use of closures. However, this results in code that is cumbersome to debug, and worse, too much garbage generated from the use of closures.

A better solution would be to run the code against a linter, and check and see if the programmer is illegally accessing member variables of an object that have underscores on them.

This is where `eslint-plugin-privacy` comes in. JavaScript programmers have been using underscores to denote that a member variable is private. `eslint-plugin-privacy` enforces that habit, by making sure that a linting error is thrown when a programmer is trying to access a member variable of an object that has a leading underscore.

This project is still a WIP.

## Rule Accessing Property With Leading Underscore (no-access)

A lot of Python and JavaScript programmers use underscores to denote private variables. However, JavaScript doesn't explicitly enforce this rule; it's up to the programmer to decide whether or not they want to to enforce it. With this rule, access to a member variable with a leading underscore would throw an error.

## Rule Details

The following patterns are considered warnings:

```javascript
obj._somePrivateVar;

obj._anotherPrivateVar;

var that = this;
foo(function (that) { // Note: the use of `that` as parameter name.
  that._value;
});

var that;
{
  that = this;
}
that._value;

var that;
if (condition) {
  that = this;
}
that._value;

var that;
if (condition) { } else {
  that = this;
}
that._value;

var that;
if (condition) { } else if { } /* ... */ else if {
  that = this;
}
that._value;

var that;
if (condition) { } else if { } /* ... */ else {
  that = this;
}
that._value;

var that;
if (condition) { } else if { } /* ... */ else if {
  that = this;
} else { }
that._value;

var that;
while (condition) {
  // ...
  that = this;
}
that._value;

var that;
try {
  // ...
  that = this;
} catch (e) {}
that._value

var that;
try {} catch (e) {
  that = this;
}
that._value;
```

The following patterns are not warnings:

```javascript
var obj = {
  publicValue: 10,
  _value: 42,
  prop: function () {
    var self = this;
    return self._value;
  }
};

obj.publicValue;

var self = this;
self._value;

var that;
that = this;
that._value;

var that = 10;
that = this;
that._value;

var that;
that = 10;
that = this;
that._value;

var that;
var self;
that = this;
self = that;
self._value

var that = this;
setTimeout(function () {
  that._value;

  var self = this;
  setTimeout(function () {
    self._value;
  });
});
```

## Rule Modify Public Variables (no-public)

With public member variables, and having external callers modify member variables, it becomes difficult to track down what was it that changed the values The best thing to do is to avoid public variables altogether and use getter and setter methods.

## Rule Details

The following patterns are considered warnings:

```javascript
var obj = {
  foo: function () {
    this.somePublicVar = 10;
  }
};

class SomeClass {
  foo() {
    this.somePublicVar = 10;
  }
}
```

The following are not warnings:

```javascript
var obj = {
  foo: function () {
    this._somePrivateVar = 10;
  }
};

class SomeClass {
  foo() {
    this._somePrivateVar = 10;
  }
}

var obj = {
  foo: function () {
    this.somePublicVar; // Merely accessing it is not an issue.
  }
};

class SomeClass {
  foo() {
    this.somePublicVar; // Merely accessing it is not an issue.
  }
}

class SomeClass {
  get somePublicProperty() { return this._somePublicProperty; }
  set somePublicProperty(x) { return this._somePublicProperty; }

  foo() {
    this.somePublicProperty = 10;
  }
}
```
