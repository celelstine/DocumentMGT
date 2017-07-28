import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { CreateDocument } from '../../components/CreateDocument';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
let mockUser = mockData.regularUser;
let mockDocument = mockData.document;
mockDocument.createdAt = new Date().toDateString();
mockDocument.id = 1;
mockDocument.owner = 1;

const mockBtn = {
  target: {
    id: 'public',
    value: 'public',
    name: 'accessRight'
  }
}
const mockEvent = {
  preventDefault: jest.fn(),
  target: {
    name: 'password',
    value: 'test'
  }
};

const setup = () => {
  const props = {
    createDocStatus: '',
    errorMessage: '',
    upsertDocument: jest.fn(),
    getDocument: jest.fn(),
    match: {
      params: {
        documentId: 1
      }
    }
  };
  const Wrapper = mount(
    <CreateDocument {...props} />
  );
  return {
    props,
    Wrapper
  };
};


describe('components', () => {
  describe('Document', () => {
    const { Wrapper, props } = setup();
    Wrapper.setProps({
      document: mockDocument,
      status: 'success'
    });

    describe('should render a textbox for document title', () => {
      const txtTitle = Wrapper.find('#title').props();
      it('textbox should be required', () => {
        expect(txtTitle.required).toEqual(true);
      });
      it('should have a placeholder "First Name"', () => {
        expect(txtTitle.placeholder).toEqual('Title');
      });
      it('should have a className "validate"', () => {
        expect(txtTitle.className).toEqual('validate');
      });
    });

    describe('render a group radio button for access right', () => {
      it('has a radio button for private access right', () => {
        const rdbPrivate = Wrapper.find('#private').props();
        expect(rdbPrivate.id).toEqual('private');
      });

      it('has a radio button for private access right', () => {
        const rdbPublic = Wrapper.find('#public').props();
        expect(rdbPublic.id).toEqual('public');
      });

      it('has a radio button for private access right', () => {
        const rdbPublic = Wrapper.find('#public').props();
        expect(rdbPublic.id).toEqual('public');
      });
      
      it('each radio button should call the "onChange" function on click',
      () => {
        const myDocumentsTab = Wrapper.find('#public').props();
        myDocumentsTab.onChange(mockBtn);
        const stateAccessRight = Wrapper.state('accessRight');
        expect(stateAccessRight).toBe(mockBtn.target.id);
      });
    });

    describe('should render a  button', () => {
      const btnSubmit = Wrapper.find('#btnsubmit').props();
      console.log('.......................................ffff', btnSubmit.onClick)
      
      it('should have a type "submit" ', () => {
        expect(btnSubmit.type).toBe('submit');
      });
      it('should invoke the saveDocument function on click', () => {
        describe('saveDocument function', () => {
          // set user profile in localstorage
            localStorage.setItem('userInfo', JSON.stringify(mockUser));
            Wrapper.setState({
              accessRight: 'role'
            });
          describe('when every field is valid', () => {
            const btnSubmit1 = Wrapper.find('#btnsubmit').props();
            btnSubmit1.onClick(mockEvent);
            it('should call the saveDocument action ', () => {
              expec(props.upsertDocument.mock.calls.length).toBe(1);
            });
          });
          describe('when a fields is invalid', () => {
            const btnSubmit2 = Wrapper.find('#btnsubmit').props();
            Wrapper.setState({
              accessRight: null,
              title: 'ab'
            });
            btnSubmit2.onClick(mockEvent);
            it('should display a message ', () => {
              const messageState = Wrapper.state('message');
              const isSubString = messageState.includes("please")
              expect(isSubString).toEqual(true);
            });
          })
        })
      });
    });

    describe('should call componentWillReceiveProps on update', () => {
      it('should display a message from \'upsertDocument\' actions',
      () => {
        Wrapper.setProps({
          messageFrom: 'upsertDocument',
          message: 'document has been updated successfully',
        });
        const messageState = Wrapper.state('message');
        const isSubString = messageState.includes("successfully")
        expect(isSubString).toEqual(true);
      });
    });
  });
});

