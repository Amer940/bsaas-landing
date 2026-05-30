import React from 'react'

interface FeatureItemProps {
  text: string
  dotSrc?: string
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text, dotSrc }) => {
  return (
    <div className="flex gap-4 items-center">
      {dotSrc ? (
        <img src={dotSrc} alt="" aria-hidden="true" />
      ) : (
        <span
          className="w-2 h-2 rounded-full md:bg-current/20 bg-primary shrink-0"
          aria-hidden="true"
        />
      )}
      <p className="text-16-regular">{text}</p>
    </div>
  )
}

export default FeatureItem
