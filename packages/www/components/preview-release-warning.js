import { P } from './typography'

const PreviewReleaseWarning = () => (
  <div className="z-10 w-full text-center bg-yellow-200 border-b border-gray-400">
    <P>
      <span className="text-base">
        🚧 Please note this is an early preview release and is definitely full
        of bugs! 🚧
      </span>
    </P>
  </div>
)

export default PreviewReleaseWarning
