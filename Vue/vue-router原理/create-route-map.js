export default function createRouteMap(routes,oldPathList,oldPathMap){
    let pathList = oldPathList || [];
    let pathMap = oldPathMap || Object.create(null);
    // 数组的扁平化
    routes.forEach(route => {
        // addRouteRecord 根据用户的路径 实现格式化数据
        addRouteRecord(route,pathList,pathMap);
    });
    return {
        pathList,
        pathMap
    }
}
function addRouteRecord(route,pathList,pathMap,parent){
    let path =parent? (parent.path +'/'+ route.path) :route.path
    let record = {
        path,
        component:route.component,
        // todo..
        parent // 当前路由的父路径 /about/a  => /about => undefined
    }
    if(!pathMap[path]){
        pathList.push(path);
        pathMap[path] = record;
    }
    if(route.children){
        route.children.forEach(route=>{
            addRouteRecord(route,pathList,pathMap,record)
        })
    }
}