# Rule Accessing Object Property That Has a Leading Underscore (no-access)

Languages like Python and JavaScript don't have a way to forbid access to specific variables (e.g. the `private` keyword that is available in Java, C++, and C#). And even if there is, it's often only possible through some clever hacks, such as the use of closures. However, this results in code that is cumbersome to debug, and worse, too much garbage generated from  our use of closures, slowing things down.

A better solution would be to run the code against a semantic analyzer, and check and see if the programmer is illegally accessing member variables of an object that have underscores on them.

This is where `eslint-plugin-privacy` comes in. JavaScript programmers have been using underscores to denote that a member variable is private. `eslint-plugin-privacy` enforces that habit, by making sure that a linting error is thrown when a programmer is trying to access a member variable of another class that has a leading underscore.

## Rule Details

The following patterns are considered warnings:

```
obj._somePrivateVar;
obj_anotherPrivateVar;
```

The following patterns are not warnings:

```
var obj = { value: 42, prop: function () { return this.value } };
```