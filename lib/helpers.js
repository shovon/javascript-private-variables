/**
 * This looks at every one of the parent's expression statements, and walks
 * backwards to check and see if the identifier has been assigned to `this`.
 *
 * @param {String} identifier
 * @param {Object} node
 * @return {Boolean}
 */
module.exports.hasAssignmentOfIdentifier = hasAssignmentOfIdentifier;
function hasAssignmentOfIdentifier(identifier, node) {
  var parent = node.parent;

  if (parent !== undefined || parent !== null) {
    var statementIndex = -1;
    for (var i = parent.body.length; i >= 0; i--) {
      var statement = parent.body[i];
      if (statementIndex === -1 && statement === node) {
        statementIndex = i;
      } else if (statementIndex >= 0) {

        // TODO: identifier check is redundant, below.

        if (statement.type === 'VariableDeclaration') {
          for (var j = 0; j < statement.declarations.length; j++) {
            var declaration = statement.declarations[j]
            if (
              declaration.id.name === identifier &&
              declaration.init.type === 'ThisExpression'
            ) {
              return true;
            } else if (declaration.init.type === 'Identifier') {
              return isIdentifierThis(declaration.init.name, statement);
            }
          }
        } else if (
          statement.type === 'ExpressionStatement' &&
          statement.expression.type === 'AssignmentExpression' &&
          statement.expression.left.name === identifier
        ) {
          if (statement.expression.right.type === 'ThisExpression') {
            return true;
          } else if (statement.expression.right.type === 'Identifier'){
            return isIdentifierThis(statement.expression.right.name);
          } else {
            return false;
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
module.exports.isIdentifierThis = isIdentifierThis;
function isIdentifierThis(identifier, node) {
  if (node === undefined || node === null) {
    return false;
  }

  if (
    node.type !== 'ExpressionStatement' &&
    node.type !== 'IfStatement' &&
    node.type !== 'VariableDeclaration'
  ) {
    return isIdentifierThis(identifier, node.parent);
  }

  if (!hasAssignmentOfIdentifier(identifier, node)) {
    return isIdentifierThis(identifier, node.parent);
  }
  return true;
}