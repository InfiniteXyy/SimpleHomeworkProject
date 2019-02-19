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
  get: (groupId = '') => requests.get(`/messages?groupId=${groupId}`),
  delete: id => requests.del(`/messages/${encode(id)}`),
  update: (id, body) => requests.put(`/messages/${encode(id)}`, { message: { body } }),
  add: (groupId, payload, body) => requests.post('/messages/', { message: { body, groupId, payload } }),
  loadMore: (from, groupId = '') => requests.get(`/messages?from=${encode(from)}&groupId=${groupId}`)
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
  add: (listId, content, deadlineAt, remarks) =>
    requests.post('/todo/', { todo: { listId, content, deadlineAt, remarks } }),
  toggle: (todoId, type) => requests.post(`/todo/${todoId}?type=${type}`),
  delete: todoId => requests.del(`/todo/${todoId}`),
  update: (todoId, listId, content, deadlineAt, remarks, imageUrl, noticeAt) =>
    requests.put(`/todo/${todoId}`, {
      todo: {
        listId,
        content,
        deadlineAt,
        imageUrl,
        noticeAt,
        remarks
      }
    })
};

const Group = {
  add: (title, nameId) => requests.post('/group', { group: { title, nameId } }),
  get: nameId => requests.get(`/group/${encode(nameId)}`),
  getMyGroups: () => requests.get('/group'),
  join: groupId => requests.post(`/group/join?groupId=${groupId}`),
  leave: groupId => requests.post(`/group/leave?groupId=${groupId}`),
  search: (nameId = '', title = '') => requests.get(`/group/search?nameId=${encode(nameId)}&title=${encode(title)}`)
};

const Card = {
  get: () => requests.get('/card'),
  create: (title, creatorTitle, weekdays, daytime, coverImg, groupId = '0') =>
    requests.post('/card/', { card: { title, creatorTitle, weekdays, daytime, coverImg, groupId } }),
  check: cardId => requests.post(`/card/log?cardId=${cardId}`),
  getLogs: () => requests.get('/card/log'),
  deleteLog: logId => requests.del(`/card/log/${logId}`)
};

const Profile = {
  get: username => requests.get(`/profile/${username}`)
};

const GroupCard = {
  get: groupId => requests.get(`/group/card?groupId=${groupId}`)
};

export default {
  Group,
  GroupCard,
  Message,
  Auth,
  Profile,
  TodoList,
  Todo,
  Card
};
