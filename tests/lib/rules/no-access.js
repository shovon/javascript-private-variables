'use strict';

require('babel-eslint');
var linter = require('eslint').linter;
var ESLintTester = require('eslint-tester');

var eslintTester = new ESLintTester(linter);
eslintTester.addRuleTest('lib/rules/no-access', {
  valid: [
    'var obj = { _someValue: "foo" };',

    [
      'var obj = {',
        '_someValue: "foo",',
        'method: function () {',
        '  return this._someValue;',
        '}',
      '};',
      'obj.method()'
    ].join(''),

    [
      'var self = this;',
      'self._something;'
    ].join('\n'),

    [
      'var self = this;',
      'var yetAnother = "foo";',
      'self._something;'
    ].join('\n'),

    [
      'var self = this;',
      'var yetAnother = "foo"',
      'if (condition) {',
      '  console.log("blah, blah")',
      '}',
      'self._something'
    ].join('\n'),

    [
      'foo(function () {',
      '  var self = this;',
      '  self._something',
      '});'
    ].join('\n'),

    [
      'var self = this;',
      'if (true) {',
      '  self._something = "foo";',
      '}'
    ].join('\n'),

    [
      'var foo = "troll";',
      'foo = this;',
      'foo._somethingPrivate;'
    ].join('\n'),

    [
      'var foo = this;',
      'var bar = foo;',
      'bar._somethingPrivate;'
    ].join('\n'),

    [
      'var foo;',
      'foo = this;',
      'foo._somethingPrivate;'
    ].join('\n'),

    [
      'var foo, bar;',
      'foo = this;',
      'bar = foo;',
      'foo._somethingPrivate;'
    ].join('\n'),

    [
      'var that = this;',
      'setTimeout(function () {',
      '  that._something;',
      '});'
    ].join('\n'),

    [
      'var that = this;',
      '(function () {',
      '  that._something;',
      '}());'
    ].join('\n'),

    [
      'var that = this;',
      'foo(function () {',
      '  that._something;',
      '  that._value = 10;',
      '  var self;',
      '  self = this;',
      '  foo(function () {',
      '    self._another;',
      '  });',
      '});'
    ].join('\n'),

    {
      code: [
        'let that = this;',
        'foo(function () {',
        '  that._value = 10;',
        '});',
      ].join('\n'),
      parser: 'babel-eslint'
    },

    {
      code: [
        'const that = this;',
        'foo(function () {',
        '  that._value = 10;',
        '});',
      ].join('\n'),
      parser: 'babel-eslint'
    },

    {
      code: [
        'that = this;',
        'if (true) {',
        '  if (true) {',
        '    that._value = 10;',
        '  }',
        '}'
      ].join('\n')
    },

    {
      code: [
        'const bar = this;',
        'function foo() {',
        '  bar._another = 20;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    },

    {
      code: [
        'const bar = this;',

        'class Foo {',
        '  constructor() {',
        '    this._something = 10;',
        '    bar._another = 20;',
        '  }',
        '}',

        'const foo = new Foo();'
      ].join('\n'),
      parser: 'babel-eslint'
    },

    {
      code: [
        'class Foo {',
        '  constructor() {',
        '    this._something = 10;',
        '  }',
        '  someMethod() {',
        '    this._someWhatever = 20;',
        '  }',
        '}',
        'const foo = new Foo();'
      ].join('\n'),
      parser: 'babel-eslint',
      args: [2, 'class-only']
    },

    {
      code: [
        'function Foo() {',
        '  this._something = 10;',
        '}',
        'Foo.prototype.someMethod = function () {',
        '  this._someWhatever = 20;',
        '};',
        'var foo = new Foo();'
      ].join('\n'),
      args: [2, 'class-only']
    },

    // {
    //   code: [
    //     'function Foo() {',
    //     '  this._something = 10;',
    //     '}',
    //     'Foo.prototype = {',
    //     '  someMethod: function () {',
    //     '    this._someWhatever = 20;',
    //     '  }',
    //     '};',
    //     'var foo = new Foo();'
    //   ].join('\n'),
    //   args: [2, 'class-only']
    // }
  ],

  invalid: [
    {
      code: 'var obj = { _someValue: "foo" }; obj._someValue;',
      errors: [
        { message: 'Accessing property "_someValue" of non-this identifier "obj" not allowed' }
      ]
    },

    {
      code: 'something._value;',
      errors: [
        { message: 'Accessing property "_value" of non-this identifier "something" not allowed' }
      ]
    },

    {
      code: 'something.another._value;',
      errors: [
        { message: 'Accessing property "_value" of non-this object not allowed' }
      ]
    },

    {
      code: [
        '{',
        '  var self = this;',
        '}',
        'self._somethingPrivate'
      ].join('\n'),
      errors: [
        { message: 'Accessing property "_somethingPrivate" of non-this identifier "self" not allowed' }
      ]
    },

    {
      code: [
        'self._somethingPrivate;',
        'var self = this;'
      ].join('\n'),
      errors: [
        { message: 'Accessing property "_somethingPrivate" of non-this identifier "self" not allowed' }
      ]
    },

    {
      code: [
        'var self = this;',
        'self = "something else";',
        'self._somethingPrivate;'
      ].join('\n'),
      errors: [
        { message: 'Accessing property "_somethingPrivate" of non-this identifier "self" not allowed' }
      ]
    },

    {
      code: [
        'var self = this;',
        'fooFunc(function () {',
        '  self = "something else";',
        '  self._somethingPrivate;',
        '});'
      ].join('\n'),
      errors: [
        { message: 'Accessing property "_somethingPrivate" of non-this identifier "self" not allowed' }
      ]
    },

    {
      code: [
        'class Foo {',
        '  foo() {',
        '    this._something = 10;',
        '  }',
        '}',

        'function fooFunc(cb) {',
        '  // ...',
        '  cb();',
        '}',

        'let foo = this;',

        'fooFunc(function () {',
        '  var somethingElse;',
        '  somethingElse._something = 20;',
        '}, 100);'

      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        { message: 'Accessing property "_something" of non-this identifier "somethingElse" not allowed' }
      ]
    },

    {
      code: [
        'this._something = 10;'
      ].join('\n'),
      parser: 'babel-eslint',
      args: [2, 'class-only'],
      errors: [
        { message: '"This" not instance of any class' }
      ]
    }
  ]
});
