import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import tinymce from 'tinymce';
import toaster from 'toastr';
import upsertDocument from '../actions/createDocument';
import getDocument from '../actions/getDocument';


/**
 * react component that displays a document
 * @class CreateDocument
 * @extends {React.Component}
 */
export class CreateDocument extends React.Component {

  /**
   * Creates an instance of CreateDocument.
   * @param {any} props
   * @memberof CreateDocument
   */
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      title: '',
      curDocument: {},
      body: '',
      docId: 0,
      editor: null
    };
    this.saveDocument = this.saveDocument.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setDocument = this.setDocument.bind(this);
  }


  /**
   * @returns {null} - null
   * @memberof CreateDocument
   */
  componentWillMount() {
    const documentID = this.props.match.params.documentId;
    if (documentID) {
      this.props.getDocument(documentID);
    }
  }

   /**
   * @returns {null} - null
   * @memberof CreateDocument
   */
  componentDidMount() {
    tinymce.init({
      selector: '#content',
      plugins: 'autolink link image lists' +
                ' print preview textcolor table emoticons codesample',
      toolbar: 'undo redo | bold italic | ' +
      'fontsizeselect fontselect | ' +
      'alignleft aligncenter alignright | forecolor backcolor' +
      '| table | numlist bullist | emoticons | codesample',
      table_toolbar: 'tableprops tabledelete ' +
      '| tableinsertrowbefore ' +
      'tableinsertrowafter tabledeleterow | tableinsertcolbefore ' +
      'tableinsertcolafter tabledeletecol',
      fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
      height: 300,
      width: '100%',
      browser_spellcheck: true,
      setup: (editor) => {
        this.setState({ editor });
        setTimeout(() => {
          editor.setContent(this.state.body);
        }, 1000);
      }
    });
  }

  /**
   * - runs when component recieve new props
   * @param {any} nextProps
   * @memberof CreateDocument
   * @returns {null} - null
   */
  componentWillReceiveProps(nextProps) {
    // show the document for update
    if (nextProps.document) {
      const curDocument = nextProps.document;
      this.setState({
        title: curDocument.title,
        body: curDocument.body.toString(),
        curDocument,
        docId: curDocument.id
      });

      // set the title
      this.title.value = this.state.title;
      document.getElementById('title').value = curDocument.title;
      // find the selected access right
      const accessRights = document.getElementsByName('accessRight');
      const accessRight = curDocument.accessRight;

      for (let i = 0; i < accessRights.length; i += 1) {
        if (accessRights[i].id === accessRight) {
          accessRights[i].checked = true;
        }
      }
    }

    if (nextProps.messageFrom === 'upsertDocument') {
      let message = this.props.message;
      if (this.props.message === 'successs') {
        message = 'Document has been saved successfully';
        tinymce.get('content').setContent('');
      }
      toaster.info(message);
      this.setState({
        message
      });
    }
  }

  componentWillUnmount() {
    tinymce.remove(this.state.editor);
  }
  /**
   * set the value of the control to the respective state node
   * @param {*} e
   * @returns {null} - null
   */
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /**
   * set state to documents or error message
   * @param {object} apiResponse - promise from the api called
   * @memberof Documents
   * @returns {null} - null
   */
  setDocument(apiResponse) {
    // get server response and set state
    apiResponse
    .then((response) => {
      if (response.message) {
        this.setState({
          message: response.message
        });
        toaster.warning(response.message);
      } else {
        const curDocument = response.document.data;
        this.setState({
          title: curDocument.title,
          body: curDocument.body.toString(),
          curDocument,
          docId: curDocument.id
        });

        // set the title
        this.title.value = curDocument.title;
        // find the selected access right
        const accessRights = document.getElementsByName('accessRight');
        const accessRight = curDocument.accessRight;

        for (let i = 0; i < accessRights.length; i += 1) {
          if (accessRights[i].id === accessRight) {
            accessRights[i].checked = true;
          }
        }
      }
    });
  }

  /**
   * create a document object and send a request to create the document
   * @param {*} e the submit button
   * @returns {null} - null
   */
  saveDocument(e) {
    e.preventDefault();
    // get the  text editor content
    const body = tinyMCE.get('content').getContent();
    // find the selected acess right
    const accessRights = document.getElementsByName('accessRight');
    let accessRight;

    for (let i = 0; i < accessRights.length; i += 1) {
      if (accessRights[i].checked) {
        accessRight = accessRights[i].id;
        break;
      }
    }

    // create error message
    let message;
    if (body === '') {
      message = 'Please insert the content of the document';
    }
    if (!accessRight) {
      message += `${(message) ? ' and ' : 'Please'} select an access mode`;
    }
    if (message) {
      this.setState({
        message
      });
    } else {
      /**
       * build api request data
       * create user info from localStorage
       */
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const document = {
        title: this.title.value,
        body,
        owner: userInfo.id,
        accessRight,
        role: userInfo.role
      };
      // call upsertDocument action
      this.props.upsertDocument(document, this.state.docId);
    //   .then(response => {
    //     message = 'Document has been saved successfully';
    //     // reset  state
    //     this.setState({
    //       message,
    //       title: '',
    //       curDocument: {},
    //       body: ''
    //     });
    //     if (message) {
    //       Materialize.toast(message, 3000, 'rounded')
    //     }
    //   },
    //   (error) => {
    //     message = error.data.message;
    //     this.setState({
    //       message
    //     });
    //     if (message) {
    //       Materialize.toast(message, 3000, 'rounded')
    //     }
    //  })
    }
  }

  /**
   * @returns {object} - html DOM
   * @memberof CreateDocument
   */
  render() {
  //   // const body = this.state.body;
  //   $(() => {
  //     tinymce.get('content').setContent('Helllo');
  //   });
    return (
      <div className="container">
        <div className="body row">
          <p id="message"> {this.state.message} </p>
          <form className="col s12" name="createDoc">
            <br />
            <div className="input-field col s12">
              <input
                placeholder="Title"
                id="title"
                type="text"
                name="title"
                className="validate"
                onChange={this.onChange}
                ref={(input) => { this.title = input; }}
                required
              />
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field col s12">
              <textarea
                placeholder="Body"
                id="content"
                type="text"
                name="body"
                onChange={this.onChange}
                className="materialize-textarea"
              />
            </div>
            <div className="input-field col l2 s12 m12">
              Access Mode &nbsp;
              <i className="material-icons prefix">lock</i>
            </div>
            <div className="input-field col l2 s4">
              <input
                name="accessRight"
                type="radio"
                id="private"
                onChange={this.onChange}
              />
              <label htmlFor="private">Private</label>
            </div>
            <div className="input-field col l2 s4">
              <input
                name="accessRight"
                type="radio"
                id="public"
                onChange={this.onChange}
              />
              <label htmlFor="public">Public</label>
            </div>
            <div className="input-field col l2 s4">
              <input
                name="accessRight"
                type="radio"
                id="role"
                onChange={this.onChange}
              />
              <label htmlFor="role">Role</label>
            </div>
            <div className="input-field col s12" >
              <button
                className="btn waves-effect waves-light right"
                type="submit"
                name="action"
                onClick={this.saveDocument}
              >
                {(this.state.body === '') ? 'Submit' : 'Update' }
                <i className="material-icons right">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = state => (
  {
    message: state.message.info,
    messageFrom: state.message.from,
    document: state.document.document
  }
);

// Maps actions to props
const mapDispatchToProps = dispatch => (
  {
    upsertDocument: (document, docId) =>
     dispatch(upsertDocument(document, docId)),
    getDocument: documentID => dispatch(getDocument(documentID))
  }
);

CreateDocument.propTypes = {
  upsertDocument: PropTypes.func.isRequired,
  getDocument: PropTypes.func.isRequired,
  messageFrom: PropTypes.string,
  message: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      documentId: PropTypes.string
    })
  }),
  document: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    author: PropTypes.string,
    accessRight: PropTypes.string,
    owner: PropTypes.number,
    createdAt: PropTypes.string
  }),
};

CreateDocument.defaultProps = {
  message: '',
  messageFrom: '',
  document: {},
  match: {}
};
// Use connect to put them together

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(
  CreateDocument));
