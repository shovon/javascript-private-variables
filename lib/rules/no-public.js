module.exports = function (context) {
  return {
    // MemberExpression: function (node) {
    //   if (
    //     node.property.name[0] === '_' &&
    //     node.object.type !== 'ThisExpression'
    //   ) {
    //     context.report(node, 'Accessing property with underscore not allowed.');
    //   }
    // }

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
