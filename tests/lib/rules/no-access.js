'use strict';

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
          'return this._someValue;',
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

    // [
    //   'var foo = "troll";',
    //   'foo = this;',
    //   'foo._somethingPrivate;'
    // ].join('\n'),

    // [
    //   'var foo = this;';
    //   'var bar = foo;';
    //   'bar._somethingPrivate;'
    // ].join('\n'),

    // [
    //   'var that = this;',
    //   'setTimeout(function () {',
    //   '  that._something',
    //   '});'
    // ].join('\n')
  ],

  invalid: [
    {
      code: 'var obj = { _someValue: "foo" }; obj._someValue;',
      errors: [
        { message: 'Accessing property "_someValue" of non-this identifier "obj" not allowed' }
      ]
    },

    // {
    //   code: 'something._value;',
    //   errors: [
    //     { message: 'Accessing property with leading underscore not allowed.' }
    //   ]
    // },

    // {
    //   code: [
    //     '{',
    //     '  var self = this;',
    //     '}',
    //     'self._somethingPrivate'
    //   ].join('\n'),
    //   errors: [
    //     { message: 'Accessing property with leading underscore not allowed.' }
    //   ]
    // },

    // {
    //   code: [
    //     'self._somethingPrivate;',
    //     'var self = this;'
    //   ].join('\n'),
    //   errors: [
    //     { message: 'Accessing property with leading underscore not allowed.' }
    //   ]
    // }
  ]
});
