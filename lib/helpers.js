var assert = require('assert');

function traverseToBlockStatement(node) {

  if (node === undefined || node === null) {
    return null;
  }

  if (node.type !== 'BlockStatement' && node.type !== 'Program') {
    return traverseToBlockStatement(node.parent);
  }

  return node;
}

function traverseToStatement(node) {
  if (node === undefined || node === null) {
    return null;
  }

  if (
    node.type !== 'ExpressionStatement' &&
    node.type !== 'VariableDeclaration' &&
    node.type !== 'IfStatement'         &&
    node.type !== 'FunctionDeclaration' &&
    node.type !== 'ClassDeclaration'
  ) {
    return traverseToStatement(node.parent);
  }

  return node;
}

function findAllAssignmentsBeforeNode(node) {
  var block = traverseToBlockStatement(node);
  if (block === null) { return []; }
  var statement = traverseToStatement(node);
  if (statement === null) { return []; }

  assert(statement.parent === block);

  var assignments = [];

  var foundStatement = false;
  for (var i = block.body.length - 1; i >= 0; i--) {
    var s = block.body[i];
    if (!foundStatement && s === statement) {
      foundStatement = true;
    } else if (foundStatement) {
      if (s.type === 'VariableDeclaration') {
        for (var j = s.declarations.length - 1; j >= 0; j--) {
          assignments.push(s.declarations[j]);
        }
      } else if (
        s.type === 'ExpressionStatement' &&
        s.expression.type === 'AssignmentExpression'
      ) {
        assignments.push(s.expression);
      }
    }
  }

  assignments.reverse();
  return assignments;
}

function findLatestAssignmentOfIdentifier(identifier, assignments) {
  for (var i = assignments.length - 1; i >= 0; i--) {
    var assignment = assignments[i];
    if (assignment.type === 'VariableDeclarator') {
      if (assignment.id.name === identifier) {
        return assignment;
      }
    } else if (
      assignment.type === 'AssignmentExpression' &&
      assignment.left.name === identifier
    ) {
      return assignment;
    }
  }
}

function getInitializerType(node) {
  if (node.type === 'VariableDeclarator') {
    return node.init && node.init.type;
  } else if (node.type === 'AssignmentExpression') {
    return node.right.type;
  }

  throw new Error('Something wrong happened.');
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

  var assignments = findAllAssignmentsBeforeNode(node);
  var assignment = findLatestAssignmentOfIdentifier(identifier, assignments);

  if (!assignment) {
    var blockStatement = traverseToBlockStatement(node);
    return isIdentifierThis(identifier, blockStatement.parent);
  }

  if (getInitializerType(assignment) === 'ThisExpression') {
    return true;
  } else if (getInitializerType(assignment) === 'Identifier') {
    return isIdentifierThis(assignment.init.name, node);
  }

  return false;

}
