import { action, observable } from 'mobx';

export class CheckOutStore {
  @observable
  courseSteps = [
    {
      name: '计算机网络',
      description: '记得去上课哦，上课时间是：xxx，地点是：xxx'
    },
    {
      name: '软件测试与验证',
      description: '记得去上课哦，上课时间是：xxx，地点是：xxx'
    },
    {
      name: '数字逻辑',
      description: '记得去上课哦，上课时间是：xxx，地点是：xxx'
    },
    {
      name: '面向对象设计',
      description: '记得去上课哦，上课时间是：xxx，地点是：xxx'
    }
  ];

  @observable currentStep = 0;

  @action
  nextStep() {
    this.currentStep++;
  }

  @action
  resetStep() {
    this.currentStep = 0;
  }
}

export default new CheckOutStore();
