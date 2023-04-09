/**
 * *************************************************
 * @file 谷歌程序化创建相关接口
 * @author fengsi<294068744@qq.com>
 * @date 2022-03-18 15:15:57
 * @since 3.5.0
 * *************************************************
 **/

import request from '@/utils/request'

const API = {
  GET_MEDIA_ACCOUNT_BY_PROJECT_ID:
    '/gg-programmatic-create/getMediaAccountByProjectId', // 据项目ID，获取广告账户
  GET_GEO_TARGET: '/gg-programmatic-create/getGeoTarget', // 获取地理位置信息
  GET_LANGUAGE: '/gg-programmatic-create/getLanguage', // 获取语言信息
  GET_CONVERSION_ACTION: '/gg-programmatic-create/getConversionAction', // 获取账户转化跟踪信息
  GET_CAMPAIGN_LIST: '/gg-programmatic-create/getCampaignList', // 获取广告系列数据
  SUBMIT_CREATE_AD_TASK: '/gg-create-ad-task/submitCreateAdTask', // 提交创建广告定时任务
  PROGRAMMATIC_CREATE_AD: '/gg-programmatic-create/programmaticCreateAd', // 程序化创建广告
  CHECK_REVIEW_STATUS: '/gg-programmatic-create/checkReviewStatus', // 查看审核状态
}

/**
 * @description 查看审核状态
 * @param {Object} data
 * @param {String} data.batch_id - 	批次id
 * @author fengjin
 * @date 2022-04-13 19:46:37
 */
export function checkReviewStatus(params) {
  return request.get(API.CHECK_REVIEW_STATUS, {
    params,
  })
}

/**
 * @description 程序化创建广告
 * @author fengjin
 * @date 2022-04-13 14:53:36
 */
export function programmaticCreateAd(data) {
  return request.post(API.PROGRAMMATIC_CREATE_AD, data)
}

/**
 * @description 提交创建广告定时任务
 * @author fengjin
 * @date 2022-04-12 20:24:33
 */
export function submitCreateAdTask(data) {
  return request.post(API.SUBMIT_CREATE_AD_TASK, data)
}

/**
 * @description 获取广告系列数据
 * @param {Object} data
 * @param {String} data.belong_advertiser_id - 筛选账户id
 * @param {String} data.belong_apply_id - 筛选应用产品id
 * @param {String} data.belong_project_id - 筛选项目id
 * @param {String} data.search_val - 支持按广告系列名称或ID进行搜索
 * @param {String} data.status - 广告系列状态: 启用ACTIVE 暂停INACTIVE
 * @author fengjin
 * @date 2022-04-07 11:47:29
 */
export function getCampaignList(data) {
  return request.post(API.GET_CAMPAIGN_LIST, data)
}

/**
 * @description 获取账户转化跟踪信息
 * @param {Object} data
 * @param {Array} data.advertiser_ids - 账户id
 * @param {String} data.apply_id - 方投系统应用ID
 * @author fengsi<294068744@qq.com>
 * @date 2022-03-18 18:00:38
 */
export function getConversionAction(data) {
  return request.post(API.GET_CONVERSION_ACTION, data)
}

/**
 * @description 获取语言信息
 * @author fengsi<294068744@qq.com>
 * @date 2022-03-18 17:02:49
 */
export function getLanguage() {
  return request.get(API.GET_LANGUAGE)
}

/**
 * @description 获取地理位置信息
 * @param {Object} params
 * @param {String} params.keyword - 关键字
 * @author fengsi<294068744@qq.com>
 * @date 2022-03-18 17:01:27
 */
export function getGeoTarget(params) {
  return request.get(API.GET_GEO_TARGET, {
    params,
  })
}

/**
 * @description
 * @param {Object} params
 * @param {String} params.project_id
 * @author fengsi<294068744@qq.com>
 * @date 2022-03-18 16:02:40
 */
export function getMediaAccountByProjectId(params) {
  return request.get(API.GET_MEDIA_ACCOUNT_BY_PROJECT_ID, {
    params,
  })
}
