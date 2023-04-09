import request from '@/utils/request'
import axios from "axios";

const REQ_PATH = '/ks-assets-audience'

/**
 * @description 分页获取人群包列表
 * @param {String} data.page     - 当前页,示例值(1)
 * @param {String} data.page_size   - 页面大小,示例值(20)
 * @param {String} data.page_type     - 是否分页获取(0:分页，1：不分页)
 * @param {String} data.advertiser_subject_name     - 主体名称
 * @param {String} data.nameOrId     - 人群名称或Id
 * @param {String} data.project_id   - 项目id
 * @return {Promise}
 */
export function getLocalAudienceNewPages(params) {
  return request.get(`${REQ_PATH}/getLocalAudienceNewPages`, {params});
}

/**
 * @description 删除人群包
 * @param {String} data.custom_audience_id     - 人群包id
 * @param {String} data.project_id   - 项目id
 * @return {Promise}
 */
export function delAudiencePages(data) {
  return request.post(`${REQ_PATH}/delAudiencePages`, data);
}

/**
 * @description 同步广告主的人群包
 * @param {String} data.advertiser_id    - 账户id
 * @param {String} data.audience_ids      - 人群包
 * @return {Promise}
 */
export function synchroTtDmp(data) {
  return request.post(`${REQ_PATH}/synchroTtDmp`, data)
}

/**
 * @description 获取线上人群包列表
 * @param {String} data.advertiser_id  - 账户id
 * @return {Promise}
 */
export function getOnlineTtDmp(params, callBack) {
  return request.get(`${REQ_PATH}/getOnlineTtDmp`, {
    params,
    cancelToken: new axios.CancelToken(c => {
      // c === 取消请求函数
      callBack(c)
    }),
  })
}

/**
 * @description 推送人群包
 * @param {String} data.advertiser_id    - 账户id
 * @param {String} data.advertiser_ids    - 目标人群包id
 * @param {String} data.audience_id    - 人群包
 * @return {Promise}
 */
export function pushAudiences(data) {
  return request.post(`${REQ_PATH}/pushAudiences`, data)
}

/**
 * @description 通过人群包id获取人群包名称
 * @param {String} data.advertiser_id	  - 账户id
 * @param {Array} data.audience_ids	  - 人群包ids
 * @return {Promise}
 */
export function getAudienceName(data) {
  return request.post(`${REQ_PATH}/getAudienceName`, data)
}
