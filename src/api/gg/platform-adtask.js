import request from '@/utils/request'
import axios from 'axios'

const REQ_PATH = '/gg-create-ad-task'

/**
 * @description 获取当前用户创建的定时任务列表
 * @param {Object}
 * {
 *   "advertiser_id": "", 账户id
 *   "page": 1, 当前页,示例值(1)
 *   "page_size": 20, 页面大小,示例值(20)
 *   "project_id": "" 项目id
 * }
 * @return {Promise}
 */
export function getSubmitTaskList(data) {
  return request.post(`${REQ_PATH}/getSubmitTaskList`, data)
}

// 获取任务详情  params.task_id  任务id
export function getTaskDetails(params) {
  return request.get(`${REQ_PATH}/getTaskDetails`, { params })
}

/**
 * @description 单个或批量取消提交定时任务
 * @param {Object}
 * {
 *   "index_list": [  定位下标集合
 *     {
 *       "ad_index": "",  广告下标
 *       "adset_index": "", 广告组下标
 *       "campaign_index": "" 广告系列下标
 *     }
 *   ],
 *   "task_id": ""  task_id
 * }
 * @return {Promise}
 */
export function cancelSubmitTask(data) {
  return request.post(`${REQ_PATH}/cancelSubmitTask`, data)
}

// 查看任务审核状态  params.task_id
export function checkTaskStatus(params) {
  return request.get(`${REQ_PATH}/checkTaskStatus`, { params })
}

/**
 * @description 删除定时任务
 * @param {Object}
 * {
 *    "ad_index": "",  广告下标
 *    "adset_index": "", 广告组下标
 *    "campaign_index": "" 广告系列下标
 *    "task_id": "" 任务id
 * }
 * @return {Promise}
 */
export function delSubmitTask(params) {
  return request.get(`${REQ_PATH}/delSubmitTask`, { params })
}
