var helpers = require('../helpers');
var hasAssignmentOfIdentifier = helpers.hasAssignmentOfIdentifier;
var isIdentifierThis = helpers.isIdentifierThis;
var isInClass = helpers.isInClass;

module.exports = function (context) {

  return {
    MemberExpression: function (node) {
      if (
        node.property.name[0] === '_' && (
          node.object.type !== 'ThisExpression' && (
            node.object.type !== 'Identifier' ||
            !isIdentifierThis(node.object.name, node)
          )
        )
      ) {

        // Confirmed; property with preceding underscore is being accessed from
        // a non-this object.
        
        if (node.object.type === 'Identifier') {
          context.report(
            node,
            'Accessing property "' + node.property.name +
            '" of non-this identifier "' + node.object.name + '" not allowed'
          );
        } else {
          context.report(
            node,
            'Accessing property "'
              + node.property.name + '" of non-this object not allowed'
          );
        }
      } else if (
        context.options.indexOf('class-only') >= 0 &&
        node.property.name[0] === '_'
      ) {

        // Well, sure, `this` often means that we are safe to access all private
        // variables, but we need to be careful. Let's see whether or not we are
        // in a class.

        if (!isInClass(node)) {

          console.log(node.property);

          context.report(
            node,
            '"This" not instance of any class'
          );
        }
      }
    }
  }
};
