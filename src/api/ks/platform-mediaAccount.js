import request from '@utils/request'
import axios from "axios";

const REQ_PATH = '/ks-account-manager'

/**
 * @description 根据条件分页查询快手媒体账户
 * @param {String} data.advertiser_alias     - 搜索的账户昵称
 * @param {String} data.advertiser_id     - 账户id
 * @param {String} data.belong_apply_id     - 所属应用id
 * @param {String} data.belong_project_id       -  项目id
 * @param {String} data.order_by       -  根据哪个字段排序
 * @param {String} data.order_type         -  排序方式:降序DESC 升序ASC
 * @param {String} data.page           - 页码
 * @param {String} data.page_size       - 一页展示的数量
 * @param {String} data.show_fields         - 自定义指标
 * @param {String} data.stat_date           - 查询报表开始时间
 * @param {String} data.end_date           - 查询报表结束时间
 * @return {Promise}
 */
export function getMediaAccountListByPage(data) {
  return request.post(`${REQ_PATH}/getMediaAccountListByPage`, data);
}

/**
 * @description 单个或者批量修改快手媒体账户预算
 * @param {String} data.advertiser_alias     - 广告账户别名
 * @param {String} data.advertiser_id     - 账号id
 * @param {String} data.day_budget
 * 单日预算金额（广告组单日预算金额，单位：厘，指定 0 表示预算不限，默认为 0；不小于 500 元，不超过 100000000 元，
 * 仅支持输入数字；修改预算不得低于该广告组当日花费的 120%）
 * @param {String} data.day_budget_schedule
 * 分日预算（单位：厘，指定 0 表示预算不限，默认为 0；每天不小于 500 元，不超过 100000000 元，
 * 仅支持输入数字；修改预算不得低于该账户当日花费的 120%，与 day_budget 不能同时传）
 * @return {Promise}
 */
export function updateMediaAccountBudget(data) {
  return request.post(`${REQ_PATH}/updateMediaAccountBudget`, data);
}
