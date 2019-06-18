import styled from 'styled-components'
import tw from 'tailwind.macro'

const LoadingGrid = ({ className }) => (
  <div className={className}>
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
)

export default styled(LoadingGrid)`
${tw`w-32 h-32`}

  div {
    ${tw`w-1/3 bg-gray-500 float-left`}
    height: 33%;
    -webkit-animation: loading-grid 1.3s infinite ease-in-out;
    animation: loading-grid 1.3s infinite ease-in-out;
  }

  div:nth-child(1) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  div:nth-child(2) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }

  div:nth-child(3) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  div:nth-child(4) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }

  div:nth-child(5) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  div:nth-child(6) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }

  div:nth-child(7) {
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
  }

  div:nth-child(8) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }

  div:nth-child(9) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  @-webkit-keyframes loading-grid {
    0%,
    70%,
    100% {
      -webkit-transform: scale3D(1, 1, 1);
      transform: scale3D(1, 1, 1);
    }
    35% {
      -webkit-transform: scale3D(0, 0, 1);
      transform: scale3D(0, 0, 1);
    }
  }

  @keyframes loading-grid {
    0%,
    70%,
    100% {
      -webkit-transform: scale3D(1, 1, 1);
      transform: scale3D(1, 1, 1);
    }
    35% {
      -webkit-transform: scale3D(0, 0, 1);
      transform: scale3D(0, 0, 1);
    }
  }
`