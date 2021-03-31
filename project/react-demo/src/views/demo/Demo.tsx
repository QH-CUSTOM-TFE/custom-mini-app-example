import "./Demo.css";
import {
    MiniAppBootstrapService, MiniAppDesignBaseInfoService,
    MiniAppSelectModelService,
    MiniAppToastService
} from '@manycore/custom-miniapp-sdk';
import { useState } from 'react';
import { sappSDK } from 'servkit';

export default function Demo() {

    // 提示信息
    const toast = (type: keyof MiniAppToastService, message = '') => {
        return async () => {
            const toast = await sappSDK.getService(MiniAppToastService);
            if (!toast) {
                return;
            }
            toast[type](message);
        }
    }

    // 退出
    const onExit = async () => {
        await sappSDK.close();
    };

    // 是否正在生成
    const [selectedModel, setSelectedModel] = useState('');

    const getSelectedModel = async () => {
        const selectModelService = sappSDK.getService(MiniAppSelectModelService);
        if (selectModelService) {
            const model = await selectModelService.getSelected();
            setSelectedModel((model && model.length) ? JSON.stringify(model, null, '  ') : '');
        }
    }

    // 取消选中模型
    const unSelectedModel = () => {
        const unSelectModelService = sappSDK.getService(MiniAppSelectModelService);
        if (!unSelectModelService) {
            return;
        }
        unSelectModelService.unSelected();
    }

    const [hasListened, setListenStatus] = useState<any>(null);
    // 开始监听选中项
    const startListenSelected = async () => {
        if (hasListened) {
            return ;
        }
        const selectModelService = sappSDK.getService(MiniAppSelectModelService);
        if (!selectModelService) {
            return;
        }
        const unListener = selectModelService.watcher.on((model) => {
            setSelectedModel((model && model.length) ? JSON.stringify(model, null, '  ') : '');
        });
        setListenStatus(() => unListener);
    }
    // 取消监听
    const stopListenSelected = async () => {
        if (hasListened) {
            hasListened();
        }
        setListenStatus(null);
    }

    // 获取帐号信息
    const getUserInfo = async () => {
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
    }

    return (
        <div>
            <ul className="list">
                <li className="title"><h2>交互相关-toast提示</h2></li>
                <li className="btn-list">
                    <span onClick={toast('error','出错了！！！')}>error</span>
                    <span onClick={toast('loading', '加载中！')}>loading</span>
                    <span onClick={toast('info', '提示信息！')}>info</span>
                    <span onClick={toast('warn', '当前操作存在危险！')}>warn</span>
                    <span onClick={toast('success', '操作成功！')}>success</span>
                </li>
                <li className="title"><h2>模型相关</h2></li>
                <li className="btn-list">
                    <span onClick={getSelectedModel}>获取选中数据</span>
                    {
                        !hasListened ?
                        <span onClick={startListenSelected}>开始监听selected变化</span> :
                            <span onClick={stopListenSelected}>取消监听</span>
                    }
                </li>
                <li>
                    <pre>
                        {selectedModel || '暂无选中模型'}
                    </pre>
                </li>
                <li className="btn-list">
                    <span onClick={unSelectedModel}>取消选中</span>
                </li>
                <li className="title"><h2>帐号信息</h2></li>
                <li className="btn-list">
                    <span onClick={getUserInfo}>获取帐号信息</span>
                </li>
                <li className="title"><h2>生命周期</h2></li>
                <li className="btn-list">
                    <span onClick={onExit}>退出</span>
                </li>
            </ul>
        </div>
    );
}
