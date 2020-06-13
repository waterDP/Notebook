import {
  observable,
  isArrayLike, 
  computed, 
  autorun, 
  when, 
  reaction,
  action,
  runInAction
} from 'mobx'

const arr = observable(['a', 'b', 'c'])

console.log(isArrayLike(arr))  // true

const obj = observable({a: 1, b: 1})

// extendObservable()

let num = observable.box(20)
let str = observable.box('hello')
let bool = observable.box(true)

num.get()
num.set(12)

// 修饰器
class Store {
  @observable array = []
  @observable obj = {}
  @observable map = new Map()

  @observable string = 'hello'
  @observable number = 20
  @observable bool = false

  @computed get mixed() {
    return this.string + '/' + this.number
  }

  @action.bound bar() {
    this.string = 'world'
    this.number = 30
  }
}

runInAction('modify', () => {
  store.string = 'world'
  store.number = 4
})


// ! computed
let store = new Store()
let foo = computed(() => (store.string + '/' + store.number))
foo.observe(change => {
  console.log(change)
})
console.log(foo)

// ! autorun
autorun(() => {
  console.log(store.string + '/' + store.number)
})

// ! when
when(() => store.bool, () => console.log("It's true"))

// ! reaction
reaction(() => [store.string, store.number], arr => console.log(arr.join('/')))