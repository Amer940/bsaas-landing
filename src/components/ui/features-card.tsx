import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './card'
import { cn } from '#/lib/utils.ts'

const featureCardVariants = cva(
  'rounded-none border-border overflow-hidden gap-0 shadow-none',
  {
    variants: {
      variant: {
        default: 'bg-white relative',
      },
      textPosition: {
        top: 'pt-4 px-2 pb-2',
        bottom: 'pt-2 px-2 pb-[0.625rem]',
      },
    },
    defaultVariants: {
      variant: 'default',
      textPosition: 'top',
    },
  },
)

interface FeatureCardProps
  extends
    React.ComponentProps<'div'>,
    VariantProps<typeof featureCardVariants> {
  title?: string
  description?: string
  media?: React.ReactNode
}

function FeatureCard({
  className,
  variant,
  textPosition,
  title,
  description,
  media,
  ...props
}: FeatureCardProps) {
  const isBottom = textPosition === 'bottom'

  return (
    <Card
      className={cn(featureCardVariants({ variant, textPosition }), className)}
      {...props}
    >
      {!isBottom && (
        <CardHeader className="gap-2 p-0 mb-6">
          <CardTitle className="text-18-medium text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-14-regular text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
      )}

      {media && (
        <CardContent className="p-0 flex-1 h-full w-full">
          <div className="rounded-sm overflow-hidden">{media}</div>
        </CardContent>
      )}

      {isBottom && (
        <CardHeader className="gap-2 p-0 mt-6">
          <CardTitle className="text-18-medium text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-14-regular text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
      )}
    </Card>
  )
}

export { FeatureCard, featureCardVariants }
