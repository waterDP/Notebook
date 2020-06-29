import createRouteMap from './create-route-map'
import { createRoute } from './history/base'
export default function createMatcher(routes) {
	// 将数据扁平化处理
	// pathList 表示所有的路径的集合 [/ /about /about/a /about/b]
	// pathMap {/:record,/about:record,/about/a:record}
	let { pathList, pathMap } = createRouteMap(routes);

	function addRoutes(routes) {
		createRouteMap(routes, pathList, pathMap);
	}
	function match(location) { // 匹配对应记录的
		let record = pathMap[location] // /about/a  => [record,record]

		return createRoute(record, { // {matched:[/about,/about/a],path:'/about/a'}
			path: location
		})
	}
	return {
		addRoutes,
		match
	}
}