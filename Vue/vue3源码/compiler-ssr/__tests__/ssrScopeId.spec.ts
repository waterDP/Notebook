import { compile } from '../src'

const scopeId = 'data-v-xxxxxxx'

describe('ssr: scopeId', () => {
  test('basic', () => {
    expect(
      compile(`<div><span>hello</span></div>`, {
        scopeId,
        mode: 'module'
      }).code
    ).toMatchInlineSnapshot(`
      "import { withScopeId as _withScopeId } from \\"vue\\"
      import { ssrRenderAttrs as _ssrRenderAttrs } from \\"@vue/server-renderer\\"
      const _withId = /*#__PURE__*/_withScopeId(\\"data-v-xxxxxxx\\")

      export const ssrRender = /*#__PURE__*/_withId(function ssrRender(_ctx, _push, _parent, _attrs) {
        _push(\`<div\${_ssrRenderAttrs(_attrs)} data-v-xxxxxxx><span data-v-xxxxxxx>hello</span></div>\`)
      })"
    `)
  })

  test('inside slots (only text)', () => {
    // should have no branching inside slot
    expect(
      compile(`<foo>foo</foo>`, {
        scopeId,
        mode: 'module'
      }).code
    ).toMatchInlineSnapshot(`
      "import { resolveComponent as _resolveComponent, withCtx as _withCtx, createTextVNode as _createTextVNode, withScopeId as _withScopeId } from \\"vue\\"
      import { ssrRenderComponent as _ssrRenderComponent } from \\"@vue/server-renderer\\"
      const _withId = /*#__PURE__*/_withScopeId(\\"data-v-xxxxxxx\\")

      export const ssrRender = /*#__PURE__*/_withId(function ssrRender(_ctx, _push, _parent, _attrs) {
        const _component_foo = _resolveComponent(\\"foo\\")

        _push(_ssrRenderComponent(_component_foo, _attrs, {
          default: _withId((_, _push, _parent, _scopeId) => {
            if (_push) {
              _push(\`foo\`)
            } else {
              return [
                _createTextVNode(\\"foo\\")
              ]
            }
          }),
          _: 1
        }, _parent))
      })"
    `)
  })

  test('inside slots (with elements)', () => {
    expect(
      compile(`<foo><span>hello</span></foo>`, {
        scopeId,
        mode: 'module'
      }).code
    ).toMatchInlineSnapshot(`
      "import { resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, withScopeId as _withScopeId } from \\"vue\\"
      import { ssrRenderComponent as _ssrRenderComponent } from \\"@vue/server-renderer\\"
      const _withId = /*#__PURE__*/_withScopeId(\\"data-v-xxxxxxx\\")

      export const ssrRender = /*#__PURE__*/_withId(function ssrRender(_ctx, _push, _parent, _attrs) {
        const _component_foo = _resolveComponent(\\"foo\\")

        _push(_ssrRenderComponent(_component_foo, _attrs, {
          default: _withId((_, _push, _parent, _scopeId) => {
            if (_push) {
              _push(\`<span data-v-xxxxxxx\${_scopeId}>hello</span>\`)
            } else {
              return [
                _createVNode(\\"span\\", null, \\"hello\\")
              ]
            }
          }),
          _: 1
        }, _parent))
      })"
    `)
  })

  test('nested slots', () => {
    expect(
      compile(`<foo><span>hello</span><bar><span/></bar></foo>`, {
        scopeId,
        mode: 'module'
      }).code
    ).toMatchInlineSnapshot(`
      "import { resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, withScopeId as _withScopeId } from \\"vue\\"
      import { ssrRenderComponent as _ssrRenderComponent } from \\"@vue/server-renderer\\"
      const _withId = /*#__PURE__*/_withScopeId(\\"data-v-xxxxxxx\\")

      export const ssrRender = /*#__PURE__*/_withId(function ssrRender(_ctx, _push, _parent, _attrs) {
        const _component_foo = _resolveComponent(\\"foo\\")
        const _component_bar = _resolveComponent(\\"bar\\")

        _push(_ssrRenderComponent(_component_foo, _attrs, {
          default: _withId((_, _push, _parent, _scopeId) => {
            if (_push) {
              _push(\`<span data-v-xxxxxxx\${_scopeId}>hello</span>\`)
              _push(_ssrRenderComponent(_component_bar, null, {
                default: _withId((_, _push, _parent, _scopeId) => {
                  if (_push) {
                    _push(\`<span data-v-xxxxxxx\${_scopeId}></span>\`)
                  } else {
                    return [
                      _createVNode(\\"span\\")
                    ]
                  }
                }),
                _: 1
              }, _parent))
            } else {
              return [
                _createVNode(\\"span\\", null, \\"hello\\"),
                _createVNode(_component_bar, null, {
                  default: _withId(() => [
                    _createVNode(\\"span\\")
                  ]),
                  _: 1
                })
              ]
            }
          }),
          _: 1
        }, _parent))
      })"
    `)
  })
})
