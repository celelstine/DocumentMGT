import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
      editor: null,
      isloading: false
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
      // show progress bar
      this.setState({
        isloading: true,
      });
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
      '| table | numlist bullist | emoticons | codesample | code',
      table_toolbar: 'tableprops tabledelete ' +
      '| tableinsertrowbefore ' +
      'tableinsertrowafter tabledeleterow | tableinsertcolbefore ' +
      'tableinsertcolafter tabledeletecol',
      fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
      height: 300,
      width: '100%',
      browser_spellcheck: true,
      setup: (editor) => {
        this.setState({
          isloading: false,
          editor
        });
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
    if (nextProps.document.body) {
      const curDocument = nextProps.document;
      this.setState({
        title: curDocument.title,
        body: curDocument.body.toString(),
        curDocument,
        docId: curDocument.id,
        isloading: false
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
      console.log('this is the next props', nextProps)
      let message = nextProps.message.toString();
      let title = this.state.title;
      // reset editor when action is successful
      if (message.includes('success')) {
        title = ''
        tinymce.get('content').setContent('');
      }
      toaster.info(message);
      this.setState({
        message,
        isloading: false,
        title
      });
    }
  }

  /**
   * @memberof CreateDocument
   * @returns {null} - null
   */
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
    const title = this.title.value
    // get the  text editor content
    const body = tinyMCE.get('content').getContent();
    // find the selected acess right
    const accessRights = document.getElementsByName('accessRight');
    let accessRight;
    // detect the access right select
    for (let i = 0; i < accessRights.length; i += 1) {
      if (accessRights[i].checked) {
        accessRight = accessRights[i].id;
        break;
      }
    }

    // create error message
    let message;
    // check minimal number of character for title
    console.log(title, '..............', body);
    if (!/^.{3,}$/.test(title)) {
      message = 'Please write the title ';
      console.log('1', message);
    }
    if (!/^.{3,}$/.test(body)) {
      message = `${(message) ? `${message} and` : 'Please'} write the body `;
      console.log('2', message);
    }
    if (!accessRight) {
      message = `${(message) ? `${message} and` : 'Please'} select an access mode`;
      console.log('3', message);
    }

    if (message) {
      message = `${message} of the document.`;
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
        title,
        body,
        owner: userInfo.id,
        accessRight,
        role: userInfo.role
      };
      // call upsertDocument action
      this.props.upsertDocument(document, this.state.docId);
    }
  }

  /**
   * @returns {object} - html DOM
   * @memberof CreateDocument
   */
  render() {
    return (
      <div className="container">
        <div className="body row">
          <p id="message"> {this.state.message} </p>
          {(this.state.isloading)
            ?
              <div className="progress">
                <div className="indeterminate" />
              </div>
            :
            ''
          }
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
                value={this.state.title}
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
                id="btnsubmit"
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
    getDocument: (documentID) => dispatch(getDocument(documentID))
  }
);

CreateDocument.propTypes = {
  upsertDocument: PropTypes.func.isRequired,
  getDocument: PropTypes.func.isRequired,
  messageFrom: PropTypes.string,
  message: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      documentId: PropTypes.number
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(
  CreateDocument));
