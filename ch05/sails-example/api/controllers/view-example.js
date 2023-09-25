module.exports = {


  friendlyName: 'View example',


  description: 'Display "Example" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/example'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
