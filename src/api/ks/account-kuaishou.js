import request from '@utils/request'
import qs from "qs";

const REQ_PATH = '/ks-account-info'

// 根据广告主角色获取广告主列表数据
export function getAccountListByRole(data) {
  return request.post(`${REQ_PATH}/getAccountListByRole`, data)
}

// 单个或批量删除账号
export function delAdvertisers(data) {
  return request.post(`${REQ_PATH}/delAdvertisers`, data);
}

// 单个或批量修改账号信息
export function updateAccountInfo(data) {
  return request.post(`${REQ_PATH}/updateAccountInfo`, data)
}

/**
 * @description  单个或批量修改账号状态
 * @param params
 * @param {Array} params.advertiser_id_list     -  广告主id,需过滤状态为授权失败的广告主
 * @param {String,Number} params.advertiser_status   -  账号状态（0启用1停用）
 * @returns {Promise<AxiosResponse<any>>}
 */
export function updateAdvertiserStatus(data) {
  return request.post(`${REQ_PATH}/updateAdvertiserStatus`, data)
}

// 根据项目id获取快手账户
// params.project_id 项目id
export function getAccountByProjectId(params) {
  return request.get(`${REQ_PATH}/getAccountByProjectId`, {
    params,
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  });
}
