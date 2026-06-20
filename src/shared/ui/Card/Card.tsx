import * as React from 'react'
import { Card as RadixCard, Box, Heading, Text, Flex } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";

const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixCard>
>((props, ref) => {
  useLogLifecycle("Card");
  return (
    <RadixCard
      ref={ref}
      {...props}
    />
  )
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Box>
>((props, ref) => (
  <Box
    ref={ref}
    p="4"
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Heading>
>((props, ref) => (
  <Heading
    ref={ref}
    size="4"
    weight="bold"
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Text>
>((props, ref) => (
  <Text
    ref={ref}
    size="2"
    color="gray"
    as="p"
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Box>
>((props, ref) => (
  <Box ref={ref} p="4" pt="0" {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Flex>
>((props, ref) => (
  <Flex
    ref={ref}
    p="4"
    pt="0"
    align="center"
    gap="2"
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
