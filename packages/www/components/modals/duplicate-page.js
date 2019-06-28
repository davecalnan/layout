import { useState } from 'react'
import { ADD_PAGE_TO_SITE } from '../../reducers/site'
import { H2, Label } from '../typography'
import { Input } from '../form-controls'
import Button from '../button'

const DuplicatePage = ({ page, onEdit, onNavigate }) => {
  const [name, setName] = useState(`${page.name} copy`)
  const [path, setPath] = useState()

  const handleSubmit = event => {
    event.preventDefault()
    onEdit({
      type: ADD_PAGE_TO_SITE,
      payload: {
        ...page,
        name,
        path
      }
    })
    onNavigate(path)
  }

  return (
    <>
      <H2 className="mb-4">Duplicate page</H2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-6">
          <Label>Name</Label>
          <Input
            type="text"
            placeholder="About"
            value={name}
            onChange={event => setName(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mb-6">
          <Label>Path</Label>
          <Input
            type="text"
            placeholder="/about"
            value={path}
            onChange={event => setPath(event.target.value)}
            required
          />
        </div>
        <Button action="primary" type="submit">Create</Button>
      </form>
    </>
  )
}

export default DuplicatePage