import request from '@utils/request'

const REQ_PATH = '/ks-assets-targeting'

/**
 * @desc 删除定向包
 * @param {Array} data
 * @param data.id 定向包id
 * @param data.name  定向包名称
 * @param data.project_id 项目id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function delTargeting(data) {
  return request.post(`${REQ_PATH}/delTargeting`, data)
}

/**
 * @desc 分页获取定向包列表
 * @param params.page  当前页,示例值(1)
 * @param params.advertiser_subject_name     广告主主体名称
 * @param params.auto_target 定向包类型
 * @param params.id 定向包id
 * @param params.project_id 项目id
 * @param params.search_val   定向包名称或描述
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getTargeting(params) {
  return request.get(`${REQ_PATH}/getTargeting`, {params})
}

/**
 * @desc 新增和修改定向包  字段太多
 * {Object} data
 * url: https://developers.e.kuaishou.com/docs/dsp/10.6.1
 * @returns {Promise<AxiosResponse<any>>}
 */
export function saveTargeting(data) {
  return request.post(`${REQ_PATH}/saveTargeting`, data)
}

/**
 * @desc 获取定向标签
 * {Object} data.advertiser_subject_name  广告主主体名称
 * {Object} data.advertiser_id  广告主id(和广告主主体2选一)
 * {Object} data.type
 类型
 BUSINESS_INTEREST：商业兴趣()，
 FANS_STAR：网红类别(快手网红的网红分类数据)，
 INTEREST_VIDEO：兴趣视频，
 APP_INTEREST_ID:APP 行为 (分类）
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getTargetTagsDto(data) {
  return request.post(`${REQ_PATH}/getTargetTagsDto`, data)
}

/**
 * @desc 获取app行为 (APP名称)
 * {Object} data.advertiser_subject_name  广告主主体名称 必填
 * {Object} data.app_name  app名称  必填
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getAppTarget(params) {
  return request.get(`${REQ_PATH}/getAppTarget`, {params})
}

/**
 * @desc 获取行为兴趣(意向自定义)类目词 只要 behavior_interest.behavior行为
 * {Object} data.advertiser_subject_name  广告主主体名称 必填
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getBehaviorInterest(params) {
  return request.get(`${REQ_PATH}/getBehaviorInterest`, {params})
}

/**
 * @desc 获取行为兴趣(意向)关键词
 * {Object} params.advertiser_subject_name  广告主主体名称 必填
 * {Object} params.query_str    行为兴趣关键词名称   必填
 * {Object} params.type    0:按照 query_str 模糊查询 1：按照 id 进行查询   必填
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getkeyword(params) {
  return request.get(`${REQ_PATH}/getkeyword`, {params})
}
