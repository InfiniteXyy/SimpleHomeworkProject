import { observable } from 'mobx';

export class GroupStore {
  @observable
  groups = [
    {
      id: '1',
      title: '计算机网络一班'
    },
    {
      id: '2',
      title: '计算机网络二班'
    }
  ];
}

export default new GroupStore();
