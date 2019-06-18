import styled from 'styled-components'
import tw from 'tailwind.macro'

const LoadingDots = ({ className }) => (
  <div className={className}>
    <div />
    <div />
    <div />
  </div>
)

export default styled(LoadingDots)`
  ${tw`w-20 flex justify-between`}

  div {
    ${tw`w-5 h-5 inline-block rounded-full bg-gray-500`}
    -webkit-animation: loading-dots 1.4s infinite ease-in-out both;
    animation: loading-dots 1.4s infinite ease-in-out both;
  }

  div:nth-child(1) {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  div:nth-child(2) {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes loading-dots {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes loading-dots {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
`