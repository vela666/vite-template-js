import request from '@utils/request'
import axios from "axios";

const REQ_PATH = '/ks-account-manager'

/**
 * @description 根据条件分页查询快手广告计划列表
 * @param {String} data.advertiser_id     - 账户id
 * @param {String} data.belong_apply_id     - 所属应用id
 * @param {String} data.belong_project_id       -  项目id
 * @param {String} data.campaign_id_or_name       -  广告计划ID或名称
 * @param {String} data.order_by       -  根据哪个字段排序
 * @param {String} data.order_type         -  排序方式:降序DESC 升序ASC
 * @param {String} data.page           - 页码
 * @param {String} data.page_size       - 一页展示的数量
 * @param {String} data.show_fields           - 自定义指标
 * @param {String} data.stat_date           - 查询报表开始时间
 * @param {String} data.end_date             - 查询报表结束时间
 * @param {String} data.status             - 广告组状态
 * @return {Promise}
 */
export function getCampaignListByPage(data) {
  return request.post(`${REQ_PATH}/getCampaignListByPage`, data);
}

/**
 * @description 单个或者批量修改快手广告计划预算
 * @param {Array} data
 * @param {String} data.advertiser_id     - 广告主id
 * @param {String} data.campaign_id       - 广告计划id
 * @param {String} data.campaign_name     - 广告计划名称
 * @param {String} data.day_budget
 * 单日预算金额(单位：厘，指定 0 表示预算不限，默认为 0；不小于 500 元，不超过 100000000 元，
 * 仅支持输入数字；修改预算不得低于该账户当日花费的 120%，与 day_budget_schedule 不能同时传)
 * @param {String} data.day_budget_schedule
 * 分日预算(单位：厘，指定 0 表示预算不限，默认为 0；每天不小于 500 元，不超过 100000000 元，
 * 仅支持输入数字；修改预算不得低于该计划当日花费的 120%，与 day_budget 不能同时传，均不能低于该计划下任一广告组出价)
 * @return {Promise}
 */
export function updateCampaignBudget(data) {
  return request.post(`${REQ_PATH}/updateCampaignBudget`, data);
}

/**
 * @description 单个或者批量修改广告计划状态
 * @param {Array} data
 * @param {String} data.advertiser_id     - 广告主id
 * @param {String} data.campaign_id       - 广告计划id
 * @param {String} data.campaign_name       - 广告计划名称
 * @param {String} data.put_status       - 投放状态(1：投放中；2：暂停)
 * @return {Promise}
 */
export function updateCampaignStatus(data) {
  return request.post(`${REQ_PATH}/updateCampaignStatus`, data);
}

/**
 * @description 根据条件获取广告计划详情
 * @param {Array} data
 * @param {String} data.advertiser_id     - 广告主id
 * @param {String} data.campaign_id       - 广告计划id
 * @param {String} data.stat_date       - 查询报表开始时间
 * @param {String} data.end_date       - 查询报表结束时间
 * @param {String} data.show_fields       - 自定义指标
 * @return {Promise}
 */
export function getCampaignDetail(data) {
  return request.post(`${REQ_PATH}/getCampaignDetail`, data);
}
