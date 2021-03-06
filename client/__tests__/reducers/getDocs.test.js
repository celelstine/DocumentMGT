import reducer from '../../reducers/getDocuments';
import * as types from '../../actions/actionTypes';
import mockData from '../../../server/tests/mockData';

const action = {
  type: types.GET_DOCUMENTS,
  status: mockData.message,
  documents: {
    rows: [mockData.document],
    pageCount: 1
  }
};

describe('documents reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle "GET_DOCUMENTS"', () => {
    expect(
      reducer([], action)
    ).toEqual(action);
  });
});
