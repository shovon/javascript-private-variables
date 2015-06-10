var assert = require('assert');

// TODO: refactor a lot of this code.

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

function getWhereThisIsAssigned(identifier, node) {

  if (node === undefined || node === null) {
    return false;
  }

  var assignments = findAllAssignmentsBeforeNode(node);
  var assignment = findLatestAssignmentOfIdentifier(identifier, assignments);

  if (!assignment) {
    var blockStatement = traverseToBlockStatement(node);
    return getWhereThisIsAssigned(identifier, blockStatement.parent);
  }

  if (getInitializerType(assignment) === 'ThisExpression') {
    return assignment;
  } else if (getInitializerType(assignment) === 'Identifier') {
    return getWhereThisIsAssigned(assignment.init.name, node);
  }

  return false;

}

function isDefinedAsFunction(identifier, node) {
  throw new Error('Not yet implemented');
}

function isInObjectPrototype(node) {

  assert(node.type === 'FunctionExpression');

  return (
    node.parent.type === 'Property' &&
    node.parent.parent.type === 'ObjectExpression' &&
    node.parent.parent.parent.type === 'AssignmentExpression' &&
    node.parent.parent.parent.left.type === 'MemberExpression' &&
    node.parent.parent.parent.left.property.type === 'Identifier' &&
    node.parent.parent.parent.left.property.name === 'prototype'
  );

}

function isPrototypeMethod(node) {

  assert(node.type === 'FunctionExpression');

  if (
    node.parent.type === 'AssignmentExpression' &&
    node.parent.left.type === 'MemberExpression' &&
    node.parent.left.object.type === 'MemberExpression' &&
    node.parent.left.object.property.type === 'Identifier' &&
    node.parent.left.object.property.name === 'prototype'
  ) {
    return true;
  }

  return isInObjectPrototype(node);

}

function findAllMemberAssignments(node) {
  var blockStatement = traverseToBlockStatement(node);

  var assignments = [];

  return blockStatement.body.filter(function (statement) {
    return (
      statement.type === 'ExpressionStatement' &&
      statement.expression.type === 'AssignmentExpression' &&
      statement.expression.left.type === 'MemberExpression'
    );
  }).map(function (statement) {
    return statement.expression;
  });
}

function findAllPrototypeAssignments(node) {
  var assignments = findAllMemberAssignments(node);

  var result = assignments.filter(function (assignment) {

    return (
      (
        assignment.left.object.type === 'MemberExpression' &&
        assignment.left.object.property.type === 'Identifier' &&
        assignment.left.object.property.name === 'prototype'
      ) || (
        assignment.left.property.type === 'Identifier' &&
        assignment.left.property.name === 'prototype'
      )
    );

  });
  return result;
}

function isFunctionConstructor(node) {
  assert(node.type === 'FunctionDeclaration');

  var prototypes = findAllPrototypeAssignments(node)
    .filter(function (assignment) {

      return (
        (
          assignment.left.object.type === 'MemberExpression' &&
          assignment.left.object.object.type === 'Identifier' &&
          assignment.left.object.object.name === node.id.name
        ) || (
          assignment.left.property.type === 'Identifier' &&
          assignment.left.property.name === 'prototype'
        )
      );
    });

  return prototypes.length >= 1;
}

function isBoundToThis(node) {
  assert(node.type === 'FunctionExpression');

  // console.log(
  //   node.parent.type === 'MemberExpression' &&
  //   node.parent.property.type === 'Identifier' &&
  //   node.parent.property.name === 'bind' &&
  //   node.parent.parent.type === 'CallExpression' &&
  //   node.parent.parent.arguments[0].type === 'ThisExpression'
  // )

  return (
    node.parent.type === 'MemberExpression' &&
    node.parent.property.type === 'Identifier' &&
    node.parent.property.name === 'bind' &&
    node.parent.parent.type === 'CallExpression' &&
    node.parent.parent.arguments[0].type === 'ThisExpression'
  );
}

module.exports.isInClass = isInClass;
function isInClass(node) {
  if (node === undefined || node === null) {
    return false;
  }

  if (node.parent === undefined || node.parent == null) {
    return false;
  }

  if (node.type === 'MemberExpression' && node.object.type === 'Identifier') {
    if (!isIdentifierThis(node.object.name, node)) {
      return false;
    }

    var thisAssigned = getWhereThisIsAssigned(node.object.name, node);
    assert(thisAssigned !== null);
    return isInClass(thisAssigned);
  }

  // TODO: handle the case when a prototype property has been assigned a
  //   function, that has been declared with a function declaration.
  if (
    node.parent.type === 'FunctionExpression' &&
    node.parent.parent !== null && node.parent.parent !== undefined &&
    node.parent.parent.type === 'MethodDefinition'
  ) {
    return true;
  } else if (
    node.parent.type === 'FunctionExpression' &&
    !isBoundToThis(node.parent)
  ) {
    var isprototype = isPrototypeMethod(node.parent);
    return isprototype;
  } else if (node.parent.type === 'FunctionDeclaration') {
    var isconstruct = isFunctionConstructor(node.parent);
    return isconstruct;
  }

  return isInClass(node.parent);
}
