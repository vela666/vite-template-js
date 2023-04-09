import request from '@utils/request'

const REQ_PATH = '/ks-assets-app'

/**
 * @desc 获取快手应用列表
 * @param data.project_id 筛选项目id
 * @param data.advertiser_id 广告主id（媒体账户）
 * @param data.platform  应用类型（1：Android 应用下载，2：Android 网页游戏，3：iOS 应用下载，4：iOS 网页游戏）
 * @param data.search_key 应用名称或应用id
 * @param data.use_sdk search_key 是否接入快手广告监测SDK(0：未接入，1：已接入)
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getKsAppList(data) {
  return request.post(`${REQ_PATH}/getKsAppList`, data)
}

/**
 * @desc 新增或编辑应用
 * @param data.advertiser_id 广告主id（媒体账户）
 * @param data.app_icon_url   新增时选择的图片可访问全地址
 * @param data.app_id   应用id,编辑时传
 * @param data.app_name     应用名称
 * @param data.app_privacy_url     app 隐私政策链接(安卓类应用必填)
 * @param data.app_version      应用标记
 * @param data.image_token       应用图标的 image_token
 * @param data.package_name     应用包名,platform 为 1（Android 应用下载）必填
 * @param data.platform  应用类型（1：Android 应用下载，2：Android 网页游戏，3：iOS 应用下载，4：iOS 网页游戏）
 * @param data.url 应用下载地址
 * @param data.use_sdk search_key 是否接入快手广告监测SDK(0：未接入，1：已接入)
 * @returns {Promise<AxiosResponse<any>>}
 */
export function addOrUpdateKsApp(data) {
  return request.post(`${REQ_PATH}/addOrUpdateKsApp`, data)
}

/**
 * @desc 同步特定广告主应用
 * @param params.advertiser_id 广告主id（媒体账户）
 * @param params.company_id   公司id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function synchronizeAdvertiserApp(params) {
  return request.get(`${REQ_PATH}/synchronizeAdvertiserApp`, {params})
}

/**
 * @desc 关联系统应用
 * @param params.apply_id 快手应用id
 * @param params.app_id   系统应用id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function associateSysApply(params) {
  return request.get(`${REQ_PATH}/associateSysApply`, {params})
}
