import {Container} from './'

let container = new Container()
const point = {x:10, y: 10}
class BasicClass{}

container.addProvider({provide: BasicClass, useClass: BasicClass})

console.log(container.providers) 