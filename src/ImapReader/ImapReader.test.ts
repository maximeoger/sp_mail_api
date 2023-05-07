import EventEmitter from 'events'
import sinon from 'sinon'
import Imap from 'imap'
import ImapReader from './ImapReader'

let mockImap = {
  connect: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  // openBox: jest.fn()
}

jest.mock('imap', () => {
  return jest.fn().mockImplementation(() => {
    return {

    }
  })
})

describe('ImapReader', () => {

  describe('connect', () => {
    it('Should create and store imap connection in class attribute', () => {
     // imapReader.connect()
    })
  })

  describe('openMailBox', () => {
    let imapClient

    it.only('Should reject promise if error', async () => {
       //let mailBox = await imapReader.openMailBox()

    })
  })

})