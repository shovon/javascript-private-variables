var helpers = require('../helpers');
var hasAssignmentOfIdentifier = helpers.hasAssignmentOfIdentifier;
var isIdentifierThis = helpers.isIdentifierThis;

module.exports = function (context) {
  return {
    MemberExpression: function (node) {
      if (
        node.property.name[0] === '_' &&
        (
          node.object.type !== 'ThisExpression' &&
          !isIdentifierThis(node.object.name, node)
        )
      ) {
        context.report(
          node,
          'Accessing property "' + node.property.name +
          '" of non-this identifier "' + node.object.name + '" not allowed'
        );
      }
    }
  }
};
