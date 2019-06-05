import Frame from 'react-frame-component'

const Browser = ({ url, content }) => (
  <div className="flex flex-col h-full w-full">
    <header className="flex justify-between shadow bg-gray-300 px-4 py-2">
      <div className="w-20 flex justify-start items-center">
        <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600"  />
      </div>
      <span className="w-96 rounded bg-white text-center truncate shadow">{url}</span>
      <div className="w-20 shadow">
        <a
          href={url}
          target="blank"
          rel="noreferrer noopener"
          className="block rounded bg-white text-center px-2"
        >
          View &rarr;
        </a>
      </div>
    </header>
    <Frame
      initialContent='<!DOCTYPE html><html><head><link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></head><body><div></div></body></html>'
      className="flex-1"
    >
      {content}
    </Frame>
  </div>
)

export default Browser
