'use strict';

var linter = require('eslint').linter;
var ESLintTester = require('eslint-tester');

var eslintTester = new ESLintTester(linter);
eslintTester.addRuleTest('lib/rules/no-public', {
  valid: [
    'this._someValue = 10',
    [
      'var obj = {',
        'method: function () {',
          'this._someValue = 10;',
        '}',
      '};',
      'obj.method();'
    ].join(''),

    {
      code: [
        'class Foo {',
        '  get something() { return this._something; }',
        '  set something(x) { this._something = x; }',
        '  doSomething() {',
        '    this.something = 10;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    },

    {
      code: [
        'var foo = {',
        '  get something() { return this._something; },',
        '  set something(x) { this._something = x; },',
        '  doSomething() {',
        '    this.something = 10;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: 'this.someValue = 10;',
      errors: [
        { message: 'Only allowed to modify private variables' }
      ]
    },

    {
      code: [
        'var obj = {',
        '  method: function () {',
        '    this.someValue = 10;',
        '  }',
        '};',
        'obj.method();'
      ].join('\n'),
      errors: [
        { message: 'Only allowed to modify private variables' }
      ]
    }
  ]
});
