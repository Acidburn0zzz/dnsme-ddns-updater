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
})
