import AddAPage from './modals/add-a-page'
import DuplicatePage from './modals/duplicate-page'
import Icon, { ICON_ADD, ICON_CHEVRON_DOWN, ICON_DUPLICATE } from './icon'

const PageSelector = ({
  pages,
  currentPage,
  onEdit,
  onNavigate,
  setModalContent
}) => (
  <header className="w-full bg-white border-b border-gray-400">
    <div className="h-10 flex">
      <div className="w-full inline-block relative">
        <select
          value={currentPage.path}
          onChange={event => onNavigate(event.target.value)}
          className="w-full h-full block appearance-none rounded-none bg-white text-2xl leading-tight hover:bg-gray-200 focus:outline-none focus:bg-gray-200 pl-4 pr-8"
          title="Navigate to a different page"
        >
          {pages.map(({ path, name }) => {
            return (
              <option key={path} value={path}>
                {name}
              </option>
            )
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <Icon type={ICON_CHEVRON_DOWN} />
        </div>
      </div>
      <div className="border-l border-gray-400">
        <button
          onClick={() => setModalContent(<AddAPage onEdit={onEdit} onNavigate={onNavigate} />)}
          className="w-10 h-full text-gray-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
          title="Add a new page"
        >
          <Icon type={ICON_ADD} className="mx-auto" />
        </button>
      </div>
      <div className="border-l border-gray-400">
        <button
          onClick={() => setModalContent(<DuplicatePage page={currentPage} onEdit={onEdit} onNavigate={onNavigate} />)}
          className="w-10 h-full text-gray-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
          title="Duplicate this page"
        >
          <Icon type={ICON_DUPLICATE} className="h-6 w-6 mx-auto" />
        </button>
      </div>
    </div>
  </header>
)

export default PageSelector
