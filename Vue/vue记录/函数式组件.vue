// todo 方案一
<template functional>
  <div class="book">
    {{props.book.name}} {{props.book.price}}
  </div>
</template>

// todo 方案二
<script>
Vue.component('book', {
  functional: true,
  props: {
    book: {
      type: () => ({}),
      required: true
    }
  },
  render(createElement, context) {
    return createElement(
      'div',
      {
        attrs: {
          class: 'book'
        }
      },
      [context.props.book]
    )
  }
})
</script>
