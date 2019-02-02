import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import commonStore from './stores/commonStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = '/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

const tokenPlugin = req => {
  let token = commonStore.token;
  if (token) {
    req.set('authorization', `Bearer ${token}`);
  }
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
};

const Message = {
  get: () => requests.get('/messages'),
  delete: id => requests.del(`/messages/${encode(id)}`),
  update: (id, body) => requests.put(`/messages/${encode(id)}`, { message: { body } }),
  add: body => requests.post('/messages/', { message: { body } })
};

const Auth = {
  current: () => requests.get('/user'),
  save: user => requests.put('/user', { user }),
  login: (email, password) => requests.post('/users/login', { user: { email, password } }),
  register: (email, username, password) => requests.post('/users', { user: { email, username, password } })
};

const TodoList = {
  get: () => requests.get('/todolist/'),
  add: title => requests.post('/todolist/', { list: { title: title } })
};

const Todo = {
  add: (listId, content, deadlineAt) => requests.post('/todo/', { todo: { listId, content, deadlineAt } })
};

const Group = {
  add: (title, nameId) => requests.post('/group', { group: { title, nameId } }),
  get: nameId => requests.get(`/group/${encode(nameId)}`),
  getMyGroups: () => requests.get('/group'),
  join: groupId => requests.post(`/group/join?groupId=${groupId}`),
  leave: groupId => requests.post(`/group/leave?groupId=${groupId}`)
};

const Profile = {
  get: username => requests.get(`/profiles/${username}`)
};

export default {
  Group,
  Message,
  Auth,
  Profile,
  TodoList,
  Todo
};
