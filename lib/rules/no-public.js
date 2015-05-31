function propertiesHaveSetterOfName(setterName, body) {
  return body.some(function (node) {
    if (node.kind === 'set' && node.key.name === setterName) {
      return true;
    }
  });
}

function setterOfNameExists(setterName, node) {
  if (node === undefined || node.parent === null) {
    return false;
  }

  if (node.type !== 'ClassDeclaration' && node.type !== 'ObjectExpression') {
    return setterOfNameExists(setterName, node.parent);
  }

  var properties =
    node.type === 'ClassDeclaration' ? node.body.body : node.properties;

  return propertiesHaveSetterOfName(setterName, properties);
}

module.exports = function (context) {
  return {
    AssignmentExpression: function (node) {
      if (
        node.left.type === 'MemberExpression' &&
        node.left.property.name[0] !== '_' &&
        !setterOfNameExists(node.left.property.name, node)
      ) {
        context.report(node, 'Only allowed to modify private variables');
      }
    }
  }
};
