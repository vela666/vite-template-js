import request from '@utils/request'

const ACCOUNT_INFO = '/ks-account-info'
const ACCOUNT_MANAGER = '/ks-account-manager'
const AD_MANAGE = '/ks-account-manager'

/**
 * @desc 获取当前公司账号主体列表 只包含主体名称
 * @param params.project_id   项目id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getSubjectNameList(params) {
  return request.get(`${ACCOUNT_INFO}/getSubjectNameList`, {params})
}

/**
 * @desc 获取用户管理的所有媒体账户 包含主体等
 * @param params.project_id   项目id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getAllAccountByUser(params) {
  return request.get(`${ACCOUNT_INFO}/getAllAccountByUser`, {params})
}

/**
 * @desc 根据广告类型获取缓存时间
 * @param params.ad_type     广告类型（1广告组2广告计划）
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getKsAdCacheTime(params) {
  return request.get(`${ACCOUNT_MANAGER}/getKsAdCacheTime`, {params})
}

/*
* @desc 获取广告组或计划数据 图表那些
* @param {string} data.stat_date 查询报表开始时间
* @param {string} data.end_date 查询报表结束时间
* @param {string} data.unit_id 广告组id,获取广告组详情或数据时必传
* @param {string} data.advertiser_id	 广告主id
* @param {string} data.campaign_id		广告计划id,获取广告计划详情或数据时必传
* @param {Array} data.day_show_fields		 分日指标,获取分日数据必传(图表的指标)
* @param {Array} data.show_fields	 自定义指标(表格的指标)
*
*/
export function getAdData(data) {
  return request.post(`${AD_MANAGE}/getAdData`, data)
}
