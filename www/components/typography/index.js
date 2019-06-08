import styled from 'styled-components'
import tw from 'tailwind.macro'

const baseHeadingStyles = tw`font-bold leading-none`

export const H1 = styled.h1`${baseHeadingStyles} ${tw`text-5xl`}`
export const H2 = styled.h2`${baseHeadingStyles} ${tw`text-4xl`}`
export const H3 = styled.h2`${baseHeadingStyles} ${tw`text-3xl`}`
export const P = styled.p`${tw`leading-normal text-lg`}`
export const Small = styled.small`${tw`block leading-snug text-xs text-gray-700`}`
