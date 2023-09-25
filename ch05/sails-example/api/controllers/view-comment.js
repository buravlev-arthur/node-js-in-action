module.exports = {

  friendlyName: 'Comment controller',

  description: 'Provide comment data by id',

  inputs: {
    commentId: {
      description: 'Id of comment.',
      type: 'number',
      required: true
    }
  },
  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/comment'
    },
    notFound: {
      description: 'No comment with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },
  fn: async function ({commentId}) {
    var comment = await Comments.findOne({ id: Number(commentId) });

    if (!comment) { throw 'notFound'; }

    return {
      text: comment.text
    };
  }
};
