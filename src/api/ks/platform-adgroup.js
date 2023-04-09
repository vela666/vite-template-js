import request from '@utils/request'
import axios from "axios";

const REQ_PATH = '/ks-account-manager'

/**
 * @description 根据条件分页查询快手广告组列表
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
 * @param {String} data.unit_id_or_name             - 广告组ID或名称
 * @return {Promise}
 */
export function getAdUnitListByPage(data) {
  return request.post(`${REQ_PATH}/getAdUnitListByPage`, data);
}

/**
 * @description 单个或者批量修改快手广告组出价
 * @param {String} data.advertiser_id     - 广告主id
 * @param {String} data.bid       - 出价(bid_type 为 CPC/eCPC/CPM 时该字段必填)
 * @param {String} data.bid_type       - 出价类型(1：CPM，2：CPC，6：OCPC(使用 OCPC 代表 OCPX)，10：OCPM，20：eCPC)
 * @param {String} data.cpa_bid       - bid_type 是 OCPM 时该字段必填
 * @param {String} data.scene_id       - 资源位置
 * @param {String} data.show_mode         - 创意展现方式
 * @param {String} data.speed         - 投放方式
 * @param {String} data.target         - 定向数据
 * @param {String} data.unit_id  - 广告组id
 * @param {String} data.unit_name - 广告组名称
 * @return {Promise}
 */
export function updateAdUnitBid(data) {
  return request.post(`${REQ_PATH}/updateAdUnitBid`, data);
}

/**
 * @description 单个或者批量修改广告组预算
 * @param {Array} data
 * @param {String} data.advertiser_id       - 广告主id
 * @param {String} data.day_budget
 * 广告组单日预算金额，单位：厘，指定 0 表示预算不限，默认为 0；
 * 不小于 100 元，不超过 100000000 元，仅支持输入数字；修改预算不得低于该广告组当日花费的 120%
 * @param {String} data.day_budget_schedule
 * 单位：厘，指定 0 表示预算不限，默认为 0；
 * 每天不小于 500 元，不超过 100000000 元，仅支持输入数字；
 * 修改预算不得低于该计划当日花费的 120%，与 day_budget 不能同时传，均不能低于该计划下任一广告组出价
 * @param {String} data.unit_id - 广告组id
 * @param {String} data.unit_name   - 广告组名称
 * @return {Promise}
 */
export function updateAdUnitBudget(data) {
  return request.post(`${REQ_PATH}/updateAdUnitBudget`, data);
}

/**
 * @description 单个或者批量修改广告组状态
 * @param {Array} data
 * @param {String} data.advertiser_id     - 广告主id
 * @param {String} data.put_status      - 广告组投放状态(1：投放中；2：暂停)
 * @param {String} data.unit_id  - 广告组id
 * @param {String} data.unit_name - 广告组名称
 * @return {Promise}
 */
export function updateAdUnitStatus(data) {
  return request.post(`${REQ_PATH}/updateAdUnitStatus`, data);
}

/**
 * @description 根据条件获取广告组详情
 * @param {Array} data
 * @param {String} data.advertiser_id	     - 广告主id
 * @param {String} data.campaign_id       - 广告计划id
 * @param {String} data.stat_date       - 查询报表开始时间
 * @param {String} data.end_date       - 查询报表结束时间
 * @param {String} data.show_fields       - 自定义指标
 * @param {String} data.unit_id       - 广告组id
 * @return {Promise}
 */
export function getUnitDetail(data) {
  return request.post(`${REQ_PATH}/getUnitDetail`, data);
}
