import {
  nodeOps,
  serializeInner,
  render,
  h,
  Teleport,
  Text,
  ref,
  nextTick,
  markRaw
} from '@vue/runtime-test'
import { createVNode, Fragment } from '../../src/vnode'
import { compile } from 'vue'

describe('renderer: teleport', () => {
  test('should work', () => {
    const target = nodeOps.createElement('div')
    const root = nodeOps.createElement('div')

    render(
      h(() => [
        h(Teleport, { to: target }, h('div', 'teleported')),
        h('div', 'root')
      ]),
      root
    )

    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )
  })

  test('should update target', async () => {
    const targetA = nodeOps.createElement('div')
    const targetB = nodeOps.createElement('div')
    const target = ref(targetA)
    const root = nodeOps.createElement('div')

    render(
      h(() => [
        h(Teleport, { to: target.value }, h('div', 'teleported')),
        h('div', 'root')
      ]),
      root
    )

    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(targetA)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )
    expect(serializeInner(targetB)).toMatchInlineSnapshot(`""`)

    target.value = targetB
    await nextTick()

    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(targetA)).toMatchInlineSnapshot(`""`)
    expect(serializeInner(targetB)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )
  })

  test('should update children', async () => {
    const target = nodeOps.createElement('div')
    const root = nodeOps.createElement('div')
    const children = ref([h('div', 'teleported')])

    render(h(Teleport, { to: target }, children.value), root)
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )

    children.value = []
    await nextTick()

    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )

    children.value = [createVNode(Text, null, 'teleported')]
    await nextTick()

    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )
  })

  test('should remove children when unmounted', () => {
    const target = nodeOps.createElement('div')
    const root = nodeOps.createElement('div')

    render(
      h(() => [
        h(Teleport, { to: target }, h('div', 'teleported')),
        h('div', 'root')
      ]),
      root
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )

    render(null, root)
    expect(serializeInner(target)).toBe('')
  })

  test('multiple teleport with same target', () => {
    const target = nodeOps.createElement('div')
    const root = nodeOps.createElement('div')

    render(
      h('div', [
        h(Teleport, { to: target }, h('div', 'one')),
        h(Teleport, { to: target }, 'two')
      ]),
      root
    )

    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<div><!--teleport start--><!--teleport end--><!--teleport start--><!--teleport end--></div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(`"<div>one</div>two"`)

    // update existing content
    render(
      h('div', [
        h(Teleport, { to: target }, [h('div', 'one'), h('div', 'two')]),
        h(Teleport, { to: target }, 'three')
      ]),
      root
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>one</div><div>two</div>three"`
    )

    // toggling
    render(h('div', [null, h(Teleport, { to: target }, 'three')]), root)
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<div><!----><!--teleport start--><!--teleport end--></div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(`"three"`)

    // toggle back
    render(
      h('div', [
        h(Teleport, { to: target }, [h('div', 'one'), h('div', 'two')]),
        h(Teleport, { to: target }, 'three')
      ]),
      root
    )
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<div><!--teleport start--><!--teleport end--><!--teleport start--><!--teleport end--></div>"`
    )
    // should append
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"three<div>one</div><div>two</div>"`
    )

    // toggle the other teleport
    render(
      h('div', [
        h(Teleport, { to: target }, [h('div', 'one'), h('div', 'two')]),
        null
      ]),
      root
    )
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<div><!--teleport start--><!--teleport end--><!----></div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>one</div><div>two</div>"`
    )
  })

  test('should work when using template ref as target', async () => {
    const root = nodeOps.createElement('div')
    const target = ref(null)
    const disabled = ref(true)

    const App = {
      setup() {
        return () =>
          h(Fragment, [
            h('div', { ref: target }),
            h(
              Teleport,
              { to: target.value, disabled: disabled.value },
              h('div', 'teleported')
            )
          ])
      }
    }
    render(h(App), root)
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<div></div><!--teleport start--><div>teleported</div><!--teleport end-->"`
    )

    disabled.value = false
    await nextTick()
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<div><div>teleported</div></div><!--teleport start--><!--teleport end-->"`
    )
  })

  test('disabled', () => {
    const target = nodeOps.createElement('div')
    const root = nodeOps.createElement('div')

    const renderWithDisabled = (disabled: boolean) => {
      return h(Fragment, [
        h(Teleport, { to: target, disabled }, h('div', 'teleported')),
        h('div', 'root')
      ])
    }

    render(renderWithDisabled(false), root)
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )

    render(renderWithDisabled(true), root)
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><div>teleported</div><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toBe(``)

    // toggle back
    render(renderWithDisabled(false), root)
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )
  })

  test('moving teleport while enabled', () => {
    const target = nodeOps.createElement('div')
    const root = nodeOps.createElement('div')

    render(
      h(Fragment, [
        h(Teleport, { to: target }, h('div', 'teleported')),
        h('div', 'root')
      ]),
      root
    )
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )

    render(
      h(Fragment, [
        h('div', 'root'),
        h(Teleport, { to: target }, h('div', 'teleported'))
      ]),
      root
    )
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<div>root</div><!--teleport start--><!--teleport end-->"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )

    render(
      h(Fragment, [
        h(Teleport, { to: target }, h('div', 'teleported')),
        h('div', 'root')
      ]),
      root
    )
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div>"`
    )
  })

  test('moving teleport while disabled', () => {
    const target = nodeOps.createElement('div')
    const root = nodeOps.createElement('div')

    render(
      h(Fragment, [
        h(Teleport, { to: target, disabled: true }, h('div', 'teleported')),
        h('div', 'root')
      ]),
      root
    )
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><div>teleported</div><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toBe('')

    render(
      h(Fragment, [
        h('div', 'root'),
        h(Teleport, { to: target, disabled: true }, h('div', 'teleported'))
      ]),
      root
    )
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<div>root</div><!--teleport start--><div>teleported</div><!--teleport end-->"`
    )
    expect(serializeInner(target)).toBe('')

    render(
      h(Fragment, [
        h(Teleport, { to: target, disabled: true }, h('div', 'teleported')),
        h('div', 'root')
      ]),
      root
    )
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><div>teleported</div><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toBe('')
  })

  test('should work with block tree', async () => {
    const target = nodeOps.createElement('div')
    const root = nodeOps.createElement('div')
    const disabled = ref(false)

    const App = {
      setup() {
        return {
          target: markRaw(target),
          disabled
        }
      },
      render: compile(`
      <teleport :to="target" :disabled="disabled">
        <div>teleported</div><span>{{ disabled }}</span><span v-if="disabled"/>
      </teleport>
      <div>root</div>
      `)
    }
    render(h(App), root)
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div><span>false</span><!--v-if-->"`
    )

    disabled.value = true
    await nextTick()
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><div>teleported</div><span>true</span><span></span><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toBe(``)

    // toggle back
    disabled.value = false
    await nextTick()
    expect(serializeInner(root)).toMatchInlineSnapshot(
      `"<!--teleport start--><!--teleport end--><div>root</div>"`
    )
    expect(serializeInner(target)).toMatchInlineSnapshot(
      `"<div>teleported</div><span>false</span><!--v-if-->"`
    )
  })
})
