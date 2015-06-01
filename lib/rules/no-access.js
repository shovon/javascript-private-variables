function hasAssignmentOfIdentifier(identifier, node) {
  if (node.body !== undefined || node.body !== null) {
    for (var i = 0; i < )
  }

  return false;
}

function isIdentifierThis(identifier, node) {
  if (node === undefined || node === null) {
    return false;
  }

  if (node.type !== 'ExpressionStatement') {
    return isIdentifierThis(identifier, node.parent);
  }

  var parent = node.parent;


}

module.exports = function (context) {
  return {
    MemberExpression: function (node) {
      if (
        node.property.name[0] === '_' &&
        node.object.type !== 'ThisExpression' &&
        !isIdentifierThis(node.object.name, node)
      ) {
        context.report(node, 'Accessing property with leading underscore not allowed.');
      }
    }
  }
};
