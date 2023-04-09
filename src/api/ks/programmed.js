import request from '@/utils/request'

const ASSETS_MATERIAL = 'ks-assets-material'
const KS_PROGRAMMATIC_CREATE = 'ks-programmatic-create'
const KS_CREATE_AD_TASK = 'ks-create-ad-task'

// 根据素材资产获取快手平台素材id
export function getKsMaterialIdByAssetsId(params) {
  return request.get(`${ASSETS_MATERIAL}/getKsMaterialIdByAssetsId`, {params})
}

// 获取可选的推荐封面
export function getKsVideoCover(params) {
  return request.get(`${ASSETS_MATERIAL}/getKsVideoCover`, {params})
}

// 快手封面图片上传到快手平台
export function getKsMaterialIdByImageUrL(params) {
  return request.get(`${ASSETS_MATERIAL}/getKsMaterialIdByImageUrL`, {params})
}

// 获取可选的封面贴纸样式
export function getCreativeWordStyles(params) {
  return request.get(`${KS_PROGRAMMATIC_CREATE}/getCreativeWordStyles`, {params})
}

// 获取可选的应用版本
export function getOptionalAppList(params) {
  return request.get(`${KS_PROGRAMMATIC_CREATE}/getOptionalAppList`, {params})
}

// 获取快手监测链接列表
export function getKsMonitorListPage(params) {
  return request.get('ks-assets-monitor/getKsMonitorListPage', {params})
}

// 获取快手创意分类
export function getKsCreativeCategoryList(params) {
  return request.get(`${KS_PROGRAMMATIC_CREATE}/getKsCreativeCategoryList`, {params})
}

// 获取快手可选的深度转化目标
export function getKsDeepConvertList(data) {
  return request.post(`${KS_PROGRAMMATIC_CREATE}/getKsDeepConvertList`, data)
}

// 获取行动号召按钮
export function getCreativeActionBarTextList(params) {
  return request.get(`${KS_PROGRAMMATIC_CREATE}/getCreativeActionBarTextList`, {params})
}

// 获取快手魔力建站落地页列表
export function getKsLpPageList(params) {
  return request.get(`${KS_PROGRAMMATIC_CREATE}/getKsLpPageList`, {params})
}

// 分页获取定向包列表
export function getTargeting(params) {
  return request.get('ks-assets-targeting/getTargeting', {params})
}

// 查看审核状态
export function checkReviewStatus(params) {
  return request.get(`${KS_PROGRAMMATIC_CREATE}/checkReviewStatus`, {params})
}

// 快手程序化创建广告
export function programmaticCreateAd(data) {
  return request.post(`${KS_PROGRAMMATIC_CREATE}/programmaticCreateAd`, data)
}

// 提交创建广告定时任务
export function submitCreateAdTask(data) {
  return request.post(`${KS_CREATE_AD_TASK}/submitCreateAdTask`, data)
}

// 定向包内资产预处理
export function handleTargetTags(data) {
  return request.post(`${KS_PROGRAMMATIC_CREATE}/handleTargetTags`, data)
}

/**
 * @description 获取当前用户创建的定时任务列表
 * @param {String} params.page     - 广告计划下标
 * @param {String} params.page_size     - 任务id
 * @param {String} params.project_id       - 项目id
 * @param {String} params.advertiser_id       - 广告主id
 * @return {Promise}
 */
export function getSubmitTaskList(params) {
  return request.get(`${KS_CREATE_AD_TASK}/getSubmitTaskList`, {params})
}

// 查看任务审核状态
// params.task_id 任务id
export function checkTaskStatus(params) {
  return request.get(`${KS_CREATE_AD_TASK}/checkTaskStatus`, {params})
}

/**
 * @description 删除定时任务
 * @param {String} params.campaign_index     - 广告计划下标
 * @param {String} params.task_id     - 任务id
 * @param {String} params.unit_index     - 广告组下标
 * @return {Promise}
 */
export function delSubmitTask(params) {
  return request.get(`${KS_CREATE_AD_TASK}/delSubmitTask`, {params})
}

/**
 * @description 单个或批量取消提交定时任务
 * @param {String} data.index_list     - 定位下标集合
 * @param {String} data.index_list.campaign_index     - 广告计划定位下标
 * @param {String} data.index_list.unit_index       - 广告组定位下标
 * @param {String} data.task_id     - 任务id
 * @return {Promise}
 */
export function cancelSubmitTask(data) {
  return request.post(`${KS_CREATE_AD_TASK}/cancelSubmitTask`, data)
}

// 获取任务详情  params.task_id     - 任务id
export function getTaskDetails(params) {
  return request.get(`${KS_CREATE_AD_TASK}/getTaskDetails`, {params})
}
