import styled from 'styled-components'
import tw from 'tailwind.macro'

const LoadingSpinner = ({ className }) => (
  <div className={className} />
)

export default styled(LoadingSpinner)`
  ${tw`inline-block`}

  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.2rem solid rgba(255, 255, 255, 0.2);
  border-right: 0.2rem solid rgba(255, 255, 255, 0.2);
  border-bottom: 0.2rem solid rgba(255, 255, 255, 0.2);
  border-left: 0.2rem solid #ffffff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: loading-spinner 1.1s infinite linear;
  animation: loading-spinner 1.1s infinite linear;

  &,
  &:after {
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
  }

  @-webkit-keyframes loading-spinner {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes loading-spinner {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`