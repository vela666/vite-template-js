import request from '@utils/request'

const REQ_PATH = '/ks-assets-material'

/**
 * @desc 根据素材资产获取快手平台素材id 应用管理新增或编辑时 获取应用图标token会用到
 * @param params.advertiser_id   广告主(账户)id
 * @param params.ks_user_id 快手用户id
 * @param params.material_id  素材资产id
 * @param params.type 默认为 0。
 * 1：上传 app_icon图片；
 * 2：广告组设置中 scene_id 为 7 时的封面图片；
 * 5：联盟图片素材；
 * 6：横版图片；
 * 7：小图（组图与小图对于格式要求一致，只不过组图传三个）；
 * 8：开屏图片-720 1280；
 * 9：开屏图片-750 1334；
 * 10：开屏图片-1080 1920；
 * 11：开屏图片-1080 2160；
 * 12：开屏图片-1080 2280；
 * 13：开屏图片-1080 2340；
 * 高级创意图片：100:图片卡片 ；
 * 101:多利益卡-图文 ；
 * 102：多利益卡-多标签 ；
 * 103：电商促销样式。 要求:1.图片宽度不能小于 228 像素，高度不能小于 150 像素、2.图片宽高比为 1.52:1/只支持 png/jpeg/jpg 格式、3.图片不能大于 2M
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getKsMaterialIdByAssetsId(params) {
  return request.get(`${REQ_PATH}/getKsMaterialIdByAssetsId`, {params})
}

/**
 * @desc 获取可选的推荐封面
 * @param params.advertiser_id 广告主id（媒体账户）
 * @param params.image_url	   封面图片地址
 * @param params.ks_user_id   快手用户id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getKsMaterialIdByImageUrL(params) {
  return request.get(`${REQ_PATH}/getKsMaterialIdByImageUrL`, {params})
}

/**
 * @desc 获取可选的推荐封面
 * @param params.advertiser_id 广告主id（媒体账户）
 * @param params.material_assets_id	   素材资产id
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getKsVideoCover(params) {
  return request.get(`${REQ_PATH}/getKsVideoCover`, {params})
}
