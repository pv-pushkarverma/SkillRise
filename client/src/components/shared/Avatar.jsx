import { useState } from 'react'

const Avatar = ({ name = '?', imageUrl, size = 'md' }) => {
  const [imgErr, setImgErr] = useState(false)
  const cls =
    size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-11 h-11 text-base' : 'w-9 h-9 text-sm'

  if (imageUrl && !imgErr) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setImgErr(true)}
        className={`${cls} rounded-full object-cover shrink-0`}
      />
    )
  }

  return (
    <div
      className={`${cls} rounded-full bg-teal-100 text-teal-700 font-semibold flex items-center justify-center shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default Avatar
