module.exports = function (context) {
  return {
    MemberExpression: function (node) {
      if (
        node.property.name[0] === '_' &&
        node.object.type !== 'ThisExpression'
      ) {
        context.report(node, 'Accessing property with leading underscore not allowed.');
      }
    }
  }
};
