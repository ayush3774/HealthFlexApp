import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {fetchUsers} from '../Service/searchSlice';
import {store} from '../Service/store';

describe('fetchUsers', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  it('fetches users successfully', async () => {
    const mockData = {
      items: [
        {
          avatar_url: 'https://avatars.githubusercontent.com/u/188701?v=4',
          id: 188701,
          login: 'ayush',
          type: 'User',
        },
      ],
    };

    mock
      .onGet('https://api.github.com/search/users?q=johndoe+in:login')
      .reply(200, mockData);

    await store.dispatch(fetchUsers('johndoe'));

    const state = store.getState();
    expect(state.search.users).toEqual(mockData.items);
  });

  it('handles API error', async () => {
    const errorMessage = 'Request failed with status code 500';

    // Mock axios.get to return an error
    mock
      .onGet('https://api.github.com/search/users?q=johndoe+in:login')
      .reply(500, {message: errorMessage});

    // Dispatch the fetchUsers action
    const action = await store.dispatch(fetchUsers('johndoe'));

    // Assert the error handling in the state
    const state = store.getState();
    expect(state.search.error).toEqual(errorMessage); // Now it should match the error message in the payload
  });
});
