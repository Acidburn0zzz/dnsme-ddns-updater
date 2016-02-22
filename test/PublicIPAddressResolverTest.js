import assert from 'assert'
import sinon from 'sinon'

import PublicIPAddressResolver from '../lib/PublicIPAddressResolver.js'

describe('PublicIPAddressResolver', () => {
  let resolver

  beforeEach(() => {
    resolver = new PublicIPAddressResolver()
    resolver._api = sinon.stub().yieldsAsync(null, "10.0.0.1")
  })

  describe('resolve()', () => {
    it('should call the _api method', () =>
      resolver.resolve().then(() => assert(resolver._api.calledOnce))
    )

    it('should resolve to the IP address from the API call', () =>
      resolver.resolve().then(ip => assert.strictEqual(ip, "10.0.0.1"))
    )

    describe('when resolver API is failing', () => {
      beforeEach(() => {
        resolver._api.yieldsAsync(new Error('Failed to connect'))
      })

      it('should reject with an error', () =>
        resolver.resolve().then(
          () => Promise.reject(new Error('Should not have resolved.')),
          () => Promise.resolve()
        )
      )
    })
  })


  describe('change event', () => {
    beforeEach(() => {
      sinon.stub(global, 'setInterval').returns(8)
      sinon.stub(global, 'clearInterval')
    })

    afterEach(() => {
      global.setInterval.restore()
      global.clearInterval.restore()
    })

    it('should be emitted when the result of resolve() changes', () =>
      new Promise((resolve, reject) => {
        resolver.on('change', ip => resolve())
        resolver.resolve()
          .then(() => resolver._api.yieldsAsync(null, '10.1.1.1'))
          .then(() => resolver.resolve())
      })
    )

    it('should not be emitted when the result of resolve does not change', () =>
      new Promise((resolve, reject) => {
        resolver.on('change', ip => reject(new Error('change event emitted')))
        resolver.resolve()
          .then(ip => resolver.resolve())
          .then(() => resolve())
      })
    )

    describe('on("change")', () => {
      it('should cause setInterval to be called', () => {
        resolver.on('change', ip => {})
        assert(setInterval.calledOnce, 'setInterval was not called')
      })

      it('should only cause setInterval to be called once', () => {
        resolver.on('change', ip => {})
        resolver.on('change', ip => {})
        assert.strictEqual(setInterval.callCount, 1)
      })

      it('should cause an API call if resolve() has not already been called', () => {
        resolver.on('change', ip => {})
        assert(resolver._api.calledOnce, 'resolver API was not called')
      })

      it('should not cause an API call if resolve() has already been called', () =>
        resolver.resolve().then(ip => {
          resolver.on('change', ip => {})
          assert.strictEqual(resolver._api.callCount, 1)
        })
      )
    })

    describe('removeAllListeners("change")', () => {
      it('should cause clearInterval to be called', () => {
        resolver.on('change', ip => {})
        resolver.removeAllListeners('change')
        assert(clearInterval.calledOnce, 'clearInterval was not called')
      })
    })
  })

  describe('error event', () => {
    beforeEach(() => {
      resolver._api.yieldsAsync(new Error('Failed to connect'))
    })

    it('should not be emitted unless it is being listened for', () =>
      resolver.resolve().catch(() => new Promise((resolve, reject) =>
        setImmediate(resolve)
      ))
    )

    it('should be emitted when it is being listened for', () =>
      new Promise((resolve, reject) => {
        resolver.on('error', resolve)
        resolver.resolve()
      })
    )
  })
})
