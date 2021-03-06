import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @class NavigationBar
 * @extends {React.Component}
 */
class NavigationBar extends React.Component {

  /**
   * Creates an instance of NavigationBar.
   * @param {any} props -
   * @memberof NavigationBar
   * @returns {null} -
   */
  constructor(props) {
    super(props);
    this.signout = this.signout.bind(this);
  }

  /**
   * remove the userInfo and jwt from localStorage
   * redirect user to root page
   * @return {null} Return no value.
  */
  signout() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('jwt');
    window.location = '/#/';
  }


  /**
   * @returns {object} - html DOM
   * @memberof NavigationBar
   */
  render() {
    // get the user's info from localstorage
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const username = user.name;
    const role = user.title;
    const nav = () => (
      <div id="header">
        <li>
          <Link to="/dashboard" id="dashboard">
            Documents
          </Link>
        </li>
        <li>
          <Link to="/createDocument" id="createDocument">
            Create Document
          </Link>
        </li>
        {(user.isAdmin)
          ?
            <li>
              <Link to="/manageUsers" id="manageUsers">
                Manage Users
              </Link>
            </li>
          :
            ''
        }
        <li>
          <Link to="/profile" className="username" id="profile">
            {username}
            <span id="spanRole">
              {(user.isAdmin)
                ?
                  <i className="material-icons">supervisor_account</i>
                :
                  ''
              }
              &nbsp;
              <span className="role">{role} </span>
            </span>
          </Link>
        </li>
        <li>
          <a onClick={this.signout} id="signout">Sign Out</a>
        </li>
      </div>
    );
    return (
      <div className="mainHeader">
        <div className="container">
          <div className="row">
            <div className=" col l12 m12 s12" >
              <nav className="heading">
                <div className="header nav-wrapper" >
                  <a href="#!" className="brand-logo">
                    <img src="/logo.png" id="logoImg" alt="logo" />
                    Doc Hub
                   </a>
                  <a href="#" data-activates="mobile-demo" className="button-collapse">
                    <i className="material-icons">menu</i>
                  </a>
                  <ul className="right hide-on-med-and-down">
                    {nav()}
                  </ul>
                  <ul className="side-nav" id="mobile-demo">
                    {nav()}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Use connect to put them together
export default NavigationBar;
