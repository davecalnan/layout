import { useState } from 'react'
import { H2, Label } from '../typography'
import { Input } from '../form-controls'
import Button from '../button'

const SetSubdomain = ({ onComplete }) => {
  const [subdomain, setSubdomain] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    onComplete(subdomain)
  }

  return (
    <>
      <H2 className="mb-4">Set your site's subdomain</H2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-6">
          <Label>Subdomain (comes before ***.onlayout.co)</Label>
          <Input
            type="text"
            placeholder="your-site"
            value={subdomain}
            onChange={event => setSubdomain(event.target.value)}
            required
          />
        </div>
        <Button action="primary" type="submit">Create site</Button>
      </form>
    </>
  )
}

export default SetSubdomain