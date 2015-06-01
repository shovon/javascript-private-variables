/**
 * This looks at every one of the parent's expression statements, and walks
 * backwards to check and see if the identifier has been assigned to `this`.
 *
 * @param {String} identifier
 * @param {Object} node
 * @return {Boolean}
 */
function hasAssignmentOfIdentifier(identifier, node) {
  var parent = node.parent;

  if (parent !== undefined || parent !== null) {
    var statementIndex = -1;
    for (var i = parent.body.length; i >= 0; i--) {
      var statement = parent.body[i];
      if (statementIndex === -1 && statement === node) {
        statementIndex = i;
      } else if (statementIndex >= 0) {
        if (statement.type === 'VariableDeclaration') {
          for (var j = 0; j < statement.declarations.length; j++) {
            var declaration = statement.declarations[j]
            if (
              declaration.id.name === identifier &&
              declaration.init.type === 'ThisExpression'
            ) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

/**
 * Checks to see if the specified identifier has been assigned to `this`.
 *
 * @param {String} identifier
 * @param {Object} node
 * @return {Boolean}
 */
function isIdentifierThis(identifier, node) {
  if (node === undefined || node === null) {
    return false;
  }

  if (
    node.type !== 'ExpressionStatement' &&
    node.type !== 'VariableDeclaration'
  ) {
    return isIdentifierThis(identifier, node.parent);
  }

  return hasAssignmentOfIdentifier(identifier, node);
}

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
