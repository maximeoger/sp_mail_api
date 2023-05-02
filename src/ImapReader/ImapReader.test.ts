import sinon from 'sinon'
import Imap from 'imap'
import ImapReader from './ImapReader'

jest.mock('imap', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: () => { console.log('MOCK CONNECT') }
    }
  })
})

describe('ImapReader', () => {

  let imapReader = new ImapReader()
  let imapMock = new Imap({
    user: "",
    password: "",
    host: "",
    port: 993,
    tls: true
  })

  it('connect should create and store imap connection in class attribute', () => {
    imapReader.connect()
    expect(imapMock.connect).toHaveBeenCalled()
  })
})