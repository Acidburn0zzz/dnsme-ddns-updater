import assert from 'assert'
import sinon from 'sinon'

import Updater from '../lib/RecordUpdater.js'

describe('RecordUpdater', () => {
  let updater, fetchStub

  const username = `bob@example.com`
  const password = `xyzzy`
  const recordId = `foo`

  it('should throw when not given options object', () => {
    assert.throws(() => new Updater())
  })

  it('should throw when not given username parameter', () => {
    assert.throws(() => new Updater({password, recordId}))
  })

  it('should throw when not given password parameter', () => {
    assert.throws(() => new Updater({username, recordId}))
  })

  it('should throw when not given recordId parameter', () => {
    assert.throws(() => new Updater({username, password}))
  })

  describe('updateRecord()', () => {
    beforeEach(() => {
      updater = new Updater({ username, password, recordId })
      updater._fetch = fetchStub = sinon.stub().returns(Promise.resolve())
    })

    it('should call fetch with the correct DNS Made Easy URL', () =>
      updater.updateRecord('10.0.0.1').then(() => {
        assert(fetchStub.calledOnce, 'fetch is called once')
        assert(fetchStub.calledWithMatch(/^https:\/\/cp\.dnsmadeeasy\.com\/servlet\/updateip\?/))
      })
    )

    it('should call fetch with the correct username parameter', () =>
      updater.updateRecord('10.0.0.1').then(() => {
        assert(fetchStub.calledWithMatch(/\?.*username=bob%40example.com\b/))
      })
    )

    it('should call fetch with the correct password parameter', () =>
      updater.updateRecord('10.0.0.1').then(() => {
        assert(fetchStub.calledWithMatch(/\?.*password=xyzzy\b/))
      })
    )

    it('should call fetch with the correct record ID', () =>
      updater.updateRecord('10.0.0.1').then(() => {
        assert(fetchStub.calledWithMatch(/\?.*id=foo\b/))
      })
    )

    it('should call fetch with the correct IP address', () =>
      updater.updateRecord('10.0.0.1').then(() => {
        assert(fetchStub.calledWithMatch(/\?.*ip=10.0.0.1\b/))
      })
    )
  })
})
