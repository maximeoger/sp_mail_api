import { removeStyleTag } from "./writeToFile";


describe('removeStyleTag', () => {
  it('should remove style tag in html if tag is fully inside the string', () => {
    const output = removeStyleTag("<html><style> p { color: red; }</style><p>coucou</p></html>")
    expect(output).toEqual("<html><p>coucou</p></html>")
  })

  it('should remove style tag in html even if tag-start is partially inside the string', () => {
    const output = removeStyleTag("<html><style> p { col")
    expect(output).toEqual("<html>")
  })

  it('should remove style tag in html even if tag-end is partially inside the string', () => {
    const output = removeStyleTag("or: red; }</style><p>coucou</p></html>")
    expect(output).toEqual("<p>coucou</p></html>")
  })
})