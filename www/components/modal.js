import ReactModal from 'react-modal'

const Modal = ({ isOpen, onRequestClose, children }) => (
  <ReactModal
    appElement={
      typeof document !== 'undefined' && document.querySelector('__next')
    }
    ariaHideApp={typeof document === 'undefined' && false}
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    className="w-full h-full max-w-2xl overflow-y-scroll rounded shadow bg-white p-8"
    overlayClassName="fixed flex justify-center items-center top-0 left-0 right-0 bottom-0"
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)'
      },
      content: {
        maxHeight: '36rem'
      }
    }}
  >
    {children}
  </ReactModal>
)

export default Modal
