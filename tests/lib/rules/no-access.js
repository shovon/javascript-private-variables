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
    ].join('')
  ],

  invalid: [
    {
      code: 'var obj = { _someValue: "foo" }; obj._someValue;',
      errors: [
        { message: 'Accessing property with leading underscore not allowed.' }
      ]
    }
  ]
});
