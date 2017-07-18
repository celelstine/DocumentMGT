import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { MemoryRouter} from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Documents from '../../components/Documents';
import mockData from '../../../server/tests/mockData';

let mockDocument = mockData.document;
mockDocument.createdAt = new Date();
mockDocument.id = 1;
mockDocument.owner = 1;
const getAttribute = value => ('test');

const mockStore = configureStore();
const initialState = {
  message: {
    info: '',
    from: ''
  },
  login: true,
  SignupMessage: true,
  roles: [],
  createDocStatus: {},
  Documents: {
    type: 'GET_DOCUMENTS',
    status: 'success',
    documents: [
      {
        id: 7,
        title: 'Jesus loves me and yo',
        synopsis: null,
        body: 'the first person to ever care about you',
        role: 20,
        accessRight: 'private',
        owner: 228,
        author: 'nkem cele okwudiri',
        createdAt: '2017-06-29T02:24:02.521Z',
        updatedAt: '2017-07-09T21:12:23.677Z'
      },
    ],
    pageCount: 2
  },
  deleteDocument: {},
  document: {},
  Users: {}
}

const store = mockStore(initialState);
const mockTab = {
  preventDefault: jest.fn(),
  target: {
    getAttribute,
    name: 'password',
    value: 'test'
  }
};


// mock html control
const mockEvent = mockData.mockEvent;

const props1 = {
  status: '',
  documents: [mockDocument],
  pageCount: 0,
  message: '',
  deleteStatus: '',
  getDocuments: () => {},
  deleteDocument: () => {},
  sendMessage: () => {},
  store
};

const setup = () => {
  const Wrapper = mount(
    <MemoryRouter>
      <Documents {...props1} />
    </MemoryRouter>
  );
  return {
    props: props1,
    Wrapper
  };
};




describe('components', () => {
  describe('Documents', () => {
    const { Wrapper, props } = setup();
    
    describe('should render a search form', () => {
      describe('should render a textbox to recieve user\'s search hint', () => {
        const txtsearchHint = Wrapper.find('#searchHint').props();
        it('ID should be "txtsearchHint"', () => {

console.log('.........................................',document.getElementById);
          expect(txtsearchHint.id).toEqual('searchHint');
        });

        describe('onChange event should invoke a function "searchDocument"',
        () => {
          describe('searchDocument', () => {
            it('is a function', () => {
              expect(txtsearchHint.onChange).toBeInstanceOf(Function);
            });

            it('should call the action "getDocuments" with the value of the' +
            'searchHint textbox', () => {
              console.log('txtsearchHint......................', txtsearchHint);
              // wrapper.ref('searchHint').prop('value') = 'love';
              // Wrapper.searchHint.value = 'love';
              //txtsearchHint.value = 'love';
              txtsearchHint.onChange();
              expect(props.getDocuments.mock.calls.length).toBe(2);
            });
          });
        });
      });
    });

    describe('should have a tab for each access right', () => {
      it('should have tab for "myDocuments" documents', () => {
        const myDocumentsTab = Wrapper.find('#myDocument').props();
        expect(myDocumentsTab.value).toEqual('myDocument');
      });

      it('should have tab for "private" documents', () => {
        const myDocumentsTab = Wrapper.find('#private').props();
        expect(myDocumentsTab.value).toEqual('private');
      });

      it('should have tab for "public" documents', () => {
        const myDocumentsTab = Wrapper.find('#public').props();
        expect(myDocumentsTab.value).toEqual('public');
      });

      it('should have tab for "role" documents', () => {
        const myDocumentsTab = Wrapper.find('#role').props();
        expect(myDocumentsTab.value).toEqual('role');
      });

      it('each tab should call a function "getDocuments" on click', () => {
        const myDocumentsTab = Wrapper.find('#role').props();
        myDocumentsTab.onClick(mockTab);
        expect(props.getDocuments.mock.calls.length).toBe(3);
      });
    });

    describe('should call componentWillReceiveProps on update', () => {
      // const spy = jest.spyOn(Documents, 'componentWillReceiveProps');
      // expect(spy).toHaveBeenCalled();
      // set localStorage
      const mockUser = mockData.user;
      mockUser.id = 1;
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      it('should update state node "message" with the value of the props ' +
         '"message" when the props "status" ' +
          'does not have the value "success"', () => {
        Wrapper.setProps({
          status: 'failed',
          message: 'unknown request',
          deleteStatus: 'failed'
        });
        expect(Wrapper.state('message')).toEqual('unknown request');
      });

      it('should update state node "message" with the value of the props ' +
         '"message" when the props "deleteStatus" ' +
          'does not have the value "success"',
      () => {
        Wrapper.setProps({
          deleteStatus: 'failed',
          message: 'unknown request'
        });
        expect(Wrapper.state('message')).toEqual('unknown request');
      });

      it('should update state node "message" with the value ' +
         '"Document has been deleted successfully" ' +
         'when the props "deleteStatus" has the value "success"',
      () => {
        Wrapper.setProps({
          deleteStatus: 'success',
        });
        expect(Wrapper.state('message'))
        .toEqual('Document has been deleted successfully');
      });
    });

    describe('should render a table of document', () => {
      describe('rows', () => {
        it('should have column "Author"', () => {
          const author = Wrapper.find('#author1').props();
          console.log(author);
          expect(author.value).toEqual(mockDocument.author);
        });
        // it('should have column "Title"', () => {
        //   const title = Wrapper.find('#title1').props();
        //   console.log('title', title);
        //  // expect(title.value).toEqual(mockDocument.title);
        // });
        // // it('should have column "createdAt"', () => {
        // //   const createdAt = Wrapper.find('#createdAt1').props();
        // //   expect(createdAt.value).toEqual(mockDocument.createdAt);
        // // });
        // it('should have colomn "Author"', () => {
        //   const deleteButton = Wrapper.find('#1').props();
        //   expect(deleteButton.value).toEqual(mockDocument.id);
        // });
      });
    });
  });
});


