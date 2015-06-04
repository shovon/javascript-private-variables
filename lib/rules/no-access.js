var helpers = require('../helpers');
var hasAssignmentOfIdentifier = helpers.hasAssignmentOfIdentifier;
var isIdentifierThis = helpers.isIdentifierThis;

module.exports = function (context) {
  return {
    MemberExpression: function (node) {
      if (node.object.type === 'MemberExpression') {
        'Accessing property "' + node.property.name +
        '" of non-this expression not allowed'
      }

      if (
        node.property.name[0] === '_' &&
        (
          node.object.type !== 'ThisExpression' &&
          (
            node.object.type !== 'Identifier' ||
            !isIdentifierThis(node.object.name, node)
          )
        )
      ) {
        if (node.object.type === 'Identifier') {
          context.report(
            node,
            'Accessing property "' + node.property.name +
            '" of non-this identifier "' + node.object.name + '" not allowed'
          );
        } else {
          context.report(
            node,
            'Accessing property "_value" of non-this object not allowed'
          );
        }
      }
    }
  }
};
