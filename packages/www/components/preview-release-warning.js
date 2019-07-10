import { P } from './typography'

const PreviewReleaseWarning = () => (
  <div className="w-full text-center bg-yellow-200">
    <P>
      <span className="text-base">
        🚧 Please note this is an early preview release and is definitely full
        of bugs! 🚧
      </span>
    </P>
  </div>
)

export default PreviewReleaseWarning
