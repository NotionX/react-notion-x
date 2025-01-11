export function LazyImage({
  src,
  alt,
  className,
  style,
  height,
  priority = false
}: {
  src?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  height?: number
  priority?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      height={height}
      loading={priority ? 'eager' : 'lazy'} // Native lazy loading
      decoding='async' // For better performance and asynchronous decoding
    />
  )
}
