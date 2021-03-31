<template>
  <ul class="list">
    <li class="title"><h2>交互相关-toast提示</h2></li>
    <li class="btn-list">
      <span @click="toast('error','出错了！！！')">error</span>
      <span @click="toast('loading', '加载中！')">loading</span>
      <span @click="toast('info', '提示信息！')">info</span>
      <span @click="toast('warn', '当前操作存在危险！')">warn</span>
      <span @click="toast('success', '操作成功！')">success</span>
    </li>
    <li class="title"><h2>模型相关</h2></li>
    <li class="btn-list">
      <span @click="getSelectedModel">获取选中数据</span>
      <template v-if="!unListener">
        <span @click="startListenSelected">开始监听selected变化</span> :
        <span @click="stopListenSelected">取消监听</span>
      </template>
    </li>
    <li>
        <pre>
            {{selectedModel || '暂无选中模型'}}
        </pre>
    </li>
    <li class="btn-list">
      <span @click="unSelectedModel">取消选中</span>
    </li>
    <li class="title"><h2>帐号信息</h2></li>
    <li class="btn-list">
      <span @click="getUserInfo">获取帐号信息</span>
    </li>
    <li class="title"><h2>生命周期</h2></li>
    <li class="btn-list">
      <span @click="onExit">退出</span>
    </li>
  </ul>
</template>

<script>
import {
  MiniAppDesignBaseInfoService,
  MiniAppSelectModelService,
  MiniAppToastService
} from "@manycore/custom-miniapp-sdk";
import { sappSDK } from "servkit";

export default {
  name: "Demo",
  data: () => {
    return {
      selectedModel: '',
      unListener: null,
    }
  },
  methods: {
    async toast(type, message) {
      const toast = await sappSDK.getService(MiniAppToastService);
      if (!toast) {
        return;
      }
      toast[type](message);
    },
    startListenSelected() {
      if (this.unListener) {
        return ;
      }
      const selectModelService = sappSDK.getService(MiniAppSelectModelService);
      if (!selectModelService) {
        return;
      }
      const unListener = selectModelService.watcher.on((model) => {
        if (model && model.length) {
          this.selectedModel = JSON.stringify(model, null, '  ');
        } else {
          this.selectedModel = '';
        }
      });
      this.unListener = unListener;
    },
    stopListenSelected() {
      if (this.unListener) {
        this.unListener();
      }
      this.unListener = undefined;
    },
    async unSelectedModel() {
      const unSelectModelService = sappSDK.getService(MiniAppSelectModelService);
      if (!unSelectModelService) {
        return;
      }
      await unSelectModelService.unSelected();
    },
    async getSelectedModel() {
      const selectModelService = sappSDK.getService(MiniAppSelectModelService);
      if (selectModelService) {
        const model = await selectModelService.getSelected();
        if (model && model.length) {
          this.selectedModel = JSON.stringify(model, null, '  ');
        } else {
          this.selectedModel = '';
        }
      }
    },
    async getUserInfo() {
      const {
        designBaseInfoService,
        toast,
      } = sappSDK.getService({
        designBaseInfoService: MiniAppDesignBaseInfoService,
        toast: MiniAppToastService,
      });
      if (designBaseInfoService && toast) {
        const baseInfo = await designBaseInfoService.getDesignBaseInfo();
        await toast.info(`方案ID：${baseInfo.designId};帐号ID：${baseInfo.userId};帐号名称: ${baseInfo.accountName}; 帐号手机号：${baseInfo.accountPhone}`);
      }
    },
    async onExit() {
      await sappSDK.close();
    },
  }
}
</script>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
}

.title {

}

.btn-list {
  overflow: hidden;
}

.btn-list span {
  float: left;
  padding: 10px 20px;
  background-color: #399d9d;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}

</style>
