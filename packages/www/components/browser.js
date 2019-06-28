import Button from './button'

const Browser = ({ url, content, canView }) => (
  <div className="flex flex-col h-full w-full">
    <header className="h-10 flex justify-between items-center shadow bg-gray-300 z-0 px-4">
      <div className="w-20 flex justify-start items-center">
        <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600" />
      </div>
      <span className="w-96 rounded bg-white text-center truncate shadow">
        {url}
      </span>
      <Button className="w-20" disabled={!canView} href={url} compact openInNewTab>
        View &rarr;
      </Button>
    </header>
    {content}
  </div>
)

export default Browser
