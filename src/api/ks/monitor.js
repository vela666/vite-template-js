import request from '@utils/request'
import qs from "qs";

const REQ_PATH = '/ks-assets-monitor'

/**
 * @desc 分页获取快手监测链接列表
 * @param params.page   当前页,示例值(1)
 * @param params.page_size   页面大小,示例值(20)
 * @param params.apply_id   应用id
 * @param params.monitor_name     监测名称
 * @param params.project_id     项目id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getKsMonitorListPage(params) {
  return request.get(`${REQ_PATH}/getKsMonitorListPage`, {params})
}

/**
 * @desc 快手监测导入
 * @param data.apply_id 应用id
 * @param data.project_id   项目id
 * @param data.file  formData
 * @returns {Promise<AxiosResponse<any>>}
 */
export function addKsMonitorByFile(data) {
  return request.post(`${REQ_PATH}/addKsMonitorByFile`, data)
}

/**
 * @desc 新增或修改快手监测链接
 * @param data.actionbar_click_url 点击按钮监测链接
 * @param data.ad_photo_played_t3s_url     有效播放监测链接
 * @param data.apply_id       应用id
 * @param data.click_track_url       点击监测链接
 * @param data.impression_url         开始播放监测链接
 * @param data.monitor_id        活动监测id
 * @param data.monitor_name         活动监测名称
 * @param data.project_id     项目id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function addOrUpdateKsMonitor(data) {
  return request.post(`${REQ_PATH}/addOrUpdateKsMonitor`, data)
}

/**
 * @desc 批量删除快手监测链接
 * @param params.monitor_id_list  监控链接id列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export function delKsMonitor(params) {
  return request.delete(`${REQ_PATH}/delKsMonitor`, {
    params,
    //  序列化参数 数组 不然请求失败
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  });
}
