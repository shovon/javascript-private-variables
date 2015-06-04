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
    node.type !== 'VariableDeclaration'
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
    }
  }
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
    return isIdentifierThis(identifier, node.parent);
  }

  if (
    assignment.type === 'VariableDeclaration' &&
    assignment.init.type === 'ThisExpression'
  ) {
    return true;
  } else if (
    assignment.type === 'VariableDeclaration' &&
    assignment.init.type === 'Identifier'
  ) {
    return isIdentifierThis(assignment.init.name, node);
  }

  return false;

}
