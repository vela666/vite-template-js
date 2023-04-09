import axios from 'axios'
import request from "@utils/request";

const REQ_PATH = '/ks-assets-trial-material'

/**
 * @description 获取试玩素材可推送账号列表
 * @param {String} params.advertiser_id - 广告主id
 */
export function getPushAccountList(params) {
  return request.get(`${REQ_PATH}/getPushAccountList`, {params});
}

/**
 * @description 获取试玩素材列表
 * @param {String} data.advertiser_id   - 广告主id
 * @param {String} data.page  - 当前页,示例值(1)
 * @param {String} data.page_size - 页面大小,示例值(20)
 * @param {String} data.play_name   - 试玩素材名称
 * @param {String} data.play_orientation   - 展示方向：0:横竖均可 1:竖屏 2:横屏
 * @param {String} data.play_type       - 试玩类型：1:轻度，2：重度
 * @param {String} data.project_id       - 项目id
 */
export function getTrialMaterialList(data) {
  return request.post(`${REQ_PATH}/getTrialMaterialList`, data);
}

/**
 * @description 推送试玩素材
 * @param {String} data.advertiser_id   - 广告主id
 * @param {Array} data.target_account_ids  - 推送的目标（广告主id)列表
 * @param {String} data.play_id - 需要推送的试玩素材ID
 */
export function pushTrialMaterial(data) {
  return request.post(`${REQ_PATH}/pushTrialMaterial`, data);
}

/**
 * @description 同步试玩素材
 * @param {String} params.advertiser_id     - 广告主id
 */
export function syncTrialMaterial(params) {
  return request.get(`${REQ_PATH}/syncTrialMaterial`, {params});
}
