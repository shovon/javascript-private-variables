module.exports = function (context) {
  return {
    AssignmentExpression: function (node) {
      if (
        node.left.type === 'MemberExpression' &&
        node.left.property.name[0] !== '_'
      ) {
        context.report(node, 'Only allowed to modify private variables');
      }
    }
  }
};
