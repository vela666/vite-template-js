import SvgIcon from '@/components/SvgIcon'

export default function globalProperties(app) {
  const req = require.context('@/icons/svg', false, /\.svg$/)
  const requireAll = (requireContext) =>
    requireContext.keys().map(requireContext)
  requireAll(req)
  app.component('svg-icon', SvgIcon)
}
